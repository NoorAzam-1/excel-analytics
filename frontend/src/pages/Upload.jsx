import React, { useState, useRef } from "react";
import axios from "../services/api";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import ChartSelector from "../components/ChartSelector";
import ChartDisplay from "../components/ChartDisplay";
import SaveChart from "../components/SaveChart";
import InsightsBox from "../components/InsightsBox";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import UploadsTable from "../components/UploadTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const UploadWithChart = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");
  const [chartData, setChartData] = useState(null);
  const [insight, setInsight] = useState("");

  const [uploading, setUploading] = useState(false);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  const chartRef = useRef(null);

  const validFileTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

 const getColorPalette = (numColors) => {
    const palette = [
      "#81A4F0",
      "#63D4C4",
      "#F6E455",
      "#E391F5",
      "#FF8C8C",
      "#8DE969",
      "#F59B42",
      "#6B6BFD",
      "#FD6B6B",
      "#5DDDD9",
    ];
    if (numColors <= palette.length) return palette.slice(0, numColors);
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(palette[i % palette.length]);
    }
    return colors;
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      setError("Please select a file");
      return;
    }
    if (!validFileTypes.includes(selected.type)) {
      setError("Invalid file type. Upload .xls, .xlsx or .csv");
      setFile(null);
      setColumns([]);
      setRows([]);
      return;
    }

    setError("");
    setFile(selected);
    setColumns([]);
    setRows([]);
    setXAxis("");
    setYAxis("");
    setChartData(null);
    setInsight("");
    setUploadedFileName("");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selected);

      const res = await axios.post("/upload/excel", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { filename } = res.data;
      setUploadedFileName(filename);

      const parseRes = await axios.get(`/data/parse/${filename}`);
      const { headers, rows: fetchedRows } = parseRes.data;

      setColumns(headers);
      setRows(fetchedRows);
    } catch (err) {
      console.error("Error parsing file", err);
      setError(
        "Error reading file: " + (err.response?.data?.error || err.message)
      );
      setFile(null);
      setColumns([]);
      setRows([]);
      setUploadedFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateChart = async () => {
    setError("");
    setInsight("");
    setChartData(null);

    if (!xAxis || !yAxis) {
      setError("Please select both X and Y axes");
      return;
    }
    if (xAxis === yAxis) {
      setError("X and Y axes cannot be the same");
      return;
    }
    if (!columns.includes(xAxis) || !columns.includes(yAxis)) {
      setError("Invalid axis selection");
      return;
    }

    const xi = columns.indexOf(xAxis);
    const yi = columns.indexOf(yAxis);

    // Extract labels (X axis) and data (Y axis)
    const labels = rows.map((r) => r[xi]);
    const dataValues = rows.map((r) => Number(r[yi]) || 0);

    // Determine colors for pie/doughnut charts
    const backgroundColor = ["pie", "doughnut"].includes(chartType)
      ? getColorPalette(labels.length)
      : "rgba(129,164,240,0.8)";

    const borderColor = ["pie", "doughnut"].includes(chartType)
      ? getColorPalette(labels.length)
      : "#81A4F0";

    const data = {
      labels,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data: dataValues,
          backgroundColor,
          borderColor,
          borderWidth: 2,
          fill: chartType !== "line",
        },
      ],
    };

    setChartData(data);

        try {
      await axios.post("/upload/updateChartHistory", {
        fileName: uploadedFileName,
        xAxis,
        yAxis,
        chartType,
      });
    } catch (e) {
      console.error("History saving failed", e);
    }

    // Fetch AI insights (best effort)
    setGeneratingInsights(true);
    try {
      const sampleRows = rows.slice(0, 50).map((row) => [row[xi], row[yi]]);
      const res = await axios.post("/ai/insights", {
        headers: [xAxis, yAxis],
        rows: sampleRows,
        xAxis,
        yAxis,
      });
      setInsight(res.data.insight);
    } catch (e) {
      console.error("AI insights error", e);
      setInsight("Unable to generate insights at this moment.");
    } finally {
      setGeneratingInsights(false);
    }
  };

  const canGenerate =
    file &&
    xAxis &&
    yAxis &&
    xAxis !== yAxis &&
    !uploading &&
    !generatingInsights;

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <div className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl text-gray-100">
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-md">
          Upload & Visualize Data
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Choose a file, then configure your chart and get insights + save
          options.
        </p>

        <div className="mb-6">
          <input
            id="fileInput"
            type="file"
            accept=".xls,.xlsx,.csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div
            className={`border-4 border-dashed rounded-2xl p-16 text-center transition-colors duration-300 ease-in-out cursor-pointer
              ${
                file
                  ? "border-pink-500 bg-gray-700/30"
                  : "border-gray-600 hover:border-pink-500"
              }
              ${uploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => {
              if (!uploading) document.getElementById("fileInput").click();
            }}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <FiFileText size={50} className="text-pink-400 mb-4" />
                <p className="font-semibold text-lg">{file.name}</p>
                <p className="text-gray-400 text-sm mt-2">
                  File selected. Configure chart below.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <FiUploadCloud size={60} className="mb-4" />
                <p className="mb-2 text-lg font-semibold">
                  {uploading ? "Uploading..." : "Click or Drop a file"}
                </p>
                <p className="text-sm">.xls .xlsx .csv accepted</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-400 flex items-center space-x-2">
            <FiXCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {columns.length > 0 && (
          <ChartSelector
            columns={columns}
            xAxis={xAxis}
            setXAxis={setXAxis}
            yAxis={yAxis}
            setYAxis={setYAxis}
            chartType={chartType}
            setChartType={setChartType}
          />
        )}

        <div className="mt-6 flex space-x-4 mb-4">
          {columns.length > 0 && (
            <button
              onClick={handleGenerateChart}
              disabled={!canGenerate}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300
                ${
                  canGenerate
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed"
                }
              `}
            >
              {uploading || generatingInsights
                ? "Processing..."
                : "Generate Chart & Insights"}
            </button>
          )}
        </div>

        {chartData && (
          <ChartDisplay
            chartData={chartData}
            chartType={chartType}
            chartRef={chartRef}
          />
        )}

        {chartData && (
          <SaveChart
            chartRef={chartRef}
            filename={uploadedFileName}
            chartType={chartType}
          />
        )}

        <InsightsBox insight={insight} />
        <UploadsTable/>
      </div>
    </div>
  );
};

export default UploadWithChart;
