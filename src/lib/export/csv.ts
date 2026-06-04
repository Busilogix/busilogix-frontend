type CsvValue = string | number | boolean | null | undefined;

function escapeCsvValue(value: CsvValue): string {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function downloadCsv(
  filename: string,
  rows: Record<string, CsvValue>[],
): void {
  if (typeof window === "undefined" || rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const content = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(","),
    ),
  ].join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
