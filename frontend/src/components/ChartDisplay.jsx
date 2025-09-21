import React from 'react';
import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Scatter,
  Radar,
} from 'react-chartjs-2';

const ChartDisplay = ({ chartData, chartType, chartRef }) => {
  if (!chartData) return null;

  switch(chartType) {
    case 'line':
      return <Line ref={chartRef} data={chartData} options={{ responsive: true }} />;
    case 'bar':
      return <Bar ref={chartRef} data={chartData} options={{ responsive: true }} />;
    case 'pie':
      return <Pie ref={chartRef} data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />;
    case 'doughnut':
      return <Doughnut ref={chartRef} data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />;
    case 'scatter':
      return <Scatter ref={chartRef} data={chartData} options={{ responsive: true, scales: { x: { type: 'linear', position: 'bottom' } } }} />;
    case 'radar':
      return <Radar ref={chartRef} data={chartData} options={{ responsive: true }} />;
    default:
      return <Line ref={chartRef} data={chartData} options={{ responsive: true }} />;
  }
};

export default ChartDisplay;
