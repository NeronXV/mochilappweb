export function formatCurrency(value: number, includeSymbol: boolean = true, decimals: boolean = false, locale: string = 'es-MX'): string {
  const options = decimals ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 };
  const formatted = value.toLocaleString(locale, options);
  return includeSymbol ? `$${formatted}` : formatted;
}
