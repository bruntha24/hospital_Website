// app/api/send-otp/route.ts
export const runtime = "node"; // ⚠️ Nodemailer requires Node.js runtime

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ---------------- In-memory stores ----------------
interface OtpEntry {
  code: string;
  expires: number; // timestamp
}
let otpStore: Record<string, OtpEntry> = {};     // Stores OTPs for emails
let verifiedEmails: Set<string> = new Set();     // Stores emails that passed OTP verification

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// ---------------- POST → Send OTP ----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    // ✅ Skip OTP if already verified
    if (verifiedEmails.has(email)) {
      return NextResponse.json({ success: true, skipOtp: true }, { status: 200 });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = {
      code: otp,
      expires: Date.now() + OTP_EXPIRY_MS,
    };

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"Daisy Hospital" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json({ success: false, error: "Email failed" }, { status: 500 });
  }
}

// ---------------- PUT → Verify OTP ----------------
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;
    const otp = body?.otp;

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP required" }, { status: 400 });
    }

    const entry = otpStore[email];
    if (entry && entry.code === otp) {
      // Check if OTP is expired
      if (Date.now() > entry.expires) {
        delete otpStore[email];
        return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
      }

      // ✅ OTP is valid
      delete otpStore[email];     // Remove OTP
      verifiedEmails.add(email);  // Mark email as verified
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
