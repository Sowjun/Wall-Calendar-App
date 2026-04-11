"use client";

import { useState, useEffect } from "react";
import { monthThemes } from "@/features/calendar/constants";
import { MobileTabBar } from "@/features/calendar/MobileTabBar";
import { CalendarDashboardLayout } from "@/features/calendar/CalendarDashboardLayout";
import { IntroModal } from "@/components/ui/IntroModal";
import { useCalendarEngine } from "@/hooks/useCalendarEngine";
import { useNotesState } from "@/hooks/useNotesState";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function CalendarApp() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "notes">("calendar");
  const [showIntroModal, setShowIntroModal] = useState(false);

  const { setThemeMode, isDark } = useThemeMode();
  const calendar = useCalendarEngine(isClient);
  const theme = monthThemes[calendar.currentMonth.getMonth()];

  const notes = useNotesState({
    currentMonth: calendar.currentMonth,
    startDate: calendar.startDate,
    endDate: calendar.endDate,
    onAfterSave: calendar.refreshNotesDates,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!localStorage.getItem("introSeen")) setShowIntroModal(true);
  }, [isClient]);

  if (!isClient) return null;

  const handleIntroClose = () => {
    localStorage.setItem("introSeen", "true");
    setShowIntroModal(false);
  };

  const handleClearRange = () => {
    calendar.setStartDate(null);
    calendar.setEndDate(null);
  };

  return (
    <div
      className={`min-h-screen p-3 sm:p-4 md:p-5 lg:p-6 font-sans tracking-tight overflow-x-hidden ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#F3F4F6] text-gray-900"}`}
    >
      <IntroModal isOpen={showIntroModal} onClose={handleIntroClose} />

      <div className="max-w-[1400px] mx-auto w-full h-full space-y-3 sm:space-y-4">
        <MobileTabBar activeTab={activeTab} onChange={setActiveTab} theme={theme} isDark={isDark} />

        <CalendarDashboardLayout
          isDark={isDark}
          setThemeMode={setThemeMode}
          activeTab={activeTab}
          theme={theme}
          calendar={calendar}
          notes={notes}
          onClearRange={handleClearRange}
        />
      </div>
    </div>
  );
}
