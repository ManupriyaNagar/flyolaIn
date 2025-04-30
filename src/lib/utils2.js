const weekdayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Returns the Date object for the next [weekday] after today.
 * @param {"Sunday"|"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"} weekday
 * @returns {Date}
 */
function getNextWeekday(weekday) {
  const now = new Date();
  const currentDay = now.getDay();
  const targetDay = weekdayMap[weekday];
  // compute difference in [1..7]
  const daysToAdd = ((targetDay - currentDay + 7) % 7) || 7;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  return nextDate;
}

/**
 * Returns an array of all dates in the current month that fall on [weekday].
 * Each entry is { date: "YYYY-MM-DD", day: "WeekdayName" }.
 * @param {"Sunday"|"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"} weekday
 * @returns {{date: string, day: string}[]}
 */
function getAllWeekdaysInMonth(weekday) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const targetDay = weekdayMap[weekday];
  const results = [];

  // iterate day-by-day from today until month-end
  for (let d = new Date(now); d <= lastDay; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === targetDay) {
      results.push({
        date: d.toISOString().split("T")[0],
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
      });
    }
  }

  return results;
}

module.exports = {
  getNextWeekday,
  getAllWeekdaysInMonth,
};
