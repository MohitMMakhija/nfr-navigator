import { format } from "date-fns";

export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy, HH:mm");
}
