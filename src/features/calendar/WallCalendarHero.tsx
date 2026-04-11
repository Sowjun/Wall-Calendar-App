"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SpiralBinding } from "./SpiralBinding";
import { monthHeroImages, heroPlaces, fallbackHeroImage } from "./constants";

type WallCalendarHeroProps = {
  currentMonth: Date;
  primaryColor: string;
  accentColor: string;
};

export function WallCalendarHero({ currentMonth, primaryColor, accentColor }: WallCalendarHeroProps) {
  const monthIndex = currentMonth.getMonth();
  const [heroImage, setHeroImage] = useState(monthHeroImages[monthIndex]);
  const heroPlace = heroPlaces[monthIndex];
  const monthLabel = format(currentMonth, "MMMM").toUpperCase();
  const yearLabel = format(currentMonth, "yyyy");

  useEffect(() => {
    setHeroImage(monthHeroImages[monthIndex]);
  }, [monthIndex]);

  return (
    <section className="relative bg-white">
      <SpiralBinding />

      <div className="relative w-full h-56 md:h-[245px]">
        <img
          src={heroImage}
          alt={`${monthLabel} landscape`}
          className="h-full w-full object-cover"
          onError={() => setHeroImage(fallbackHeroImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(120deg, ${accentColor}22 0%, ${primaryColor}18 55%, transparent 100%)`,
          }}
        />

        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ x: 36, opacity: 0.7 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.42, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-52 h-44 md:w-64 md:h-52 overflow-hidden"
        >
          <div
            className="absolute inset-0 [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 70%)`,
              opacity: 0.9,
            }}
          />
          <div className="relative h-full w-full p-5 md:p-6 text-right text-white flex flex-col justify-end">
            <p className="text-sm md:text-base font-medium tracking-wide text-blue-100/95">{yearLabel}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider leading-none">{monthLabel}</h2>
          </div>
        </motion.div>

        <div className="absolute left-3 sm:left-4 md:left-6 bottom-2 sm:bottom-3 md:bottom-4 z-20 max-w-[65%]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/25 backdrop-blur-sm shadow-md">
            <MapPin size={12} className="text-white/90" />
            <span className="text-[11px] sm:text-xs text-white/90 font-medium truncate">{heroPlace.location}</span>
          </div>
          <h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-sm">{heroPlace.title}</h3>
        </div>
      </div>
    </section>
  );
}
