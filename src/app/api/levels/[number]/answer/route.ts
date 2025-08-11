import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export async function POST(request: Request, context: { params: Promise<{ number: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.redirect(new URL("/login", request.url));
  const userId = (session.user as SessionUser).id;

  const p = await context.params;
  const number = Number(p.number);
  if (!Number.isFinite(number)) return NextResponse.json({ error: "Invalid level" }, { status: 400 });

  const form = await request.formData();
  const answerRaw = (form.get("answer") ?? "").toString().trim();
  if (!answerRaw) return NextResponse.json({ error: "Missing answer" }, { status: 400 });

  const normalized = answerRaw.toLowerCase();

  const level = await prisma.level.findUnique({ where: { number }, include: { answers: true } });
  if (!level) return NextResponse.json({ error: "Level not found" }, { status: 404 });

  // Check any stored hashed answers
  let correct = false;
  for (const a of level.answers) {
    if (await bcrypt.compare(normalized, a.answerHash)) {
      correct = true;
      break;
    }
  }
  if (!correct) {
    await prisma.answerAttempt.create({
      data: { userId, levelId: level.id, isCorrect: false, answerText: normalized },
    });
    return NextResponse.json({ 
      success: false, 
      message: "Nope! Try again." 
    });
  }

  // Mark solved and unlock next level
  await prisma.$transaction(async (tx) => {
    await tx.answerAttempt.create({
      data: { userId, levelId: level.id, isCorrect: true, answerText: normalized },
    });
    await tx.levelSolve.upsert({
      where: { userId_levelId: { userId, levelId: level.id } },
      update: {},
      create: { userId, levelId: level.id },
    });

    const nextLevel = await tx.level.findUnique({ where: { number: level.number + 1 } });
    if (nextLevel) {
      await tx.levelUnlock.upsert({
        where: { userId_levelId: { userId, levelId: nextLevel.id } },
        update: {},
        create: { userId, levelId: nextLevel.id },
      });
    }
  });

  return NextResponse.json({ 
      success: true, 
      message: "Correct! Moving to next level...",
      nextLevel: level.number + 1
    });
}

export const runtime = "nodejs";


