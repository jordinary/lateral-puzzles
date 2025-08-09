import { Resend } from 'resend';

// Only create Resend instance if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email service not configured - logging email instead:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('From:', options.from || process.env.EMAIL_FROM || 'noreply@lateral-puzzles.com');
    console.log('HTML Content:', options.html);
    throw new Error('Email service not configured');
  }

  try {
    const resend = getResend();
    if (!resend) {
      throw new Error('Email service not configured');
    }

    const { data, error } = await resend.emails.send({
      from: options.from || process.env.EMAIL_FROM || 'noreply@lateral-puzzles.com',
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

export function createPasswordResetEmail(email: string, resetUrl: string) {
  const subject = 'Reset Your Password - Lateral Puzzles';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #000;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background: #000;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .button:hover {
          background: #333;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #666;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧩 Lateral Puzzles</h1>
      </div>
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>Hello!</p>
        <p>We received a request to reset your password for your Lateral Puzzles account. Click the button below to create a new password:</p>
        
        <a href="${resetUrl}" class="button">Reset Password</a>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong>
          <ul>
            <li>This link will expire in 1 hour</li>
            <li>If you didn't request this password reset, you can safely ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
        
        <p>Thanks,<br>The Lateral Puzzles Team</p>
      </div>
      <div class="footer">
        <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
        <p>© 2024 Lateral Puzzles. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export function createWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to Lateral Puzzles!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Lateral Puzzles</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #000;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background: #000;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .button:hover {
          background: #333;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧩 Lateral Puzzles</h1>
      </div>
      <div class="content">
        <h2>Welcome to Lateral Puzzles, ${name}!</h2>
        <p>Thank you for joining our community of puzzle enthusiasts! 🎉</p>
        
        <p>You're now ready to embark on a journey through mind-bending lateral thinking puzzles. Each level will challenge you to think outside the box and discover creative solutions.</p>
        
        <a href="${process.env.NEXTAUTH_URL}/levels" class="button">Start Solving Puzzles</a>
        
        <h3>What to expect:</h3>
        <ul>
          <li>🎯 Progressive difficulty levels</li>
          <li>🧠 Lateral thinking challenges</li>
          <li>🎨 Retro-styled puzzle interface</li>
          <li>🏆 Track your progress</li>
        </ul>
        
        <p>Ready to test your lateral thinking skills? Click the button above to start your first puzzle!</p>
        
        <p>Happy puzzling!<br>The Lateral Puzzles Team</p>
      </div>
      <div class="footer">
        <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
        <p>© 2024 Lateral Puzzles. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
