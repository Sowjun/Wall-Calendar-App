"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  addMonths,
  subMonths,
  differenceInDays,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle2, Info, Moon, Sun, NotebookPen, PartyPopper, CalendarDays, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getHoliday } from "@/data/holidays";

const monthHeroImages = [
  "https://images.unsplash.com/photo-1457269449834-928af64c684d?q=80&w=1800&auto=format&fit=crop", // Jan
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1800&auto=format&fit=crop", // Feb
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1800&auto=format&fit=crop", // Mar
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop", // Apr
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1800&auto=format&fit=crop", // May
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1800&auto=format&fit=crop", // Jun
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1800&auto=format&fit=crop", // Jul
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop", // Aug
  "https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1800&auto=format&fit=crop", // Sep
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1800&auto=format&fit=crop", // Oct
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=1800&auto=format&fit=crop", // Nov
  "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1800&auto=format&fit=crop", // Dec
];
const heroPlaces = [
  { location: "Banff, Canada", title: "Pine Valley Outlook" },
  { location: "Zermatt, Switzerland", title: "Alpine Snow Trail" },
  { location: "Milford Sound, New Zealand", title: "Mountain Bridge Trail" },
  { location: "Manali, India", title: "Highland River Pass" },
  { location: "Hallstatt, Austria", title: "Lakeside Ridge Walk" },
  { location: "Kashmir, India", title: "Valley Bloom Route" },
  { location: "Dolomites, Italy", title: "Sunrise Cliff Path" },
  { location: "Ladakh, India", title: "Golden Plateau View" },
  { location: "Sapa, Vietnam", title: "Cloud Terrace Trek" },
  { location: "Interlaken, Switzerland", title: "Glacier Lake Circuit" },
  { location: "Queenstown, New Zealand", title: "Forest Edge Loop" },
  { location: "Himachal, India", title: "Winter Ridge Trail" },
];
const fallbackHeroImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop";

const monthThemes = [
  { primaryColor: "#1E40AF", lightColor: "#EFF6FF", textColor: "#1E3A8A", accentColor: "#2563EB" },
  { primaryColor: "#9D174D", lightColor: "#FFF0F6", textColor: "#831843", accentColor: "#BE185D" },
  { primaryColor: "#0369A1", lightColor: "#F0F9FF", textColor: "#0C4A6E", accentColor: "#0284C7" },
  { primaryColor: "#065F46", lightColor: "#ECFDF5", textColor: "#064E3B", accentColor: "#0F766E" },
  { primaryColor: "#0F766E", lightColor: "#F0FDFA", textColor: "#134E4A", accentColor: "#14B8A6" },
  { primaryColor: "#0E7490", lightColor: "#ECFEFF", textColor: "#155E75", accentColor: "#06B6D4" },
  { primaryColor: "#166534", lightColor: "#F0FDF4", textColor: "#14532D", accentColor: "#22C55E" },
  { primaryColor: "#B45309", lightColor: "#FFFBEB", textColor: "#92400E", accentColor: "#F59E0B" },
  { primaryColor: "#BE123C", lightColor: "#FFF1F2", textColor: "#9F1239", accentColor: "#E11D48" },
  { primaryColor: "#7C3AED", lightColor: "#F5F3FF", textColor: "#5B21B6", accentColor: "#8B5CF6" },
  { primaryColor: "#1D4ED8", lightColor: "#EFF6FF", textColor: "#1E3A8A", accentColor: "#3B82F6" },
  { primaryColor: "#0F766E", lightColor: "#F0FDFA", textColor: "#115E59", accentColor: "#14B8A6" },
];
const quickEventTags = ["+Meeting", "+Vacation", "+Deadline", "+Birthday"];

function SpiralBinding() {
  return (
    <div className="h-8 px-4 md:px-6 flex items-end justify-center gap-1.5 border-b border-gray-300/70 bg-white">
      {Array.from({ length: 30 }).map((_, index) => (
        <div key={`ring-${index}`} className="relative w-2.5 h-4">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-1.5 bg-gray-400 rounded-sm shadow-sm" />
          <span className="absolute left-1/2 top-1 -translate-x-1/2 w-1.5 h-2.5 border-[1.5px] border-gray-600/80 rounded-b-sm rounded-t-[2px]" />
        </div>
      ))}
    </div>
  );
}

