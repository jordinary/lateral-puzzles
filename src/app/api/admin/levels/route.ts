import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { number, title, prompt, hint, assetUrl, content, answers } = body ?? {};
    if (!number || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const level = await prisma.$transaction(async (tx) => {
      const created = await tx.level.create({
        data: {
          number: Number(number),
          title: String(title),
          prompt: typeof prompt === "string" ? prompt : "",
          hint: typeof hint === "string" && hint.length ? hint : null,
          assetUrl: typeof assetUrl === "string" && assetUrl.length ? assetUrl : null,
          content: typeof content === "string" && content.length ? content : null,
        },
      });

      const ansSource = typeof answers === "string" ? answers : "";
      if (ansSource) {
        const normalized = ansSource.replace(/\r\n/g, "\n");
        const properList = normalized.split(/[\n,]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
        const unique = Array.from(new Set(properList));
        for (const ans of unique) {
          await tx.levelAnswer.create({ data: { levelId: created.id, answerHash: await bcrypt.hash(ans, 10) } });
        }
      }

      return created;
    });

    return NextResponse.json({ id: level.id });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Level number must be unique" }, { status: 409 });
    }
    console.error("Create level error:", err);
    const message = process.env.NODE_ENV !== "production" && err?.message ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}


