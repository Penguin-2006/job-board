export const DEADLINE_TZ_OFFSET_MINUTES = 330;

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const OFFSET = DEADLINE_TZ_OFFSET_MINUTES * MINUTE;


export const closesAt = (deadline) =>
  new Date(new Date(deadline).getTime() + DAY - OFFSET - 1);

export const isClosed = (deadline, now = Date.now()) => {
  if (!deadline) return false;
  return closesAt(deadline).getTime() < now;
};

export const startOfTodayInZone = (now = Date.now()) => {
  const date = new Date(now + OFFSET);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};


export const openDeadlineCutoff = (now = Date.now()) =>
  new Date(now - DAY + OFFSET + 1);