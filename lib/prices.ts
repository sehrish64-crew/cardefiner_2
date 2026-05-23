export const PRICING_MAP: Record<string, { basic: number; premium: number }> = {
  'USD': { basic: 50, premium: 80 },
  'EUR': { basic: 34.99, premium: 65.99 },
  'GBP': { basic: 31.24, premium: 58.99 },
  'AUD': { basic: 56.24, premium: 104.99 },
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'AUD': 'A$',
}

export function getPrice(packageId: 'basic' | 'premium', currency = 'USD') {
  const pricing = PRICING_MAP[currency] || PRICING_MAP['USD']
  return pricing[packageId]
}

export function getCurrencySymbol(currency: string) {
  return CURRENCY_SYMBOLS[currency] || '$'
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol} ${amount.toFixed(2)}`
}

export function getExternalPriceId(packageId: 'basic' | 'premium') {
  // TODO: Integrate with new payment provider
  return undefined
}

export function getPaddlePriceId(packageId: 'basic' | 'premium') {
  // Paddle has been removed. TODO: Integrate with new payment provider
  return undefined
}
