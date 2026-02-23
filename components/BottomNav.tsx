"use client";

import { Home, Calendar, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white border-t shadow-sm">
      <div className="flex justify-around items-center py-2">
        
        {/* Home */}
        <div
          onClick={() => router.push("/")}
          className="flex flex-col items-center cursor-pointer text-teal-600"
        >
          <Home size={22} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </div>

        {/* Book Appointment */}
        <div
          onClick={() => router.push("/doctors")}
          className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-teal-600 transition"
        >
          <Calendar size={22} />
          <span className="text-xs mt-1 font-medium">Book Appointment</span>
        </div>

        {/* Records */}
        <div
          onClick={() => router.push("/appointments")}
          className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-teal-600 transition"
        >
          <FileText size={22} />
          <span className="text-xs mt-1 font-medium">Records</span>
        </div>

        {/* Profile */}
        <div
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-teal-600 transition"
        >
          <User size={22} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </div>

      </div>
    </div>
  );
}