import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const toVisibleTime = (date: Date = new Date()) => new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
}).format(date)

export const toVisibleDate = (date: Date = new Date()) => new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(date)
