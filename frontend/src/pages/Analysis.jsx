import React, { useEffect, useState, useRef } from "react";
import axios from "../services/api";

import ChartSelector from "../components/ChartSelector";
import ChartDisplay from "../components/ChartDisplay";
import InsightsBox from "../components/InsightsBox";
import SaveChart from "../components/SaveChart";

const DataAnalysis = ({ filename }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");
  const [chartData, setChartData] = useState(null);
  const [insight, setInsight] = useState("");
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/data/parse/${filename}`);
        setColumns(res.data.headers);
        setRows(res.data.rows);
      } catch (err) {
        console.error("Error parsing file", err);
      }
    };

    if (filename) fetchData();
  }, [filename]);

  const handleGenerateChart = async () => {
    const xi = columns.indexOf(xAxis);
    const yi = columns.indexOf(yAxis);
    const labels = rows.map((r) => r[xi]);
    const dataValues = rows.map((r) => Number(r[yi]) || 0);

    const data = {
      labels,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data: dataValues,
          backgroundColor: "rgba(129,164,240,0.8)",
          borderColor: "#81A4F0",
          borderWidth: 2,
        },
      ],
    };

    setChartData(data);

    try {
      await axios.post("/upload/updateChartHistory", {
        fileName: filename,
        xAxis,
        yAxis,
        chartType,
      });
    } catch (err) {
      console.error("Chart save failed", err);
    }

    setGeneratingInsights(true);
    try {
      const sampleRows = rows.slice(0, 50).map((r) => [r[xi], r[yi]]);
      const res = await axios.post("/ai/insights", {
        headers: [xAxis, yAxis],
        rows: sampleRows,
        xAxis,
        yAxis,
      });
      setInsight(res.data.insight);
    } catch {
      setInsight("Unable to generate insights.");
    } finally {
      setGeneratingInsights(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-4">
        Visualize File: {filename}
      </h1>

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

      <button
        onClick={handleGenerateChart}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white mt-4"
      >
        Generate Chart
      </button>

      {chartData && (
        <>
          <ChartDisplay
            chartData={chartData}
            chartType={chartType}
            chartRef={chartRef}
          />
          <SaveChart
            chartRef={chartRef}
            filename={filename}
            chartType={chartType}
          />
          <InsightsBox insight={insight} />
        </>
      )}
    </div>
  );
};

export default DataAnalysis;
