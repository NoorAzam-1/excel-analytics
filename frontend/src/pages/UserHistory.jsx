import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { FiInfo, FiFileText, FiChevronDown, FiChevronUp } from "react-icons/fi";

const UserHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  const normalizeFileName = (name) => {
    if (!name) return "";
    const parts = name.split("-");
    if (parts.length > 1 && /^\d+$/.test(parts[0])) {
      return parts.slice(1).join("-");
    }
    return name;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/history");
        const sortedData = res.data.sort(
          (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );
        const uniqueMap = new Map();
        sortedData.forEach((item) => {
          const normalized = normalizeFileName(item.fileName);
          if (!uniqueMap.has(normalized)) {
            uniqueMap.set(normalized, item);
          }
        });
        setHistoryData(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="">
      <div className="bg-gray-800 rounded sm:rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-6xl sm:text-4xl font-semibold sm:font-bold mb-4 text-white drop-shadow-md">
          Analysis History
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl">
          Review and access your past data uploads and generated insights.
        </p>

        {loading ? (
          <p className="text-gray-500 flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading history...</span>
          </p>
        ) : historyData.length === 0 ? (
          <div className="text-center p-12 bg-gray-900 rounded-2xl border border-gray-700">
            <FiInfo className="text-gray-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-400">
              No History Found
            </h2>
            <p className="text-gray-500 mt-2">
              Start by uploading a file to see your analysis history here.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto rounded-xl shadow-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm xl:text-xl font-semibold text-gray-400 uppercase tracking-wider">
                      File Name
                    </th>
                        <th className="px-6 py-4 text-left text-sm xl:text-xl font-semibold text-gray-400 uppercase tracking-wider">
                      Upload Date
                    </th>
                        <th className="px-6 py-4 text-left text-sm xl:text-xl font-semibold text-gray-400 uppercase tracking-wider">
                      Chart Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {historyData.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        <div className="flex items-center">
                          <FiFileText className="mr-3 text-pink-400" size={20} />
                          <span>{item.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {new Date(item.uploadDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize">
                        {item.chartType || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {historyData.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-gray-900 rounded-xl border border-gray-700 p-4 shadow-md"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex justify-between items-center text-left text-white font-semibold"
                  >
                    <div className="flex items-center">
                      <FiFileText className="mr-2 text-pink-400" size={18} />
                      {item.fileName}
                    </div>
                    {openIndex === index ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </button>

                  {openIndex === index && (
                    <div className="mt-3 space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-400">Upload Date: </span>
                        {new Date(item.uploadDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="capitalize">
                        <span className="text-gray-400">Chart Type: </span>
                        {item.chartType || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHistory;
