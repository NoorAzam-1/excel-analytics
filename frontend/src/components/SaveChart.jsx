import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SaveChart = ({ chartRef, filename, chartType }) => {
  const downloadPNG = () => {
    if (!chartRef.current) return;
    const base64 = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${filename || "chart"}_${chartType}.png`;
    link.click();
  };

  const downloadPDF = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(
        document.getElementById("chart-container"),
        { scale: 2 }
      );
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename || "chart"}_${chartType}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Failed to save PDF");
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={downloadPNG}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white"
      >
        Save as PNG
      </button>
      <button
        onClick={downloadPDF}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white"
      >
        Save as PDF
      </button>
    </div>
  );
};

export default SaveChart;
