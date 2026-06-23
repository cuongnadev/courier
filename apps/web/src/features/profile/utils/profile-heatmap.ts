import type { ProfileActivityDay } from "@/features/profile/types";

import { formatMonth, formatShortDate } from "./profile-formatters";

export function buildActivityWeeks(days: ProfileActivityDay[]) {
  const cells: Array<ProfileActivityDay | null> = [];

  if (days.length === 0) {
    return Array.from({ length: 12 }, () => Array(7).fill(null));
  }

  const firstDay = new Date(days[0].date);
  const leadingEmptyDays = firstDay.getDay();

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    cells.push(null);
  }

  cells.push(...days);

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7),
  );
}

export function buildMonthLabels(weeks: Array<Array<ProfileActivityDay | null>>) {
  let previousMonth = "";

  return weeks.map((week) => {
    const firstDay = week.find((day) => day !== null);

    if (!firstDay) return "";

    const month = formatMonth(firstDay.date);

    if (month === previousMonth) return "";

    previousMonth = month;
    return month;
  });
}

export function getHeatLevel(runs: number) {
  if (runs === 0) return 0;
  if (runs <= 2) return 1;
  if (runs <= 5) return 2;
  if (runs <= 9) return 3;
  return 4;
}

export function getHeatColor(level: number) {
  const colors = ["#F3F4F6", "#CFF7D3", "#7DD87F", "#34A853", "#176B34"];

  return colors[level] ?? colors[0];
}

export function getDayTitle(day: ProfileActivityDay) {
  return `${formatShortDate(day.date)}: ${day.runs} runs, ${day.successfulRuns} successful`;
}