"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  MessageSquare,
  Heart,
  Award,
  CheckCircle,
  Phone,
} from "lucide-react";
import { doctors } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";

export default function DoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const doctor = doctors.find((d) => d.id.toString() === id);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!doctor)
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Doctor not found
      </div>
    );

  const stats = [
    { icon: Users, label: "Patients", value: `${doctor.patients}+` },
    { icon: Clock, label: "Experience", value: `${doctor.experience} yrs` },
    { icon: Star, label: "Rating", value: doctor.rating.toString() },
    { icon: MessageSquare, label: "Reviews", value: doctor.reviews.toString() },
  ];

  return (
    <div className="pb-28 max-w-6xl mx-auto bg-white">

      {/* Hero/Header */}
      <div className="relative">
        <div className="h-56 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          {/* Subtle animated background circles */}
          <motion.div
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-32 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -50, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-20 -right-24 blur-3xl"
          />

          <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>

            {/* Heart toggle */}
            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
            >
              <Heart
                size={20}
                className={isFavorite ? "text-red-500" : "text-white"}
                fill={isFavorite ? "red" : "none"}
              />
            </motion.button>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="px-6 -mt-28 relative z-10"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row gap-10 border border-gray-100">

            {/* Left Section */}
            <div className="flex flex-col items-center lg:items-start lg:w-1/2 gap-6 text-center lg:text-left">
              <motion.img
                whileHover={{ scale: 1.05, rotate: 2 }}
                src={doctor.image}
                alt={doctor.name}
                className="w-44 h-44 rounded-3xl object-cover shadow-xl border-4 border-white"
              />

              <div>
                <h1 className="text-3xl font-bold text-black">{doctor.name}</h1>
                <p className="text-blue-600 font-medium text-lg mt-1">{doctor.specialty}</p>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Award size={18} className="text-teal-600" />
                {doctor.qualification}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 w-full">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-gray-50 rounded-2xl p-4 text-center shadow-sm border border-gray-100"
                  >
                    <stat.icon size={20} className="mx-auto text-blue-600 mb-2" />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg font-bold text-black"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col lg:w-1/2 gap-6 justify-between">

              {/* Favorite Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-2xl flex justify-center items-center gap-2 font-semibold shadow-sm transition ${
                  isFavorite
                    ? "bg-red-100 text-red-600"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                }`}
              >
                <Heart size={20} fill={isFavorite ? "red" : "none"} />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </motion.button>

              {/* Availability (non-sticky now) */}
              <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    doctor.availableToday ? "bg-teal-500" : "bg-gray-400"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-black">
                    {doctor.availableToday ? "Available Today" : "Not Available Today"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{doctor.timeRange}</p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-2xl font-medium hover:bg-teal-700 transition w-full justify-center shadow-md"
                >
                  <MessageSquare size={18} />
                  Message
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-3 rounded-2xl font-medium hover:bg-teal-100 transition w-full justify-center shadow-sm"
                >
                  <Phone size={18} />
                  Call
                </motion.button>
              </div>

              {/* Book Appointment */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/appointment/${doctor.id}`)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold text-lg shadow-xl flex items-center justify-center gap-2 transition hover:from-teal-700 hover:to-teal-800"
              >
                <CheckCircle size={20} />
                Book Appointment
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About & Services */}
      <div className="px-6 mt-14 space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-black">About Doctor</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{doctor.about}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">Services & Specialization</h2>
          <div className="flex flex-wrap gap-3">
            {doctor.services.map((s) => (
              <motion.span
                whileHover={{ scale: 1.05 }}
                key={s}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-teal-50 text-teal-700 border border-teal-100 shadow-sm"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}