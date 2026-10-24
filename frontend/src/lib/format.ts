/** Formats a price with its currency symbol, e.g. 150 EUR -> "150 €", 80 USD -> "80 US$" */
export function formatPrice(amount: number | string, currency = "EUR"): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return `${amount} ${currency}`;
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    // Unknown currency code
    return `${value} ${currency}`;
  }
}
