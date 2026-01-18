import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string, cacheBust?: number): string {
  if (!cacheBust) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${cacheBust}`;
}

export function parseApiDate(dateString?: string | null): Date | null {
  if (!dateString) return null;

  const tryParse = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  return tryParse(dateString) ?? tryParse(dateString.replace(" ", "T"));
}

export function formatShortDate(dateString?: string | null): string | null {
  const d = parseApiDate(dateString);
  if (!d) return null;
  return d.toLocaleDateString("en-GB");
}
