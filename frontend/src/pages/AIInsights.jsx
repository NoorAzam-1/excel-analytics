import React, { useEffect, useState } from "react";
import axios from "../services/api";
import {
  FiUploadCloud,
  FiTrendingUp,
  FiCpu,
  FiAlertCircle,
  FiBarChart2,
  FiLoader,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const AIInsights = () => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = ["Product", "Region", "Sales", "Quarter"];
  const rows = [
    { Product: "Laptop Pro", Region: "West", Sales: 100000, Quarter: "Q1" },
    { Product: "Laptop Pro", Region: "West", Sales: 120000, Quarter: "Q2" },
    { Product: "Laptop Pro", Region: "West", Sales: 140000, Quarter: "Q3" },
    { Product: "Tablet X", Region: "East", Sales: 80000, Quarter: "Q1" },
  ];

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.post("/ai/insights", {
          headers,
          rows,
        });
        setInsight(response.data.insight);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Failed to fetch AI insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <FiCpu className="text-pink-500 mx-auto mb-4" size={64} />
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            AI-Powered Insights
            <span className="text-fuchsia-400 ml-3">(Beta)</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Leverage artificial intelligence to get a deeper understanding of
            your data. Discover trends, outliers, and key metrics without manual
            analysis.
          </p>
        </div>

        {/* AI Output */}
        {loading ? (
          <div className="flex justify-center items-center text-gray-400 py-12">
            <FiLoader className="animate-spin text-2xl mr-3" />
            <span className="text-lg">Analyzing your data...</span>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center text-lg py-10">{error}</div>
        ) : (
          <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Generated Insights
            </h2>
            <p className="text-gray-300 whitespace-pre-line">{insight}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <Link
            to="/upload"
            className="flex items-center space-x-2 px-8 py-4 bg-fuchsia-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:bg-fuchsia-700"
          >
            <FiUploadCloud size={20} />
            <span>Upload New Data</span>
          </Link>
          <div className="flex items-center text-sm text-gray-400">
            <FiAlertCircle className="mr-2 text-yellow-500" size={18} />
            <span>
              This feature is in beta and insights may not be fully accurate.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
