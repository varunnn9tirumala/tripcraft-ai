/**
 * Formats a number as currency with the appropriate symbol and regional conventions
 * @param amount - The numeric amount to format
 * @param currency - The currency code (USD, INR, GBP, AED, SGD, EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('formatCurrency received invalid amount:', amount);
    return '₹0';
  }

  const currencyConfig: Record<string, { locale: string; currency: string }> = {
    USD: { locale: 'en-US', currency: 'USD' },
    INR: { locale: 'en-IN', currency: 'INR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    AED: { locale: 'ar-AE', currency: 'AED' },
    SGD: { locale: 'en-SG', currency: 'SGD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
  };

  const config = currencyConfig[currency] || currencyConfig.INR;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${amount}`;
  }
}
