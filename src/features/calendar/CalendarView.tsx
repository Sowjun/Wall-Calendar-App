"use client";

import { format, isSameMonth, isToday, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, NotebookPen, PartyPopper, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getHoliday } from "@/data/holidays";
import { buildCalendarDays, getDateState, isWeekendDay } from "@/lib/calendarMath";
import type { MonthTheme } from "./constants";
import { WEEK_DAYS } from "./constants";
import { PageCurlCorner } from "./PageCurlCorner";

export type CalendarViewProps = {
  theme: MonthTheme;
  isDark: boolean;
  currentMonth: Date;
  outgoingMonth: Date | null;
  isFlipping: boolean;
  direction: number;
  startDate: Date | null;
  endDate: Date | null;
  monthProgress: number;
  today: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateClick: (day: Date) => void;
  hasNotes: (day: Date) => boolean;
};

export function CalendarView({
  theme,
  isDark,
  currentMonth,
  outgoingMonth,
  isFlipping,
  direction,
  startDate,
  endDate,
  monthProgress,
  today,
  onPrev,
  onNext,
  onToday,
  onDateClick,
  hasNotes,
}: CalendarViewProps) {
  const renderPanel = (viewMonth: Date, interactive: boolean) => {
    const viewMonthStart = startOfMonth(viewMonth);
    const viewDays = buildCalendarDays(viewMonth);
    const isViewCurrentMonth = isSameMonth(viewMonth, today);

    return (
      <>
        <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
          <h3 className={`text-lg sm:text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            {format(viewMonth, "MMMM yyyy")}
          </h3>

          <div className="flex space-x-1 no-export">
            <button
              onClick={interactive ? onPrev : undefined}
              disabled={!interactive}
              className={`p-2.5 rounded-full transition-colors shadow-sm theme-arrow ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-gray-50 hover:bg-gray-100 text-gray-500"}`}
              style={{ ["--theme-primary" as string]: theme.primaryColor }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={interactive ? onToday : undefined}
              disabled={!interactive || isViewCurrentMonth}
              className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors min-h-[36px] sm:min-h-[40px] ${
                isViewCurrentMonth
                  ? isDark
                    ? "border-slate-700 text-slate-500 cursor-not-allowed"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                  : isDark
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Today
            </button>
            <button
              onClick={interactive ? onNext : undefined}
              disabled={!interactive}
              className={`p-2.5 rounded-full transition-colors shadow-sm theme-arrow ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-gray-50 hover:bg-gray-100 text-gray-500"}`}
              style={{ ["--theme-primary" as string]: theme.primaryColor }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-1.5 sm:mb-2 relative z-10">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className={`text-center text-[11px] font-semibold uppercase tracking-wider pb-2 border-b ${isDark ? "text-slate-400 border-slate-700" : "text-gray-400 border-gray-100/60"}`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 gap-y-1 min-h-[280px] sm:min-h-[320px] md:min-h-[340px] lg:min-h-0 lg:h-full mt-1 relative z-10">
          {viewDays.map((day) => {
            const isDayToday = isToday(day);
            const isCurrentMonthDay = isSameMonth(day, viewMonthStart);

            const dateState = getDateState(day, viewMonthStart, startDate, endDate);
            const isStartDate = dateState === "start";
            const isEndDate = dateState === "end";
            const isInRangeDate = dateState === "inRange";
            const holiday = getHoliday(day.getDate(), day.getMonth() + 1);
            const hasHoliday = Boolean(holiday);
            const isWeekend = isWeekendDay(day);
            const hasNotesDay = hasNotes(day);

            let rowHighlightClassName = "";
            if (isStartDate && endDate) {
              rowHighlightClassName = "absolute left-1/2 right-0 inset-y-1 rounded-r-full";
            } else if (isEndDate && startDate) {
              rowHighlightClassName = "absolute left-0 right-1/2 inset-y-1 rounded-l-full";
            } else if (isInRangeDate) {
              rowHighlightClassName = "absolute inset-x-0 inset-y-1";
            }

            let dayButtonClassName =
              "flex items-center justify-center w-full h-full text-[13px] sm:text-sm font-medium relative z-10 transition-all duration-150 ease-in-out";
            if (!isCurrentMonthDay) {
              dayButtonClassName += isDark ? " text-slate-600 cursor-default" : " text-gray-300 cursor-default";
            } else if (isStartDate) {
              dayButtonClassName +=
                " text-white rounded-full rounded-l-full cursor-pointer hover:brightness-110 hover:ring-2 active:scale-95";
            } else if (isEndDate) {
              dayButtonClassName +=
                " text-white rounded-full rounded-r-full cursor-pointer hover:brightness-110 hover:ring-2 active:scale-95";
            } else if (isInRangeDate) {
              dayButtonClassName += isDark
                ? " text-slate-100 rounded-full cursor-pointer hover:font-semibold"
                : " text-gray-800 rounded-full cursor-pointer hover:font-semibold";
            } else {
              if (isWeekend) {
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
            if (isWeekend && isCurrentMonthDay) tooltipLabels.push("Weekend");
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
                      onDateClick(day);
                    }
                  }}
                  className={dayButtonClassName}
                  style={{
                    background:
                      isStartDate || isEndDate
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
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isStartDate || isEndDate ? "bg-white" : "bg-blue-500"}`}
                        />
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
                  <div
                    className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md shadow-md border opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 ease-in-out whitespace-nowrap ${isDark ? "text-slate-200 bg-slate-800 border-slate-700" : "text-gray-700 bg-white border-gray-100"}`}
                  >
                    {hasHoliday && holiday?.name ? holiday.name : tooltipText}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`mt-2 pt-2 border-t flex flex-wrap items-center gap-2 text-xs ${isDark ? "border-slate-700 text-slate-300" : "border-gray-100 text-gray-600"}`}
        >
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-emerald-50 border border-emerald-100"}`}
          >
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDark ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
              <NotebookPen size={11} className="text-emerald-500" />
            </span>
            <span>Notes</span>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-red-50 border border-red-100"}`}
          >
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
              <PartyPopper size={11} className="text-red-500" />
            </span>
            <span>Holiday</span>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-slate-100 border border-slate-200"}`}
          >
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
              <CalendarDays size={11} className={isDark ? "text-slate-300" : "text-slate-500"} />
            </span>
            <span>Weekend</span>
          </div>
        </div>

        {isSameMonth(viewMonth, today) && (
          <PageCurlCorner progress={monthProgress} monthLabel={format(viewMonth, "MMMM")} />
        )}
      </>
    );
  };

  return (
    <>
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
        {renderPanel(currentMonth, true)}

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
              <div className="absolute inset-0">{renderPanel(outgoingMonth, false)}</div>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.38, ease: "easeInOut" }}
                style={{
                  background:
                    direction > 0
                      ? "linear-gradient(to bottom, rgba(0,0,0,0.18), transparent 55%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.18), transparent 55%)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
