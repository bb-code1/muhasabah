import { RelapseLog } from '@prisma/client';

export const calculateStreak = (initialLogs: RelapseLog[]) => {
  if (initialLogs.length === 0) return { days: 0, text: 'No logs yet. Start your clean streak today!' };
  
  // Sort logs descending
  const sorted = [...initialLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastLogDate = new Date(sorted[0].date);
  const now = new Date();
  
  const diffMs = now.getTime() - lastLogDate.getTime();
  if (diffMs < 0) return { days: 0, text: 'Stay strong!' };
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return { days: 0, text: 'Last occurrence was today. Reset, refocus, and keep going!' };
  }
  if (diffDays === 1) {
    return { days: 1, text: '1 day clean. You are on the right track!' };
  }
  return { days: diffDays, text: `${diffDays} days clean. Keep up the excellent work!` };
};

export const getCalendarGrid = (year: number) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  const grid: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = Array(7).fill(null);
  
  const startDay = startDate.getDay();
  let cur = new Date(startDate);
  
  for (let i = startDay; i < 7; i++) {
    currentWeek[i] = new Date(cur);
    cur.setDate(cur.getDate() + 1);
  }
  grid.push(currentWeek);
  
  currentWeek = Array(7).fill(null);
  while (cur <= endDate) {
    const dayOfWeek = cur.getDay();
    currentWeek[dayOfWeek] = new Date(cur);
    if (dayOfWeek === 6 || cur.getTime() === endDate.getTime()) {
      grid.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
    cur.setDate(cur.getDate() + 1);
  }
  
  return grid;
};

export const getYearOptions = (initialLogs: RelapseLog[]) => {
  const yearsSet = new Set<number>();
  yearsSet.add(new Date().getFullYear());
  initialLogs.forEach(log => {
    yearsSet.add(new Date(log.date).getFullYear());
  });
  return Array.from(yearsSet).sort((a, b) => b - a);
};
