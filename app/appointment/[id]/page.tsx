"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { doctors, timeSlots } from "@/lib/mock-data";
import { DAYS, MONTHS } from "@/lib/constants";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function AppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const doctor = doctors.find((d) => d.id.toString() === id);

  if (!doctor)
    return (
      <div className="p-10 text-center text-black text-lg font-semibold">
        Doctor not found
      </div>
    );

  const today = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [favoriteSlot, setFavoriteSlot] = useState<string | null>(null);

  /* ---------------- Month Navigation ---------------- */

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /* ---------------- Calendar Logic ---------------- */

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isPastDate = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return dateToCheck < todayStart;
  };

  const getDayOfWeek = (day: number) => {
    return new Date(currentYear, currentMonth, day).getDay();
  };

  /* ---------------- Slot Filtering ---------------- */

  const morningSlots = timeSlots.filter((s) => s.period === "morning");
  const afternoonSlots = timeSlots.filter((s) => s.period === "afternoon");
  const eveningSlots = timeSlots.filter((s) => s.period === "evening");

  const getAvailableSlots = (slots: typeof timeSlots) => {
    return slots.map((slot) => ({
      ...slot,
      available:
        !isPastDate(selectedDate) &&
        (selectedDate + slot.time.length) % 2 !== 0,
    }));
  };

  const handleBook = () => {
    if (!selectedSlot) return;
    const success = Math.random() > 0.3;
    router.push(success ? "/appointment/success" : "/appointment/failure");
  };

  /* ---------------- Slot Component ---------------- */

  const SlotGroup = ({
    title,
    slots,
  }: {
    title: string;
    slots: typeof timeSlots;
  }) => {
    const availableSlots = getAvailableSlots(slots);

    return (
      <div className="mb-10">
        <h3 className="text-lg font-bold text-black mb-5 tracking-wide">
          {title}
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {availableSlots.map((slot) => (
            <div key={slot.time} className="flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
                className={`relative py-3 rounded-xl text-sm font-semibold border w-full transition
                  ${
                    !slot.available
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : selectedSlot === slot.time
                      ? "bg-teal-600 text-white border-teal-600 shadow-md"
                      : "bg-white text-black border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {slot.time}

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavoriteSlot(
                      favoriteSlot === slot.time ? null : slot.time
                    );
                  }}
                  className="absolute top-1 right-1 cursor-pointer"
                >
                  <Star
                    size={14}
                    className={`transition ${
                      favoriteSlot === slot.time
                        ? "text-teal-600 fill-teal-600"
                        : "text-gray-300"
                    }`}
                  />
                </span>
              </motion.button>

              {slot.available && (
                <span className="mt-1 text-xs text-gray-600 font-medium">
                  {Math.floor(Math.random() * 3) + 1} slots left
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex flex-col pb-28 max-w-4xl mx-auto bg-white relative">

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-white shadow-md hover:shadow-lg transition font-semibold text-black"
        >
          Back
        </button>
      </div>

      {/* Doctor Header Background - BLUE */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-b-[3rem] shadow-2xl" />

        <div className="flex justify-center -mt-28 relative z-10">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-52 h-52 rounded-3xl object-cover shadow-xl border-4 border-white"
          />
        </div>
      </div>

      {/* Doctor Info */}
      <div className="px-6 sm:px-12 mt-6 text-center">
        <h1 className="text-3xl font-extrabold text-black">
          {doctor.name}
        </h1>
        <p className="text-blue-700 mt-2 text-lg font-semibold">
          {doctor.specialty}
        </p>
      </div>

      {/* Calendar */}
      <div className="px-4 sm:px-12 mt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="text-blue-700 w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-black">
            {MONTHS[currentMonth]} {currentYear}
          </h2>

          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="text-blue-700 w-6 h-6" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center mb-4 text-sm font-bold">
          {DAYS.map((d, index) => (
            <div
              key={d}
              className={
                index === 0
                  ? "text-red-500"
                  : index === 1
                  ? "text-blue-600"
                  : "text-gray-700"
              }
            >
              {d}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {dates.map((day) => {
            const past = isPastDate(day);
            const dayOfWeek = getDayOfWeek(day);

            return (
              <button
                key={day}
                disabled={past}
                onClick={() => !past && setSelectedDate(day)}
                className={`py-3 rounded-xl border font-bold transition
                  ${
                    past
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : selectedDate === day
                      ? "bg-teal-600 text-white border-teal-600 shadow-md"
                      : dayOfWeek === 0
                      ? "bg-red-50 text-red-500 border-red-200"
                      : dayOfWeek === 1
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-white text-black border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots */}
      <div className="px-4 sm:px-12 mt-12">
        <h2 className="text-2xl font-bold mb-8 text-black">
          Available Slots
        </h2>

        <SlotGroup title="Morning" slots={morningSlots} />
        <SlotGroup title="Afternoon" slots={afternoonSlots} />
        <SlotGroup title="Evening" slots={eveningSlots} />
      </div>

      {/* Book Button - TEAL */}
      <div className="px-4 sm:px-12">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBook}
          disabled={!selectedSlot}
          className={`w-full py-4 mt-6 rounded-xl font-bold text-lg transition
            ${
              selectedSlot
                ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Book Appointment
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}