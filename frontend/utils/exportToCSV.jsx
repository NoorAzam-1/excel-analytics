export default function exportToCSV(data, filename = "users.csv") {
  const csvRows = [];

  // Headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header] ?? "";
      return `"${val.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  // Download
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
