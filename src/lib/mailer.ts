/**
 * Mock Mailer Implementation
 * Logs emails to console instead of sending them via SMTP.
 * Once you have an SMTP server, you can replace this with nodemailer.
 */

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  console.log('----------------------------------------------------');
  console.log(`[MOCK MAILER] Sending VERIFICATION email to: ${email}`);
  console.log(`[MOCK MAILER] Link: ${verifyUrl}`);
  console.log('----------------------------------------------------');
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  console.log('----------------------------------------------------');
  console.log(`[MOCK MAILER] Sending PASSWORD RESET email to: ${email}`);
  console.log(`[MOCK MAILER] Link: ${resetUrl}`);
  console.log('----------------------------------------------------');
}
