import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format milliseconds to a human readable time string
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Format a timestamp to a human readable date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Get a provider-specific background color
 */
export function getProviderBgColor(provider: string): string {
  const colorMap: Record<string, string> = {
    openai: 'bg-green-100 text-green-800',
    anthropic: 'bg-purple-100 text-purple-800',
    google: 'bg-blue-100 text-blue-800',
    mistral: 'bg-cyan-100 text-cyan-800',
    llama: 'bg-orange-100 text-orange-800',
  }

  return colorMap[provider.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
