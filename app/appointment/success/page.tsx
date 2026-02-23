"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { doctors } from "@/lib/mock-data";

const AppointmentSuccessPage = () => {
  const router = useRouter();
  const doctor = doctors[0]; // Replace with dynamic doctor if needed

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 pulse-glow"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
          <CheckCircle size={48} className="text-green-600" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-gray-900 mb-2"
      >
        Booking Confirmed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 text-center mb-8"
      >
        Your appointment has been successfully booked
      </motion.p>

      {/* Appointment Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-5 space-y-4 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-gray-500">{doctor.specialty}</p>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Appointment #</span>
          <span className="font-bold text-gray-900">#34</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>Feb 20, 2026</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>10:00 AM</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full mt-6 space-y-3"
      >
        <button className="w-full py-4 rounded-2xl bg-teal-600 text-white font-semibold shadow-lg flex items-center justify-center gap-2">
          <Calendar size={18} />
          Add to Calendar
        </button>
        <button
          onClick={() => router.push("/doctors")}
          className="w-full py-4 rounded-2xl bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-2"
        >
          View My Appointments
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default AppointmentSuccessPage;