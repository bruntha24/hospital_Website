export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ⚠️ WARNING: These will NOT work in production (Vercel). 
// Serverless functions are stateless. Use a database (Redis/Postgres) instead.
let otpStore: Record<string, { code: string; expires: number }> = {};
let verifiedEmails: Set<string> = new Set();

const OTP_EXPIRY_MS = 5 * 60 * 1000;

// Helper to create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ---------------- POST → Send OTP ----------------
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    // In production, check your DATABASE here
    if (verifiedEmails.has(email)) {
      return NextResponse.json({ success: true, skipOtp: true }, { status: 200 });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // In production, save this to your DATABASE
    otpStore[email] = {
      code: otp,
      expires: Date.now() + OTP_EXPIRY_MS,
    };

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Daisy Hospital" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Nodemailer Error:", err.message);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}

// ---------------- PUT → Verify OTP ----------------
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // In production, fetch from DATABASE
    const entry = otpStore[email];
    
    if (!entry) {
      return NextResponse.json({ success: false, error: "No OTP found" }, { status: 400 });
    }

    if (Date.now() > entry.expires) {
      delete otpStore[email];
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
    }

    if (entry.code === otp) {
      delete otpStore[email];
      verifiedEmails.add(email); // In production, update USER record in DATABASE
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}

// Handle other methods
export async function GET() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