function WallCalendarHero({
  currentMonth,
  primaryColor,
  accentColor,
}: {
  currentMonth: Date;
  primaryColor: string;
  accentColor: string;
}) {
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
            <p className="text-sm md:text-base font-medium tracking-wide text-blue-100/95">
              {yearLabel}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider leading-none">
              {monthLabel}
            </h2>
          </div>
        </motion.div>

        <div className="absolute left-3 sm:left-4 md:left-6 bottom-2 sm:bottom-3 md:bottom-4 z-20 max-w-[65%]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/25 backdrop-blur-sm shadow-md">
            <MapPin size={12} className="text-white/90" />
            <span className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
              {heroPlace.location}
            </span>
          </div>
          <h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-sm">
            {heroPlace.title}
          </h3>
        </div>
      </div>
    </section>
  );
}

function getNoteKey(
  year: number,
  month: number,
  startDate: Date | null,
  endDate: Date | null
) {
  const monthValue = String(month).padStart(2, "0");

  if (!startDate && !endDate) {
    return `calendar-note-general-${year}-${monthValue}`;
  }

  if (startDate && endDate) {
    const startValue = format(startDate, "yyyy-MM-dd");
    const endValue = format(endDate, "yyyy-MM-dd");
    return `calendar-note-range-${startValue}-to-${endValue}`;
  }

  return `calendar-note-general-${year}-${monthValue}`;
}

function getMonthProgress() {
  const today = new Date();
  const currentDay = today.getDate();
  const totalDaysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const progress = currentDay / totalDaysInMonth;
  return progress;
}

