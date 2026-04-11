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
} from "date-fns";

export type DateRangeState = "start" | "end" | "inRange" | "none";

export function buildCalendarDays(viewMonth: Date): Date[] {
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function getDateState(
  day: Date,
  monthStartForView: Date,
  startDate: Date | null,
  endDate: Date | null
): DateRangeState {
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
}

export function getMonthProgress(): number {
  const today = new Date();
  const currentDay = today.getDate();
  const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return currentDay / totalDaysInMonth;
}

export function isWeekendDay(day: Date): boolean {
  const d = day.getDay();
  return d === 0 || d === 6;
}
