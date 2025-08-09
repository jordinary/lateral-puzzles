import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, createPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(`forgot-password:${email}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many password reset requests. Please wait before trying again.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
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

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    try {
      // Send password reset email
      const { subject, html } = createPasswordResetEmail(email, resetUrl);
      await sendEmail({
        to: email,
        subject,
        html,
      });

      console.log(`Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      
      // In development, still return the reset URL for testing
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({ 
          message: "If an account with that email exists, a password reset link has been sent.",
          resetUrl,
          error: "Email service not configured - using development mode"
        });
      }
      
      // In production, don't expose the reset URL
      return NextResponse.json({ 
        message: "If an account with that email exists, a password reset link has been sent.",
        error: "Email service temporarily unavailable"
      });
    }

    return NextResponse.json({ 
      message: "If an account with that email exists, a password reset link has been sent."
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