function PageCurlCorner({ progress, monthLabel }: { progress: number; monthLabel: string }) {
  const minCurlSize = 20;
  const maxCurlSize = 80;
  const targetSize = minCurlSize + progress * (maxCurlSize - minCurlSize);
  const [animatedSize, setAnimatedSize] = useState(0);

  useEffect(() => {
    setAnimatedSize(0);
    const timer = window.setTimeout(() => {
      setAnimatedSize(targetSize);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [targetSize]);

  const progressPercent = Math.round(progress * 100);
  const dayOfMonth = new Date().getDate();

  return (
    <div
      className="group absolute bottom-0 right-0 z-20"
      style={{
        width: animatedSize,
        height: animatedSize,
        transition: "width 0.8s ease-out, height 0.8s ease-out",
      }}
    >
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "100% 0 0 0",
          background: "linear-gradient(135deg, #e0e0e0, #f5f5f5)",
          boxShadow: "-2px -2px 6px rgba(0,0,0,0.15)",
        }}
      />

      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: "120%",
          height: "120%",
          borderRadius: "100% 0 0 0",
          background: "radial-gradient(ellipse at bottom right, rgba(0,0,0,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="absolute bottom-full right-1 opacity-0 group-hover:opacity-100 transition-all duration-150 ease-in-out pointer-events-none">
        <div className="mb-2 px-2 py-1 rounded-md text-xs text-gray-600 bg-white border border-gray-200 shadow-sm whitespace-nowrap">
          {dayOfMonth} days into {monthLabel} ({progressPercent}%)
        </div>
      </div>
    </div>
  );
}

function IntroModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const todayLabel = format(new Date(), "MMMM d");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Welcome onboarding"
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
              Welcome 👋
            </h2>
            <p className="mt-1 text-base sm:text-lg text-gray-700 dark:text-slate-200">
              Ready to plan your days?
            </p>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Today is {todayLabel} - a good day to get organized.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-3 sm:p-4 border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">Try this:</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  - Select a few dates on the calendar
                  <br />
                  - Add a note for your plan
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-3 sm:p-4 border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">📅 Plan multiple days effortlessly</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  Build clear plans across date ranges in just a few clicks.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-3 sm:p-4 border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">✍️ Capture notes instantly</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  Keep ideas, reminders, and tasks close to your selected dates.
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 px-1">⚡ Smooth, distraction-free experience.</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-all duration-200"
                autoFocus
              >
                Start Planning
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(new Date("2026-04-08T00:00:00"));
  const [activeTab, setActiveTab] = useState<"calendar" | "notes">("calendar");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [generalNote, setGeneralNote] = useState("");
  const [rangeNote, setRangeNote] = useState("");
  const [notesDates, setNotesDates] = useState<string[]>([]);
  const [activeQuickTag, setActiveQuickTag] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [outgoingMonth, setOutgoingMonth] = useState<Date | null>(null);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isClient, setIsClient] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showIntroModal, setShowIntroModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const introSeen = localStorage.getItem("introSeen");
    if (!introSeen) {
      setShowIntroModal(true);
    }
  }, [isClient]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("calendar-theme-mode");
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeMode(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-theme-mode", themeMode);
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const theme = monthThemes[currentMonth.getMonth()];

  const changeMonthWithFlip = (offset: 1 | -1) => {
    if (isFlipping) {
      return;
    }

    setDirection(offset);
    setOutgoingMonth(currentMonth);
    setCurrentMonth(offset > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
    setIsFlipping(true);

    window.setTimeout(() => {
      setIsFlipping(false);
      setOutgoingMonth(null);
    }, 620);
  };

  const nextMonth = () => changeMonthWithFlip(1);
  const prevMonth = () => changeMonthWithFlip(-1);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarGridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarGridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarGridStart, end: calendarGridEnd });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const isCurrentMonthView = isSameMonth(currentMonth, today);
  const monthProgress = getMonthProgress();
  const isDark = themeMode === "dark";
  const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;
  const hasNotes = (day: Date) => notesDates.includes(format(day, "yyyy-MM-dd"));

  const handleDateClick = (day: Date) => {
    if (!isSameMonth(day, monthStart)) {
      return;
    }

    if (!startDate && !endDate) {
      setStartDate(day);
      return;
    }

    if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        setStartDate(day);
        setEndDate(startDate);
      } else {
        setEndDate(day);
      }
      return;
    }

    setStartDate(day);
    setEndDate(null);
  };

  const getDateState = (day: Date, monthStartForView: Date): "start" | "end" | "inRange" | "none" => {
    if (!isSameMonth(day, monthStartForView)) {
      return "none";
    }

    if (startDate && isSameDay(day, startDate)) {
      return "start";
    }

    if (endDate && isSameDay(day, endDate)) {
      return "end";
    }

    if (startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate })) {
      return "inRange";
    }

    return "none";
  };

  const jumpToToday = () => {
    if (isCurrentMonthView) {
      return;
    }

    setCurrentMonth(startOfMonth(today));
    setOutgoingMonth(null);
    setIsFlipping(false);
  };

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const generalNoteKey = getNoteKey(year, month, null, null);
    const savedGeneralNote = localStorage.getItem(generalNoteKey) || "";
    setGeneralNote(savedGeneralNote);
  }, [currentMonth]);

  const loadNotesDatesForMonth = () => {
    const monthStartDate = startOfMonth(currentMonth);
    const monthEndDate = endOfMonth(currentMonth);
    const noteDateSet = new Set<string>();

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith("calendar-note-range-")) {
        continue;
      }

      const noteText = localStorage.getItem(key) || "";
      if (!noteText.trim()) {
        continue;
      }

      const match = key.match(/^calendar-note-range-(\d{4}-\d{2}-\d{2})-to-(\d{4}-\d{2}-\d{2})$/);
      if (!match) {
        continue;
      }

      const start = new Date(`${match[1]}T00:00:00`);
      const end = new Date(`${match[2]}T00:00:00`);
      const rangeDays = eachDayOfInterval({ start, end });

      rangeDays.forEach((dateValue) => {
        if (dateValue >= monthStartDate && dateValue <= monthEndDate) {
          noteDateSet.add(format(dateValue, "yyyy-MM-dd"));
        }
      });
    }

    setNotesDates(Array.from(noteDateSet));
  };

  useEffect(() => {
    if (startDate && endDate) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const rangeNoteKey = getNoteKey(year, month, startDate, endDate);
      const savedRangeNote = localStorage.getItem(rangeNoteKey) || "";
      setRangeNote(savedRangeNote);
      return;
    }

    setRangeNote("");
  }, [currentMonth, startDate, endDate]);

  useEffect(() => {
    if (!isSaved) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsSaved(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isSaved]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    loadNotesDatesForMonth();
  }, [isClient, currentMonth]);

  const handleNoteSave = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const noteKey = getNoteKey(year, month, startDate, endDate);
    const noteText = startDate && endDate ? rangeNote : generalNote;

    localStorage.setItem(noteKey, noteText);
    setIsSaved(true);
    loadNotesDatesForMonth();
  };

  const handleQuickTagClick = (tag: string) => {
    setActiveQuickTag(tag);

    if (isRangeMode) {
      const nextValue = rangeNote.trim().length > 0 ? `${rangeNote} ${tag}` : `${tag} `;
      setRangeNote(nextValue);
      return;
    }

    const nextValue = generalNote.trim().length > 0 ? `${generalNote} ${tag}` : `${tag} `;
    setGeneralNote(nextValue);
  };

  if (!isClient) return null;

  const daysSelectedCount = startDate && endDate
    ? Math.abs(differenceInDays(endDate, startDate)) + 1
    : startDate ? 1 : 0;
  const isRangeMode = Boolean(startDate && endDate);
  const activeNoteText = isRangeMode ? rangeNote : generalNote;
  const noteCharacterCount = activeNoteText.length;

  const renderCalendarPanelContent = (viewMonth: Date, interactive: boolean) => {
    const viewMonthStart = startOfMonth(viewMonth);
    const viewMonthEnd = endOfMonth(viewMonthStart);
    const viewStart = startOfWeek(viewMonthStart, { weekStartsOn: 1 });
    const viewEnd = endOfWeek(viewMonthEnd, { weekStartsOn: 1 });
    const viewDays = eachDayOfInterval({ start: viewStart, end: viewEnd });
    const isViewCurrentMonth = isSameMonth(viewMonth, today);

    return (
      <>
        <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
          <h3 className={`text-lg sm:text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            {format(viewMonth, "MMMM yyyy")}
          </h3>

          <div className="flex space-x-1">
            <button
              onClick={interactive ? prevMonth : undefined}
              disabled={!interactive}
              className={`p-2.5 rounded-full transition-colors shadow-sm theme-arrow ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-gray-50 hover:bg-gray-100 text-gray-500"}`}
              style={{ ["--theme-primary" as string]: theme.primaryColor }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={interactive ? jumpToToday : undefined}
              disabled={!interactive || isViewCurrentMonth}
              className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors min-h-[36px] sm:min-h-[40px] ${
                isViewCurrentMonth
                  ? isDark ? "border-slate-700 text-slate-500 cursor-not-allowed" : "border-gray-200 text-gray-300 cursor-not-allowed"
                  : isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Today
            </button>
            <button
              onClick={interactive ? nextMonth : undefined}
              disabled={!interactive}
              className={`p-2.5 rounded-full transition-colors shadow-sm theme-arrow ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-gray-50 hover:bg-gray-100 text-gray-500"}`}
              style={{ ["--theme-primary" as string]: theme.primaryColor }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-1.5 sm:mb-2 relative z-10">
          {weekDays.map((day) => (
            <div key={day} className={`text-center text-[11px] font-semibold uppercase tracking-wider pb-2 border-b ${isDark ? "text-slate-400 border-slate-700" : "text-gray-400 border-gray-100/60"}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 gap-y-1 min-h-[280px] sm:min-h-[320px] md:min-h-[340px] lg:min-h-0 lg:h-full mt-1 relative z-10">
          {viewDays.map((day) => {
            const isDayToday = isToday(day);
            const isCurrentMonthDay = isSameMonth(day, viewMonthStart);
            const dateState = getDateState(day, viewMonthStart);
            const isStartDate = dateState === "start";
            const isEndDate = dateState === "end";
            const isInRangeDate = dateState === "inRange";
            const holiday = getHoliday(day.getDate(), day.getMonth() + 1);
            const hasHoliday = Boolean(holiday);
            const isWeekendDay = isWeekend(day);
            const hasNotesDay = hasNotes(day);

            let rowHighlightClassName = "";
            if (isStartDate && endDate) {
              rowHighlightClassName = "absolute left-1/2 right-0 inset-y-1 rounded-r-full";
            } else if (isEndDate && startDate) {
              rowHighlightClassName = "absolute left-0 right-1/2 inset-y-1 rounded-l-full";
            } else if (isInRangeDate) {
              rowHighlightClassName = "absolute inset-x-0 inset-y-1";
            }

            let dayButtonClassName = "flex items-center justify-center w-full h-full text-[13px] sm:text-sm font-medium relative z-10 transition-all duration-150 ease-in-out";
            if (!isCurrentMonthDay) {
              dayButtonClassName += isDark ? " text-slate-600 cursor-default" : " text-gray-300 cursor-default";
            } else if (isStartDate) {
              dayButtonClassName += " text-white rounded-full rounded-l-full cursor-pointer hover:brightness-110 hover:ring-2 active:scale-95";
            } else if (isEndDate) {
              dayButtonClassName += " text-white rounded-full rounded-r-full cursor-pointer hover:brightness-110 hover:ring-2 active:scale-95";
            } else if (isInRangeDate) {
              dayButtonClassName += isDark ? " text-slate-100 rounded-full cursor-pointer hover:font-semibold" : " text-gray-800 rounded-full cursor-pointer hover:font-semibold";
            } else {
              if (isWeekendDay) {
                dayButtonClassName += isDark
                  ? " text-slate-200 bg-slate-800/70 rounded-full hover:bg-slate-700 hover:scale-105 cursor-pointer"
                  : " text-gray-700 bg-slate-100/80 rounded-full hover:bg-slate-200/70 hover:scale-105 cursor-pointer";
              } else {
                dayButtonClassName += isDark
                  ? " text-slate-200 rounded-full hover:bg-slate-800 hover:scale-105 cursor-pointer"
                  : " text-gray-700 rounded-full hover:bg-gray-100 hover:scale-105 cursor-pointer";
              }
            }

            const tooltipLabels: string[] = [];
            if (hasHoliday) tooltipLabels.push("Holiday");
            if (hasNotesDay) tooltipLabels.push("Has Notes");
            if (isWeekendDay && isCurrentMonthDay) tooltipLabels.push("Weekend");
            const tooltipText = tooltipLabels.join(" • ");

            return (
              <div key={day.toString()} className="group relative flex items-center justify-center w-full h-full">
                {isCurrentMonthDay && rowHighlightClassName && (
                  <div className={rowHighlightClassName} style={{ backgroundColor: theme.lightColor }} />
                )}
                {isCurrentMonthDay && isInRangeDate && (
                  <div
                    className="absolute inset-x-0 inset-y-1 opacity-0 group-hover:opacity-100 transition-all duration-150 ease-in-out"
                    style={{ backgroundColor: theme.textColor, opacity: 0.08 }}
                  />
                )}
                <div
                  onClick={() => {
                    if (interactive && isCurrentMonthDay) {
                      handleDateClick(day);
                    }
                  }}
                  className={dayButtonClassName}
                  style={{
                    background: isStartDate || isEndDate
                      ? `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.primaryColor} 70%)`
                      : undefined,
                    boxShadow: isStartDate || isEndDate ? "0 6px 14px rgba(0,0,0,0.15)" : undefined,
                  }}
                >
                  {format(day, "d")}
                  {isDayToday && isCurrentMonthDay && (
                    <div
                      className="absolute inset-0 rounded-full border-2 pointer-events-none"
                      style={{ borderColor: theme.primaryColor }}
                    />
                  )}
                  {(isDayToday || hasHoliday || hasNotesDay) && isCurrentMonthDay && (
                    <div className="absolute bottom-1.5 flex items-center gap-1">
                      {isDayToday && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isStartDate || isEndDate ? "bg-white" : "bg-blue-500"}`} />
                      )}
                      {hasHoliday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 transition-all duration-150 ease-in-out group-hover:scale-125" />
                      )}
                      {hasNotesDay && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 transition-all duration-150 ease-in-out group-hover:scale-125" />
                      )}
                    </div>
                  )}
                </div>
                {tooltipText && isCurrentMonthDay && (
                  <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md shadow-md border opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 ease-in-out whitespace-nowrap ${isDark ? "text-slate-200 bg-slate-800 border-slate-700" : "text-gray-700 bg-white border-gray-100"}`}>
                    {hasHoliday && holiday?.name ? holiday.name : tooltipText}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={`mt-2 pt-2 border-t flex flex-wrap items-center gap-2 text-xs ${isDark ? "border-slate-700 text-slate-300" : "border-gray-100 text-gray-600"}`}>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-emerald-50 border border-emerald-100"}`}>
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDark ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
              <NotebookPen size={11} className="text-emerald-500" />
            </span>
            <span>Notes</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-red-50 border border-red-100"}`}>
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
              <PartyPopper size={11} className="text-red-500" />
            </span>
            <span>Holiday</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-slate-100 border border-slate-200"}`}>
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
              <CalendarDays size={11} className={isDark ? "text-slate-300" : "text-slate-500"} />
            </span>
            <span>Weekend</span>
          </div>
        </div>

        {isSameMonth(viewMonth, today) && (
          <PageCurlCorner
            progress={monthProgress}
            monthLabel={format(viewMonth, "MMMM")}
          />
        )}
      </>
    );
  };

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-5 lg:p-6 font-sans tracking-tight overflow-x-hidden ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#F3F4F6] text-gray-900"}`}>
      <IntroModal
        isOpen={showIntroModal}
        onClose={() => {
          localStorage.setItem("introSeen", "true");
          setShowIntroModal(false);
        }}
      />
      <div className="max-w-[1400px] mx-auto w-full h-full space-y-3 sm:space-y-4">
        <div className={`lg:hidden rounded-full p-1 shadow-sm ${isDark ? "bg-slate-800" : "bg-white"}`}>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`w-full min-h-[44px] rounded-full text-sm font-semibold transition-colors ${
                activeTab === "calendar" ? "text-white" : isDark ? "bg-transparent text-slate-300" : "bg-transparent text-gray-500"
              }`}
              style={
                activeTab === "calendar"
                  ? {
                      background: `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.primaryColor} 80%)`,
                      boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                    }
                  : undefined
              }
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`w-full min-h-[44px] rounded-full text-sm font-semibold transition-colors ${
                activeTab === "notes" ? "text-white" : isDark ? "bg-transparent text-slate-300" : "bg-transparent text-gray-500"
              }`}
              style={
                activeTab === "notes"
                  ? {
                      background: `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.primaryColor} 80%)`,
                      boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                    }
                  : undefined
              }
            >
              Notes
            </button>
          </div>
        </div>

        <div className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden lg:h-[calc(100vh-3.5rem)] relative ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200/80"}`}>
          <button
            onClick={() => setThemeMode(isDark ? "light" : "dark")}
            className={`absolute top-2 right-3 z-30 min-h-[36px] min-w-[36px] px-2 rounded-full border flex items-center justify-center transition-colors ${
              isDark ? "bg-slate-800/90 border-slate-600 text-amber-300" : "bg-white/90 border-gray-300 text-gray-600"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <WallCalendarHero
            currentMonth={currentMonth}
            primaryColor={theme.primaryColor}
            accentColor={theme.accentColor}
          />

          <div className="p-3 sm:p-4 md:p-5 lg:p-4 flex-1 overflow-hidden">
            <div className="flex-1 h-full min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
        {/* CALENDAR SECTION */}
        <div className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200/80"} rounded-2xl border p-4 shadow-sm h-full min-h-0 flex-col relative overflow-hidden ${activeTab === "notes" ? "hidden lg:flex" : "flex"}`}>
            {!isDark && (
              <>
                <div
                  className="absolute -top-20 -left-16 w-64 h-64 rounded-full blur-3xl opacity-28 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.primaryColor})` }}
                />
                <div
                  className="absolute -bottom-24 right-2 w-56 h-56 rounded-full blur-2xl opacity-16 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, transparent)` }}
                />
              </>
            )}
            <div className="relative h-full min-h-0 [perspective:1200px] overflow-hidden">
              {renderCalendarPanelContent(currentMonth, true)}

              <AnimatePresence>
                {isFlipping && outgoingMonth && (
                  <motion.div
                    key={format(outgoingMonth, "yyyy-MM")}
                    className="absolute inset-0 pointer-events-none [transform-style:preserve-3d] [backface-visibility:hidden]"
                    style={{ transformOrigin: direction > 0 ? "top center" : "bottom center" }}
                    initial={{ rotateX: 0, opacity: 1 }}
                    animate={{ rotateX: direction > 0 ? 135 : -135, opacity: 0.65 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.62, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0">
                      {renderCalendarPanelContent(outgoingMonth, false)}
                    </div>
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.38, ease: "easeInOut" }}
                      style={{
                        background: direction > 0
                          ? "linear-gradient(to bottom, rgba(0,0,0,0.18), transparent 55%)"
                          : "linear-gradient(to top, rgba(0,0,0,0.18), transparent 55%)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>

        {/* NOTES SECTION */}
        <div className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-gradient-to-br from-green-50/80 to-white border-green-100/80"} rounded-2xl border p-4 shadow-sm h-full min-h-0 flex-col relative overflow-hidden ${activeTab === "calendar" ? "hidden lg:flex" : "flex"}`}>
            <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.primaryColor})` }}
            />
            <div className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full blur-xl opacity-10 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, transparent)` }}
            />
            <div className="flex flex-col gap-4 h-full">
            <div className={`flex flex-wrap gap-2 justify-between items-start border-b pb-4 ${isDark ? "border-slate-700" : "border-green-100/60"}`}>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: theme.primaryColor }}>
                  {isRangeMode ? "Range Notes" : "General Notes"}
                </p>
                <div className={`text-lg sm:text-xl font-medium ${isDark ? "text-slate-200" : "text-gray-700"}`}>
                  {isRangeMode && startDate && endDate ? (
                    <div className="flex items-center gap-2">
                      <span>{format(startDate, "MMM d")} – {format(endDate, "MMM d")}</span>
                      <button
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                        }}
                        className={`w-7 h-7 rounded-full transition-colors ${isDark ? "bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700" : "bg-white text-gray-400 hover:text-red-500 border border-gray-200"}`}
                        aria-label="Clear selected range"
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-[28px] font-bold tracking-tight">{format(currentMonth, "MMMM yyyy")}</span>
                  )}
                </div>
              </div>

              {daysSelectedCount > 0 && (
                <span className={`text-xs rounded-full px-3 py-1 font-semibold flex items-center gap-1.5 ${isDark ? "bg-emerald-900/40 text-emerald-300" : "bg-green-100 text-green-700"}`}>
                  <Info size={12} /> {daysSelectedCount} Day{daysSelectedCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {quickEventTags.map((tag) => {
                const isActive = activeQuickTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? "bg-emerald-900/50 text-emerald-200 border border-emerald-700"
                          : "bg-green-100 text-green-700 border border-green-200"
                        : isDark
                          ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="flex-grow min-h-0 flex flex-col gap-2">
              {isRangeMode ? (
                <textarea
                  value={rangeNote}
                  onChange={(e) => setRangeNote(e.target.value)}
                  placeholder="Write your thoughts, plans, or important notes for this date range..."
                  className={`w-full flex-1 min-h-[130px] sm:min-h-[150px] lg:min-h-[120px] resize-y p-4 sm:p-5 rounded-2xl shadow-inner focus:outline-none focus:ring-2 transition-all duration-200 leading-relaxed placeholder:italic ${
                    isDark
                      ? "bg-slate-800/90 border border-slate-700 focus:ring-emerald-600 focus:border-emerald-500 text-slate-100 placeholder:text-slate-400"
                      : "bg-white/80 border border-green-100 focus:ring-green-200 focus:border-green-500 text-gray-700 placeholder:text-gray-400"
                  }`}
                />
              ) : (
                <textarea
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  placeholder="Write your thoughts, plans, or important notes for this month..."
                  className={`w-full flex-1 min-h-[130px] sm:min-h-[150px] lg:min-h-[120px] resize-y p-4 sm:p-5 rounded-2xl shadow-inner focus:outline-none focus:ring-2 transition-all duration-200 leading-relaxed placeholder:italic ${
                    isDark
                      ? "bg-slate-800/90 border border-slate-700 focus:ring-emerald-600 focus:border-emerald-500 text-slate-100 placeholder:text-slate-400"
                      : "bg-white/80 border border-green-100 focus:ring-green-200 focus:border-green-500 text-gray-700 placeholder:text-gray-400"
                  }`}
                />
              )}
              <div className="flex items-center justify-between text-xs">
                <p className={isDark ? "text-slate-400" : "text-gray-400"}>
                  Your notes are saved for this month or selected date range.
                </p>
                <span className={isDark ? "text-slate-400" : "text-gray-400"}>
                  {noteCharacterCount} characters
                </span>
              </div>
            </div>

            <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
              {isSaved && (
                <span className={`text-sm font-semibold flex items-center gap-1 ${isDark ? "text-emerald-300" : "text-green-600"}`}>
                  <CheckCircle2 size={16} />
                  Saved!
                </span>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNoteSave}
                disabled={!activeNoteText.trim()}
                className={`px-5 py-2.5 rounded-full font-semibold transition-colors ${
                  activeNoteText.trim()
                    ? "text-white shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                style={
                  activeNoteText.trim()
                    ? {
                        background: `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.primaryColor} 85%)`,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.16)",
                      }
                    : undefined
                }
              >
                Save
              </motion.button>
            </div>
            </div>
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}