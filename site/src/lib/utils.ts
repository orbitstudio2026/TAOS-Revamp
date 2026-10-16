import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge that the custom display sizes are font sizes, not text colours.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display-xl", "display-lg", "display-md"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_VEIL = [0.76, 0, 0.24, 1] as const;

/** Resolve a file in /public against the deploy base (e.g. GitHub Pages serves under /TAOS-Revamp/). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
