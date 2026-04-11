import { differenceInDays, addDays } from "date-fns";
import { getHoliday } from "@/data/holidays";

export type RangeMetrics = {
  daysSelectedCount: number;
  businessDaysCount: number;
  weekendsCount: number;
  holidaysCount: number;
};

export function calculateRangeMetrics(startDate: Date | null, endDate: Date | null): RangeMetrics {
  const metrics: RangeMetrics = {
    daysSelectedCount: 0,
    businessDaysCount: 0,
    weekendsCount: 0,
    holidaysCount: 0,
  };

  if (!startDate) {
    return metrics;
  }

  // Calculate total days
  metrics.daysSelectedCount = endDate
    ? Math.abs(differenceInDays(endDate, startDate)) + 1
    : 1;

  const startDayOfWeek = startDate.getDay();

  for (let i = 0; i < metrics.daysSelectedCount; i++) {
    const currentDay = addDays(startDate, i);
    
    // Check holiday
    if (getHoliday(currentDay.getDate(), currentDay.getMonth() + 1)) {
      metrics.holidaysCount++;
    }

    // Check weekend / business day
    const currentDayOfWeek = (startDayOfWeek + i) % 7;
    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      metrics.weekendsCount++;
    } else {
      metrics.businessDaysCount++;
    }
  }

  return metrics;
}
