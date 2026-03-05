import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getCsrfToken = () =>
    document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1] ?? '';
