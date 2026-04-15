import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventTime(timeStr?: string | null) {
  if (!timeStr) return "";
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  if (timeRegex.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours, 10), parseInt(minutes, 10));
    
    // Format to hh:mm a (e.g. "02:30 PM")
    let hours12 = parseInt(hours, 10) % 12;
    hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
    const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    const formattedHours = hours12 < 10 ? '0' + hours12 : hours12;
    
    return `${formattedHours}:${minutes} ${ampm} EST`;
  }
  return timeStr;
}
