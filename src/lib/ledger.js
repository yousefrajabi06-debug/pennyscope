export const categories = ["Food", "Transport", "Learning", "Home", "Other"];
export const monthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
export const today = () =>
  `${monthKey()}-${String(new Date().getDate()).padStart(2, "0")}`;
export const money = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export const validEntries = (value) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      typeof item.id === "string" &&
      typeof item.note === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
      ["income", "expense"].includes(item.kind) &&
      Number.isSafeInteger(item.cents) &&
      item.cents > 0 &&
      item.cents <= 100000000 &&
      categories.includes(item.category),
  );
export function summary(entries) {
  return entries.reduce(
    (total, item) => ({ ...total, [item.kind]: total[item.kind] + item.cents }),
    { income: 0, expense: 0 },
  );
}
export function downloadCsv(entries) {
  // Neutralize spreadsheet formulas, including those hidden behind whitespace.
  const cell = (value) =>
    '"' +
    String(value)
      .replace(/^[\s]*[=+@-]/, (match) => "'" + match)
      .replaceAll('"', '""') +
    '"';
  const rows = [
    ["Date", "Type", "Category", "Description", "Amount USD"],
    ...entries.map((item) => [
      item.date,
      item.kind,
      item.category,
      item.note,
      (item.cents / 100).toFixed(2),
    ]),
  ];
  const url = URL.createObjectURL(
    new Blob([rows.map((row) => row.map(cell).join(",")).join("\r\n")], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "pennyscope-transactions.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
