"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function OTPPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(55);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    let interval: number;
    if (otpSent && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  /* -------- Auto send OTP if email exists -------- */
  useEffect(() => {
    if (email && !otpSent) {
      sendOtp();
    }
  }, [email]);

  /* ---------------- Input Handling ---------------- */
  const handleInput = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  /* ---------------- Send OTP ---------------- */
  const sendOtp = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.skipOtp) {
        setMessage("Your email is already verified. Redirecting...");
        setTimeout(() => router.push("/doctors"), 1500);
        return;
      }

      if (res.ok) {
        setOtpSent(true);
        setTimer(55);
        setMessage("OTP has been sent to your email.");
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Verify OTP ---------------- */
  const handleVerify = async () => {
    setError("");
    setMessage("");

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("OTP verified successfully! Redirecting...");
        setTimeout(() => router.push("/doctors"), 1500);
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT IMAGE PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
      >
        <img
          src="/heartbeat.gif"
          alt="Doctor"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 via-teal-600/70 to-blue-500/70 backdrop-blur-sm" />
        <div className="relative z-10 text-white text-center px-10">
          <h2 className="text-3xl font-bold mb-3">
            Secure Verification
          </h2>
          <p className="text-white/80">
            We’ve sent a verification code to your email.
            Enter it below to continue securely.
          </p>
        </div>
      </motion.div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 space-y-6"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl mb-3 shadow-md">
              🔐
            </div>
            <h1 className="text-2xl font-semibold">Verify OTP</h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-3 rounded-xl text-sm">
              {message}
            </div>
          )}

          {/* OTP Inputs */}
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleInput(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-14 h-14 text-center text-lg border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            ))}
          </div>

          {/* Timer */}
          <p className="text-sm text-gray-500 text-center">
            {timer > 0
              ? `Resend code in ${timer}s`
              : "Didn't receive the code?"}
          </p>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend Button */}
          {timer === 0 && (
            <Button
              onClick={sendOtp}
              disabled={loading}
              variant="outline"
              className="w-full border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              {loading ? "Sending..." : "Resend OTP"}
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}