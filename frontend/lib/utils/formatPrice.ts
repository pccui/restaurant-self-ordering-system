/**
 * Format price from cents to Euro display string
 * @param cents - Price in cents (e.g., 1299 for €12.99)
 * @returns Formatted price string (e.g., "€12.99")
 */
export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`
}

/**
 * Format price with currency symbol after amount (European style)
 * @param cents - Price in cents
 * @returns Formatted price string (e.g., "12.99 €")
 */
export function formatPriceEuropean(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`
}
