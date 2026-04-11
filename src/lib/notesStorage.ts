import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useStore } from "@/store/useStore";

export function getNoteKey(
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

/** Collect YYYY-MM-DD strings in `currentMonth` that have non-empty range notes in our Zustand store. */
export function collectNotesDatesForMonth(currentMonth: Date): string[] {
  const monthStartDate = startOfMonth(currentMonth);
  const monthEndDate = endOfMonth(currentMonth);
  const noteDateSet = new Set<string>();

  const notes = useStore.getState().notes;

  for (const key of Object.keys(notes)) {
    if (!key.startsWith("calendar-note-range-")) {
      continue;
    }

    const noteText = notes[key] || "";
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

  return Array.from(noteDateSet);
}

/** Finds a note key that exactly matches the selection, or a range note that covers the selection if it's a single date. */
export function findBestNoteKey(
  year: number,
  month: number,
  startDate: Date | null,
  endDate: Date | null
): { key: string; isInherited: boolean } {
  const notes = useStore.getState().notes;
  const exactKey = getNoteKey(year, month, startDate, endDate);

  // If we have an exact match, use it
  if (notes[exactKey]) {
    return { key: exactKey, isInherited: false };
  }

  // If a single day is selected, check if it's part of a larger range note
  if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
    const selectedTime = startDate.getTime();

    for (const key of Object.keys(notes)) {
      if (!key.startsWith("calendar-note-range-")) continue;

      const match = key.match(/^calendar-note-range-(\d{4}-\d{2}-\d{2})-to-(\d{4}-\d{2}-\d{2})$/);
      if (!match) continue;

      const rangeStart = new Date(`${match[1]}T00:00:00`).getTime();
      const rangeEnd = new Date(`${match[2]}T00:00:00`).getTime();

      if (selectedTime >= rangeStart && selectedTime <= rangeEnd) {
        return { key, isInherited: true };
      }
    }
  }

  // Default to exact key even if empty
  return { key: exactKey, isInherited: false };
}
