import type { Translations } from "./types"

export function getMonthName(monthIndex: number, t: Translations): string {
  const months = [
    t.months.jan,
    t.months.feb,
    t.months.mar,
    t.months.apr,
    t.months.may,
    t.months.jun,
    t.months.jul,
    t.months.aug,
    t.months.sep,
    t.months.oct,
    t.months.nov,
    t.months.dec,
  ]
  return months[monthIndex] || ""
}

export function getDayName(dayIndex: number, t: Translations): string {
  const days = [t.days.sun, t.days.mon, t.days.tue, t.days.wed, t.days.thu, t.days.fri, t.days.sat]
  return days[dayIndex] || ""
}

export function getShortDayName(dayIndex: number, t: Translations): string {
  return getDayName(dayIndex, t)
}
