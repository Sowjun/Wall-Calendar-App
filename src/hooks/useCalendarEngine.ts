"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfMonth, addMonths, subMonths, isSameMonth } from "date-fns";
import { buildCalendarDays, getMonthProgress } from "@/lib/calendarMath";
import { collectNotesDatesForMonth } from "@/lib/notesStorage";
import { isBefore } from "date-fns";

import { useStore } from "@/store/useStore";

export function useCalendarEngine(isClient: boolean) {
  const [currentMonth, setCurrentMonth] = useState(new Date("2026-04-08T00:00:00"));
  
  const { selectedRange, setSelectedRange } = useStore();
  const startDate = selectedRange.startDate ? new Date(selectedRange.startDate) : null;
  const endDate = selectedRange.endDate ? new Date(selectedRange.endDate) : null;

  const setStartDate = useCallback((date: Date | null) => {
    setSelectedRange(date?.toISOString() || null, selectedRange.endDate);
  }, [selectedRange.endDate, setSelectedRange]);

  const setEndDate = useCallback((date: Date | null) => {
    setSelectedRange(selectedRange.startDate, date?.toISOString() || null);
  }, [selectedRange.startDate, setSelectedRange]);

  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [outgoingMonth, setOutgoingMonth] = useState<Date | null>(null);

  const [notesDates, setNotesDates] = useState<string[]>([]);

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const days = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);

  const today = new Date();
  const isCurrentMonthView = isSameMonth(currentMonth, today);
  const monthProgress = getMonthProgress();

  const refreshNotesDates = useCallback(() => {
    setNotesDates(collectNotesDatesForMonth(currentMonth));
  }, [currentMonth]);

  useEffect(() => {
    if (!isClient) return;
    refreshNotesDates();
  }, [isClient, currentMonth, refreshNotesDates]);

  const changeMonthWithFlip = useCallback(
    (offset: 1 | -1) => {
      if (isFlipping) return;

      setDirection(offset);
      setOutgoingMonth(currentMonth);
      setCurrentMonth(offset > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
      setIsFlipping(true);

      window.setTimeout(() => {
        setIsFlipping(false);
        setOutgoingMonth(null);
      }, 620);
    },
    [currentMonth, isFlipping]
  );

  const nextMonth = useCallback(() => changeMonthWithFlip(1), [changeMonthWithFlip]);
  const prevMonth = useCallback(() => changeMonthWithFlip(-1), [changeMonthWithFlip]);

  const jumpToToday = useCallback(() => {
    if (isCurrentMonthView) return;
    setCurrentMonth(startOfMonth(today));
    setOutgoingMonth(null);
    setIsFlipping(false);
  }, [isCurrentMonthView, today]);

  const handleDateClick = useCallback(
    (day: Date) => {
      if (!isSameMonth(day, monthStart)) {
        return;
      }

      // If nothing selected or we just finished a complex range, start a fresh 1-day range
      if ((!startDate && !endDate) || (startDate && endDate && startDate.getTime() !== endDate.getTime())) {
        setStartDate(day);
        setEndDate(day);
        return;
      }

      // If we have a 1-day range (start == end), extend it or clear it
      if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
        if (day.getTime() === startDate.getTime()) {
          // Double click same day = clear? Or keep? 
          // Let's keep it selected for notes visibility, but allow clearing via UI.
          // For now, let's just keep it.
          return;
        }
        
        if (isBefore(day, startDate)) {
          setStartDate(day);
          setEndDate(startDate);
        } else {
          setEndDate(day);
        }
        return;
      }

      // Fallback: start new 1-day range
      setStartDate(day);
      setEndDate(day);
    },
    [monthStart, startDate, endDate, setStartDate, setEndDate]
  );

  const hasNotes = useCallback(
    (day: Date) => notesDates.includes(format(day, "yyyy-MM-dd")),
    [notesDates]
  );

  return {
    currentMonth,
    monthStart,
    days,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    direction,
    isFlipping,
    outgoingMonth,
    nextMonth,
    prevMonth,
    jumpToToday,
    handleDateClick,
    notesDates,
    refreshNotesDates,
    isCurrentMonthView,
    monthProgress,
    today,
    hasNotes,
  };
}

export type CalendarEngineState = ReturnType<typeof useCalendarEngine>;
