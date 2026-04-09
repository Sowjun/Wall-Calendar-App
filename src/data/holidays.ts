export type Holiday = {
  month: number;
  day: number;
  name: string;
};

export const holidays: Holiday[] = [
  { month: 1, day: 1, name: "New Year's Day" },
  { month: 1, day: 14, name: "Makar Sankranti" },
  { month: 1, day: 26, name: "Republic Day" },
  { month: 3, day: 4, name: "Holi" },
  { month: 3, day: 31, name: "Eid al-Fitr" },
  { month: 4, day: 14, name: "Dr. Ambedkar Jayanti" },
  { month: 8, day: 15, name: "Independence Day" },
  { month: 8, day: 16, name: "Janmashtami" },
  { month: 10, day: 2, name: "Gandhi Jayanti" },
  { month: 10, day: 20, name: "Diwali" },
  { month: 11, day: 24, name: "Guru Nanak Jayanti" },
  { month: 12, day: 25, name: "Christmas" },
];

export function getHoliday(day: number, month: number) {
  const holiday = holidays.find((entry) => entry.day === day && entry.month === month);
  return holiday || null;
}
