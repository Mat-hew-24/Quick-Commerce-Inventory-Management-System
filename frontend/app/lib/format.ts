export const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function getCellValue(
  row: Record<string, string | number | boolean>,
  key: string,
) {
  return row[key];
}
