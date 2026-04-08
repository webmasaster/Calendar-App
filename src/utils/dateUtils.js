import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays
} from 'date-fns';

/* 📅 Generate calendar grid */
export const getDaysInMonthGrid = (currentMonth) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDateGrid;

  while (day <= endDateGrid) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
};

/* 🎨 Month-based image themes */
export const monthThemes = [
  {
    month: 0,
    images: [
      "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1600&q=90",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=90",
      "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1600&q=90"
    ]
  },
  {
    month: 1,
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=90",
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1600&q=90",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1600&q=90"
    ]
  },
  {
    month: 2,
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&q=90",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1600&q=90",
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1600&q=90"
    ]
  },
  {
    month: 3,
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=90",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=90",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=90"
    ]
  },
  {
    month: 4,
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=90",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&q=90",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=90"
    ]
  },
  {
    month: 5,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=90",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=90",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=90"
    ]
  },
  {
    month: 6,
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=90",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=90",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=90"
    ]
  },
  {
    month: 7,
    images: [
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600&q=90",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=90",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=90"
    ]
  },
  {
    month: 8,
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=90",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=90",
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1600&q=90"
    ]
  },
  {
    month: 9,
    images: [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=90",
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1600&q=90",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=90"
    ]
  },
  {
    month: 10,
    images: [
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1600&q=90",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=90",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=90"
    ]
  },
  {
    month: 11,
    images: [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1600&q=90",
      "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1600&q=90",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=90"
    ]
  }
];

/* 🎨 Theme colors */
export const monthColors = [
  "#6366f1",
  "#3b82f6",
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#14b8a6",
  "#0ea5e9"
];

/* 🇮🇳 Fallback holidays */
export const getFallbackHolidays = (year) => ({
  [`${year}-01-01`]: "New Year's Day",
  [`${year}-01-26`]: "Republic Day",
  [`${year}-02-13`]: "Maha Shivaratri",
  [`${year}-03-02`]: "Holi",
  [`${year}-03-18`]: "Gudi Padwa",
  [`${year}-03-25`]: "Ram Navami",
  [`${year}-03-30`]: "Good Friday",
  [`${year}-04-14`]: "Ambedkar Jayanti",
  [`${year}-04-30`]: "Buddha Purnima",
  [`${year}-06-16`]: "Eid-ul-Fitr",
  [`${year}-08-15`]: "Independence Day",
  [`${year}-08-22`]: "Bakrid",
  [`${year}-08-25`]: "Onam",
  [`${year}-09-03`]: "Janmashtami",
  [`${year}-09-13`]: "Ganesh Chaturthi",
  [`${year}-10-02`]: "Gandhi Jayanti",
  [`${year}-10-19`]: "Dussehra",
  [`${year}-11-07`]: "Diwali",
  [`${year}-11-21`]: "Eid-e-Milad",
  [`${year}-11-23`]: "Guru Nanak Jayanti",
  [`${year}-12-25`]: "Christmas"
});