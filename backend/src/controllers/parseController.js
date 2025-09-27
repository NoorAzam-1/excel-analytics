import XLSX from 'xlsx';
import path from 'path';

export const parseExcel = (req, res) => {
  const filePath = path.join('uploads', req.params.filename);

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    const headers = raw[0];
    const rows = raw.slice(1);

    res.json({ headers, rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse Excel file' });
  }
};
