import React from "react";

const chartTypes = [
  { value: "line", label: "Line Chart" },
  { value: "bar", label: "Bar Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "doughnut", label: "Doughnut Chart" },
  { value: "scatter", label: "Scatter Plot" },
  { value: "radar", label: "Radar Chart" },
];

const ChartSelector = ({
  columns,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
  chartType,
  setChartType,
}) => (
  <div className="space-y-4 bg-gray-800 p-6 rounded-xl">
    <div>
      <label className="block text-sm font-medium text-gray-300">X‑Axis</label>
      <select
        value={xAxis}
        onChange={(e) => setXAxis(e.target.value)}
        className="mt-1 w-full rounded-md bg-gray-700 text-gray-100 p-3"
      >
        <option value="">Select X</option>
        {columns.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300">Y‑Axis</label>
      <select
        value={yAxis}
        onChange={(e) => setYAxis(e.target.value)}
        className="mt-1 w-full rounded-md bg-gray-700 text-gray-100 p-3"
      >
        <option value="">Select Y</option>
        {columns
          .filter((c) => c !== xAxis)
          .map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300">
        Chart Type
      </label>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="mt-1 w-full rounded-md bg-gray-700 text-gray-100 p-3"
      >
        {chartTypes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ChartSelector;
