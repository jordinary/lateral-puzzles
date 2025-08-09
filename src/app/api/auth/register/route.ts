import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, createWelcomeEmail } from "@/lib/email";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });

    // Unlock level 1 for new users if it exists
    const levelOne = await prisma.level.findUnique({ where: { number: 1 } });
    if (levelOne) {
      await prisma.levelUnlock.upsert({
        where: { userId_levelId: { userId: user.id, levelId: levelOne.id } },
        update: {},
        create: { userId: user.id, levelId: levelOne.id },
      });
    }

    // Send welcome email (don't block registration if email fails)
    try {
      const { subject, html } = createWelcomeEmail(email, name || 'Puzzle Enthusiast');
      await sendEmail({
        to: email,
        subject,
        html,
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email sending fails
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


