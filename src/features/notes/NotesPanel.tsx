"use client";

import { format } from "date-fns";
import { CheckCircle2, Info, Briefcase, Coffee, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import type { MonthTheme } from "@/features/calendar/constants";

export type NotesPanelProps = {
  theme: MonthTheme;
  isDark: boolean;
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  isRangeMode: boolean;
  generalNote: string;
  setGeneralNote: (v: string) => void;
  rangeNote: string;
  setRangeNote: (v: string) => void;
  activeQuickTag: string | null;
  onQuickTag: (tag: string) => void;
  onClearRange: () => void;
  onSave: () => void;
  isSaved: boolean;
  daysSelectedCount: number;
  businessDaysCount: number;
  weekendsCount: number;
  holidaysCount: number;
  activeNoteText: string;
  noteCharacterCount: number;
  quickEventTags: string[];
};

export function NotesPanel({
  theme,
  isDark,
  currentMonth,
  startDate,
  endDate,
  isRangeMode,
  generalNote,
  setGeneralNote,
  rangeNote,
  setRangeNote,
  activeQuickTag,
  onQuickTag,
  onClearRange,
  onSave,
  isSaved,
  daysSelectedCount,
  businessDaysCount,
  weekendsCount,
  holidaysCount,
  activeNoteText,
  noteCharacterCount,
  quickEventTags,
}: NotesPanelProps) {
  return (
    <>
      <div
        className="absolute -top-10 -right-8 w-44 h-44 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.primaryColor})` }}
      />
      <div
        className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full blur-xl opacity-10 pointer-events-none"
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
                  <span>
                    {format(startDate, "MMM d")} – {format(endDate, "MMM d")}
                  </span>
                  <button
                    onClick={onClearRange}
                    className={`no-export w-7 h-7 rounded-full transition-colors ${isDark ? "bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700" : "bg-white text-gray-400 hover:text-red-500 border border-gray-200"}`}
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
            <div className={`flex flex-col gap-1 items-end`}>
              <div className="flex gap-2">
                <span
                  className={`text-[11px] rounded-full px-2.5 py-0.5 font-semibold flex items-center gap-1 ${isDark ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
                  title="Total Days"
                >
                  <Info size={11} /> {daysSelectedCount} day{daysSelectedCount !== 1 ? "s" : ""} selected
                </span>
                <span
                  className={`text-[11px] rounded-full px-2.5 py-0.5 font-semibold flex items-center gap-1 ${isDark ? "bg-blue-900/40 text-blue-300 border border-blue-800/50" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
                  title="Business Days"
                >
                  <Briefcase size={11} /> {businessDaysCount} business day{businessDaysCount !== 1 ? "s" : ""}
                </span>
                <span
                  className={`text-[11px] rounded-full px-2.5 py-0.5 font-semibold flex items-center gap-1 ${isDark ? "bg-amber-900/40 text-amber-300 border border-amber-800/50" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                  title="Weekends"
                >
                  <Coffee size={11} /> {weekendsCount} weekend{weekendsCount !== 1 ? "s" : ""}
                </span>
                {holidaysCount > 0 && (
                  <span
                    className={`text-[11px] rounded-full px-2.5 py-0.5 font-semibold flex items-center gap-1 ${isDark ? "bg-red-900/40 text-red-300 border border-red-800/50" : "bg-red-50 text-red-600 border border-red-100"}`}
                    title="Public Holidays"
                  >
                    <PartyPopper size={11} /> {holidaysCount} holiday{holidaysCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 no-export">
          {quickEventTags.map((tag) => {
            const isActive = activeQuickTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onQuickTag(tag)}
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
            <span className={isDark ? "text-slate-400" : "text-gray-400"}>{noteCharacterCount} characters</span>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 no-export">
          {isSaved && (
            <span className={`text-sm font-semibold flex items-center gap-1 ${isDark ? "text-emerald-300" : "text-green-600"}`}>
              <CheckCircle2 size={16} />
              Saved!
            </span>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
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
    </>
  );
}
