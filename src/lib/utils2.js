// utils.js (or dateUtils.js)
export const getNextWeekday = (targetDay) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const todayDay = today.getDay();
    const targetDayIndex = daysOfWeek.indexOf(targetDay);
  
    let daysToAdd = targetDayIndex - todayDay;
    if (daysToAdd < 0) daysToAdd += 7; // Move to next week if target day has passed
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    
    return nextDate;
  };
  