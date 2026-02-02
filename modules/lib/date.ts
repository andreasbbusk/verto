import { format } from "date-fns";

export function formatShortDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return "";
  return format(value, "MMM d, yyyy");
}
