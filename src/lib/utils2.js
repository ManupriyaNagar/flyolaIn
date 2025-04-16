function getNextWeekday(weekday) {
  const weekdayMap = {
    Sunday: 0, Monday: 1, Tuesday: 2,
    Wednesday: 3, Thursday: 4,
    Friday: 5, Saturday: 6,
  };
  const now = new Date();
  const currentDay = now.getDay();
  const targetDay = weekdayMap[weekday];
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  return nextDate;
}

function getAllWeekdaysInMonth(weekday) {
  const weekdayMap = {
    Sunday: 0, Monday: 1, Tuesday: 2,
    Wednesday: 3, Thursday: 4,
    Friday: 5, Saturday: 6,
  };
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const dates = [];
  const targetDay = weekdayMap[weekday];

  for (let d = new Date(now); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === targetDay) {
      dates.push(new Date(d));
    }
  }

  return dates.map(date => ({
    date: date.toISOString().split('T')[0],
    day: date.toLocaleDateString('en-US', { weekday: 'long' }),
  }));
}

module.exports = {
  getNextWeekday,
  getAllWeekdaysInMonth,
};