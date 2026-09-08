export const npr = (amount?: number) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-NP", { dateStyle: "medium" }).format(new Date(date))
    : "";

export function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Array.from({ length: 4 }, () =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  ).join("");
  return `SWR-${time}${rand}`;
}