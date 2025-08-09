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
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const { number, title, prompt, hint, assetUrl, content, answers } = body ?? {};
  const updated = await prisma.level.update({
    where: { id },
    data: {
      number: number !== undefined ? Number(number) : undefined,
      title,
      prompt,
      hint,
      assetUrl,
      content,
    },
  });
  if (answers !== undefined) {
    await prisma.levelAnswer.deleteMany({ where: { levelId: id } });
    const list: string[] = String(answers)
      .split(/[\n,]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);
    const unique = Array.from(new Set(list));
    for (const ans of unique) {
      await prisma.levelAnswer.create({ data: { levelId: id, answerHash: await bcrypt.hash(ans, 10) } });
    }
  }
  return NextResponse.json({ ok: true, id: updated.id });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.level.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


