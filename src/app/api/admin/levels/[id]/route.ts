import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const user = await prisma.user.findUnique({ where: { id: (session.user as SessionUser).id } });
  if (user?.role !== "ADMIN") return null;
  return session;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const { number, title, prompt, hint, assetUrl, content, answers } = body ?? {};

    // Normalize optional fields: convert empty strings to null, ensure strings where expected
    const normalizedData: Record<string, unknown> = {
      number: number !== undefined ? Number(number) : undefined,
      title: typeof title === "string" ? title : undefined,
      prompt: typeof prompt === "string" ? prompt : undefined,
      hint: typeof hint === "string" ? (hint.length ? hint : null) : undefined,
      assetUrl: typeof assetUrl === "string" ? (assetUrl.length ? assetUrl : null) : undefined,
      content: typeof content === "string" ? (content.length ? content : null) : undefined,
    };

    const updated = await prisma.level.update({
      where: { id },
      data: normalizedData,
    });
    // Only replace answers if provided and non-empty; ignore when blank to preserve existing
    if (typeof answers === "string" && answers.trim().length > 0) {
      await prisma.levelAnswer.deleteMany({ where: { levelId: id } });
      const normalized = answers.replace(/\r\n/g, "\n");
      const list: string[] = normalized
        .split(/[\n,]/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0);
      const unique = Array.from(new Set(list));
      for (const ans of unique) {
        await prisma.levelAnswer.create({ data: { levelId: id, answerHash: await bcrypt.hash(ans, 10) } });
      }
    }
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Level number must be unique" }, { status: 409 });
    }
    console.error("Update level error:", error);
    const message = process.env.NODE_ENV !== "production" && err?.message ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.level.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


