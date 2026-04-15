import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventTime(startTime?: string | null, endTime?: string | null, timezone: string = 'EST') {
  if (!startTime) return "";

  const formatTime = (timeStr: string) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
    if (timeRegex.test(timeStr)) {
      const [hours, minutes] = timeStr.split(':');
      let hours12 = parseInt(hours, 10) % 12;
      hours12 = hours12 ? hours12 : 12; 
      const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
      const formattedHours = hours12 < 10 ? '0' + hours12 : hours12;
      return `${formattedHours}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  const formattedStart = formatTime(startTime);
  if (endTime) {
    const formattedEnd = formatTime(endTime);
    return `${formattedStart} - ${formattedEnd} ${timezone}`;
  }
  
  return `${formattedStart} ${timezone}`;
}
