// utils/getCurrentISTDate.js
export const getCurrentISTDate = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utc + 5.5 * 3600000); // +5:30 hours
    return istTime.toISOString().split("T")[0]; // returns YYYY-MM-DD
  };
  