import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // In a real application, you would send an email here
    // For now, we'll just return the reset token in the response
    // In production, you should use a proper email service like SendGrid, Mailgun, etc.
    
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    console.log(`Password reset URL for ${email}: ${resetUrl}`);

    return NextResponse.json({ 
      message: "If an account with that email exists, a password reset link has been sent.",
      // Remove this in production - only for development
      resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
