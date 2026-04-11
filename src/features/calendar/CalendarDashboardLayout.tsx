"use client";

import { useRef, useCallback, useState } from "react";
import { format } from "date-fns";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { Moon, Sun, FileImage, FileText } from "lucide-react";
import { WallCalendarHero } from "./WallCalendarHero";
import { CalendarView } from "./CalendarView";
import { NotesPanel } from "@/features/notes/NotesPanel";
import type { MonthTheme } from "./constants";
import type { CalendarEngineState } from "@/hooks/useCalendarEngine";
import type { NotesState } from "@/hooks/useNotesState";
import type { ThemeMode } from "@/hooks/useThemeMode";

type Tab = "calendar" | "notes";

export type CalendarDashboardLayoutProps = {
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  activeTab: Tab;
  theme: MonthTheme;
  calendar: CalendarEngineState;
  notes: NotesState;
  onClearRange: () => void;
};

export function CalendarDashboardLayout({
  isDark,
  setThemeMode,
  activeTab,
  theme,
  calendar,
  notes,
  onClearRange,
}: CalendarDashboardLayoutProps) {
  const calendarRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);

  const prepareForExport = async () => {
    setIsExporting(true);
    let restoredDark = false;
    if (isDark) {
      setThemeMode("light");
      restoredDark = true;
      // Wait for React to re-render in light mode
      await new Promise((r) => setTimeout(r, 150));
    }
    return restoredDark;
  };

  const cleanupAfterExport = (restoredDark: boolean) => {
    setIsExporting(false);
    if (restoredDark) {
      setThemeMode("dark");
    }
  };

  const exportAsPNG = useCallback(async () => {
    if (!calendarRef.current) return;
    const restoredDark = await prepareForExport();
    
    try {
      const dataUrl = await htmlToImage.toPng(calendarRef.current, { 
        quality: 0.95, 
        pixelRatio: 2, 
        backgroundColor: "#ffffff",
        filter: (node) => !(node as HTMLElement).classList?.contains("no-export")
      });
      const link = document.createElement("a");
      link.download = `calendar-export-${format(calendar.currentMonth, "yyyy-MM")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG", err);
    } finally {
      cleanupAfterExport(restoredDark);
    }
  }, [calendar.currentMonth, isDark, setThemeMode]);

  const exportAsPDF = useCallback(async () => {
    if (!calendarRef.current) return;
    const restoredDark = await prepareForExport();

    try {
      const dataUrl = await htmlToImage.toPng(calendarRef.current, { 
        quality: 0.95, 
        pixelRatio: 2, 
        backgroundColor: "#ffffff",
        filter: (node) => !(node as HTMLElement).classList?.contains("no-export")
      });
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [calendarRef.current.offsetWidth, calendarRef.current.offsetHeight]
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, calendarRef.current.offsetWidth, calendarRef.current.offsetHeight);
      pdf.save(`calendar-export-${format(calendar.currentMonth, "yyyy-MM")}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
    } finally {
      cleanupAfterExport(restoredDark);
    }
  }, [calendar.currentMonth, isDark, setThemeMode]);

  return (
    <div
      ref={calendarRef}
      className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden lg:h-[calc(100vh-3.5rem)] relative ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200/80"} ${isExporting ? "opacity-90" : ""}`}
    >
      <div className={`absolute top-2 right-3 z-30 flex items-center gap-2 no-export ${isExporting ? "opacity-0" : "opacity-100"}`}>
        <button
          type="button"
          onClick={exportAsPNG}
          className={`min-h-[36px] px-3 rounded-full border flex items-center justify-center gap-1.5 transition-colors text-xs font-medium ${
            isDark ? "bg-slate-800/90 border-slate-600 text-slate-300 hover:bg-slate-700" : "bg-white/90 border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
          title="Export as PNG"
        >
          <FileImage size={14} /> PNG
        </button>
        <button
          type="button"
          onClick={exportAsPDF}
          className={`min-h-[36px] px-3 rounded-full border flex items-center justify-center gap-1.5 transition-colors text-xs font-medium ${
            isDark ? "bg-slate-800/90 border-slate-600 text-slate-300 hover:bg-slate-700" : "bg-white/90 border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
          title="Export as PDF"
        >
          <FileText size={14} /> PDF
        </button>
        <button
          type="button"
          onClick={() => setThemeMode(isDark ? "light" : "dark")}
          className={`min-h-[36px] min-w-[36px] px-2 rounded-full border flex items-center justify-center transition-colors ${
            isDark ? "bg-slate-800/90 border-slate-600 text-amber-300" : "bg-white/90 border-gray-300 text-gray-600"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <WallCalendarHero
        currentMonth={calendar.currentMonth}
        primaryColor={theme.primaryColor}
        accentColor={theme.accentColor}
      />

      <div className="p-3 sm:p-4 md:p-5 lg:p-4 flex-1 overflow-hidden">
        <div className="flex-1 h-full min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
          <div
            className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200/80"} rounded-2xl border p-4 shadow-sm h-full min-h-0 flex-col relative overflow-hidden ${activeTab === "notes" ? "hidden lg:flex" : "flex"}`}
          >
            <CalendarView
              theme={theme}
              isDark={isDark}
              currentMonth={calendar.currentMonth}
              outgoingMonth={calendar.outgoingMonth}
              isFlipping={calendar.isFlipping}
              direction={calendar.direction}
              startDate={calendar.startDate}
              endDate={calendar.endDate}
              monthProgress={calendar.monthProgress}
              today={calendar.today}
              onPrev={calendar.prevMonth}
              onNext={calendar.nextMonth}
              onToday={calendar.jumpToToday}
              onDateClick={calendar.handleDateClick}
              hasNotes={calendar.hasNotes}
            />
          </div>

          <div
            className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-gradient-to-br from-green-50/80 to-white border-green-100/80"} rounded-2xl border p-4 shadow-sm h-full min-h-0 flex-col relative overflow-hidden ${activeTab === "calendar" ? "hidden lg:flex" : "flex"}`}
          >
            <NotesPanel
              theme={theme}
              isDark={isDark}
              currentMonth={calendar.currentMonth}
              startDate={calendar.startDate}
              endDate={calendar.endDate}
              isRangeMode={notes.isRangeMode}
              generalNote={notes.generalNote}
              setGeneralNote={notes.setGeneralNote}
              rangeNote={notes.rangeNote}
              setRangeNote={notes.setRangeNote}
              activeQuickTag={notes.activeQuickTag}
              onQuickTag={notes.handleQuickTagClick}
              onClearRange={onClearRange}
              onSave={notes.handleNoteSave}
              isSaved={notes.isSaved}
              daysSelectedCount={notes.daysSelectedCount}
              businessDaysCount={notes.businessDaysCount}
              weekendsCount={notes.weekendsCount}
              holidaysCount={notes.holidaysCount}
              activeNoteText={notes.activeNoteText}
              noteCharacterCount={notes.noteCharacterCount}
              quickEventTags={notes.quickEventTags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
