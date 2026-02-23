// app/api/send-otp/route.ts
import nodemailer from "nodemailer";

// In-memory stores
let otpStore: Record<string, string> = {};          // Stores OTPs for emails
let verifiedEmails: Set<string> = new Set();       // Stores emails that have passed OTP verification

// POST → Send OTP
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return new Response("Email required", { status: 400 });

    // ✅ Skip OTP if email already verified
    if (verifiedEmails.has(email)) {
      return new Response(JSON.stringify({ success: true, skipOtp: true }), { status: 200 });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp;

    // Send OTP via nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return new Response(JSON.stringify({ success: false, error: "Email failed" }), { status: 500 });
  }
}

// PUT → Verify OTP
export async function PUT(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return new Response("Email and OTP required", { status: 400 });

    if (otpStore[email] === otp) {
      delete otpStore[email];
      verifiedEmails.add(email); // ✅ Mark email as verified
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid OTP" }), { status: 400 });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}