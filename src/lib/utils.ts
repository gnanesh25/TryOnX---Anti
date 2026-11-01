import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price from integer paise to INR string */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

/** Calculate discount percentage */
export function discountPercent(originalPaise: number, sellingPaise: number): number {
  if (!originalPaise || originalPaise <= sellingPaise) return 0
  return Math.round(((originalPaise - sellingPaise) / originalPaise) * 100)
}

/** Slugify a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen).trim() + '…'
}

/** Generate a random order-like ID (for display only) */
export function generateOrderNumber(): string {
  return `TXO${Date.now().toString(36).toUpperCase()}`
}

/** Parse query string safely */
export function parseQueryParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/** Validate Indian mobile number */
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

/** Validate Indian PIN code */
export function isValidPinCode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin.trim())
}

/** Delay helper */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Get initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

/** Safely parse JSON from localStorage */
export function getLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

/** Safely set JSON to localStorage */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail if storage quota exceeded
  }
}
