import React, { useState, useEffect, useRef } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "../services/api";

import { FiDownload, FiSearch, FiBarChart2, FiCode } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Chart = () => {
  const [filename, setFilename] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");
  const [chartData, setChartData] = useState(null);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!filename) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/data/parse/${filename}`);
        const { headers, rows: fetchedRows } = res.data;
        setColumns(headers);
        setRows(fetchedRows);
      } catch (err) {
        console.error("Error fetching parsed data", err);
        alert(" Failed to load data. Check the filename or server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filename]);

  const handleGenerateChart = () => {
    if (!xAxis || !yAxis) {
      alert("Please select both X and Y axes.");
      return;
    }

    const xIndex = columns.indexOf(xAxis);
    const yIndex = columns.indexOf(yAxis);

    const labels = rows.map((row) => row[xIndex]);
    const dataPoints = rows.map((row) => Number(row[yIndex]) || 0);

    const data = {
      labels,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data: dataPoints,
          backgroundColor:
            chartType === "pie"
              ? [
                  "#81A4F0",
                  "#63D4C4",
                  "#F6E455",
                  "#E391F5",
                  "#FF8C8C",
                  "#91E0FF",
                  "#FFBD80",
                ]
              : "rgba(129, 164, 240, 0.8)",
          borderColor:
            chartType === "pie"
              ? [
                  "#81A4F0",
                  "#63D4C4",
                  "#F6E455",
                  "#E391F5",
                  "#FF8C8C",
                  "#91E0FF",
                  "#FFBD80",
                ]
              : "#81A4F0",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    setChartData(data);

    // Save to history
    axios
      .post("/data/history", {
        fileName: filename,
        selectedAxes: { x: xAxis, y: yAxis },
        chartType,
      })
      .catch((e) => console.error("📉 History save error:", e));
  };

  const fetchInsights = async () => {
    if (!filename || !xAxis || !yAxis) {
      alert("Please select a file and both X & Y axes for AI insights.");
      return;
    }

    setInsight(" Generating insights...");
    try {
      const res = await axios.post("/ai/insights", {
        headers: columns,
        rows: rows.slice(0, 50),
        xAxis,
        yAxis,
      });
      setInsight(res.data.insight);
    } catch (err) {
      console.error(" AI insight error", err);
      setInsight("Failed to get AI insights. Please try again.");
    }
  };

  const handleDownloadPNG = () => {
    if (!chartRef.current) return;
    const base64 = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${filename}_${chartType}.png`;
    link.click();
  };

  const handleDownloadPDF = async () => {
    const chartElement = document.getElementById("chart-container");
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: "#1C2833",
        useCORS: true,
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}_${chartType}.pdf`);
    } catch (error) {
      console.error(" PDF generation failed:", error);
      alert("Export failed. See console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-blue-400">
            Data Dashboard 📊
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Visualize your data, get insights, and export your findings.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Settings Panel */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                <FiCode className="mr-2 text-blue-400" />
                Chart Settings
              </h2>

              {/* File Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  File Name
                </label>
                <div className="relative">
                  <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="e.g. sales_data.csv"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="pl-10 py-2 w-full bg-gray-700 text-gray-100 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {loading && (
                  <p className="mt-2 text-sm text-blue-400">Loading data...</p>
                )}
              </div>

              {/* Axis & Chart Type Selectors */}
              {columns.length > 0 && (
                <>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      X-Axis
                    </label>
                    <select
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                      className="w-full bg-gray-700 text-gray-100 rounded-md py-2"
                    >
                      <option value="">-- Select --</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Y-Axis
                    </label>
                    <select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                      className="w-full bg-gray-700 text-gray-100 rounded-md py-2"
                    >
                      <option value="">-- Select --</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Chart Type
                    </label>
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="w-full bg-gray-700 text-gray-100 rounded-md py-2"
                    >
                      <option value="line">Line</option>
                      <option value="bar">Bar</option>
                      <option value="pie">Pie</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* AI Insight Panel */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                <FaRobot className="mr-2 text-green-500" />
                AI Insights
              </h2>
              <button
                onClick={fetchInsights}
                className="w-full py-2 px-4 rounded-md bg-green-700 hover:bg-green-800 text-white font-medium flex items-center justify-center"
              >
                <FaRobot className="mr-2" />
                Generate Insights
              </button>
              {insight && (
                <div className="mt-4 p-4 bg-gray-900 rounded-md text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {insight}
                </div>
              )}
            </div>
          </div>

          {/* Main Panel - Chart */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
                <FiBarChart2 className="mr-2 text-blue-400" />
                Chart Output
              </h2>

              <div className="flex justify-center mb-6">
                <button
                  onClick={handleGenerateChart}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md shadow-md"
                >
                  Generate Chart
                </button>
              </div>

              {/* Chart Output */}
              {chartData && (
                <>
                  <div
                    id="chart-container"
                    className="bg-gray-900 p-6 rounded-lg"
                  >
                    {chartType === "line" && (
                      <Line
                        ref={chartRef}
                        data={chartData}
                        options={{ responsive: true }}
                      />
                    )}
                    {chartType === "bar" && (
                      <Bar
                        ref={chartRef}
                        data={chartData}
                        options={{ responsive: true }}
                      />
                    )}
                    {chartType === "pie" && (
                      <Pie
                        ref={chartRef}
                        data={chartData}
                        options={{ responsive: true }}
                      />
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handleDownloadPNG}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <FiDownload className="mr-2" />
                      Download PNG
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <FiDownload className="mr-2" />
                      Download PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
