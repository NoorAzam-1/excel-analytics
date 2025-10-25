import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { FiFileText, FiChevronDown, FiChevronUp, FiDownload, FiEye } from "react-icons/fi";

const UploadsTable = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState(null);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/history");
        setUploads(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load uploads");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  const handleViewData = async (filename) => {
    try {
      const res = await axios.get(`/data/parse/${filename}`);
      setPreviewData(res.data);
      setPreviewFile(filename);
    } catch (err) {
      console.error("Failed to fetch file data", err);
      setPreviewData(null);
      setPreviewFile(null);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`/history/download/${filename}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  if (loading)
    return (
      <p className="text-gray-400 text-center py-8 text-lg animate-pulse">
        Loading uploads...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center py-8 text-lg font-semibold">
        {error}
      </p>
    );
  if (!uploads.length)
    return (
      <p className="text-gray-400 text-center py-8 text-lg">
        No uploads found.
      </p>
    );

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="bg-gray-800 rounded-3xl px-3 py-8 lg:p-10 shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">
        Uploaded Files
      </h2>

      <div className="hidden xl:block overflow-x-auto rounded-xl border border-gray-700">
        <table className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden bg-gray-900 text-gray-100">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 px-6 py-3 text-left">Filename</th>
              <th className="border border-gray-700 px-6 py-3 text-left">Uploaded By</th>
              <th className="border border-gray-700 px-6 py-3 text-left">Date</th>
              <th className="border border-gray-700 px-6 py-3 text-left">Chart</th>
              <th className="border border-gray-700 px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <React.Fragment key={upload._id}>
                <tr className="hover:bg-gray-800 transition-colors duration-150">
                  <td className="border-t border-t-gray-700 px-6 py-3 flex items-center">
                    <FiFileText className="mr-2 text-pink-400" />
                    {upload.fileName}
                  </td>
                  <td className="border border-gray-700 px-6 py-3">
                    {capitalize(upload.user?.username || "N/A") }
                  </td>
                  <td className="border border-gray-700 px-6 py-3">
                    {new Date(upload.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-700 px-6 py-3">
                    {upload.chartType !== "-" ? (
                      <span> 
                        {upload.chartType} ({upload.selectedAxes?.x} vs{" "} 
                        {upload.selectedAxes?.y})
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Not configured</span>
                    )}
                  </td>
                  <td className="border border-gray-700 px-6 py-3 text-center space-x-4">
                    <button
                      className="text-blue-400 hover:text-blue-600 underline"
                      onClick={() => handleDownload(upload.fileName)}
                    >
                      Download
                    </button>
                    <button
                      className="text-green-400 hover:text-green-600 underline"
                      onClick={() => handleViewData(upload.fileName)}
                    >
                      View Data
                    </button>
                  </td>
                </tr>

                {previewFile === upload.fileName && previewData && (
                  <tr>
                    <td
                      colSpan="5"
                      className="bg-gray-900 border border-gray-700 px-4 py-4"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">
                        Preview of {upload.fileName}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-600 text-sm text-gray-300">
                          <thead>
                            <tr className="bg-gray-700">
                              {previewData.headers.map((header, idx) => (
                                <th
                                  key={idx}
                                  className="border border-gray-600 px-2 py-1"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.rows.slice(0, 5).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-800">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="border border-gray-600 px-2 py-1"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-gray-400 mt-2 italic">
                          Showing first 5 rows only.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* For small screens */}
      <div className="xl:hidden space-y-4">
        {uploads.map((upload, index) => (
          <div
            key={upload._id}
            className="bg-gray-900 border border-gray-700 rounded sm:rounded-2xl py-3 px-2 sm:p-4 shadow-lg"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOpenRow(openRow === index ? null : index)}
            >
              <div className="flex items-center">
                <FiFileText className="mr-1 sm:mr-3 text-pink-400" />
                <span className="text-white text-sm sm:text-md font-semibold truncate">
                  {upload.fileName}
                </span>
              </div>
              {openRow === index ? (
                <FiChevronUp className="text-gray-400" />
              ) : (
                <FiChevronDown className="text-gray-400" />
              )}
            </div>

            {openRow === index && (
              <div className="mt-3 text-sm text-gray-300 space-y-1 pl-6">
                <p>
                  <span className="text-gray-400 ">Uploaded By:</span>{" "}
                  {capitalize(upload.user?.username || "N/A")}
                </p>
                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(upload.uploadDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-gray-400">Chart:</span>{" "}
                  {upload.chartType !== "-" ? (
                    <span>
                      {upload.chartType} ({upload.selectedAxes?.x} vs{" "}
                      {upload.selectedAxes?.y})
                    </span>
                  ) : (
                    "Not configured"
                  )}
                </p>

                <div className="pt-2 flex space-x-4">
                  <button
                    className="flex items-center text-blue-400 hover:text-blue-600 underline"
                    onClick={() => handleDownload(upload.fileName)}
                  >
                    <FiDownload className="mr-1" /> Download
                  </button>
                  <button
                    className="flex items-center text-green-400 hover:text-green-600 underline"
                    onClick={() => handleViewData(upload.fileName)}
                  >
                    <FiEye className="mr-1" /> View
                  </button>
                </div>

                {previewFile === upload.fileName && previewData && (
                  <div className="mt-3 overflow-x-auto">
                    <h3 className="text-md font-semibold text-gray-300 mb-1">
                      Preview
                    </h3>
                    <table className="min-w-full border border-gray-600 text-xs text-gray-300">
                      <thead>
                        <tr className="bg-gray-700">
                          {previewData.headers.slice(0, 4).map((header, idx) => (
                            <th key={idx} className="border border-gray-600 px-2 py-1">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.rows.slice(0, 3).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-gray-800">
                            {row.slice(0, 4).map((cell, cIdx) => (
                              <td key={cIdx} className="border border-gray-600 px-2 py-1">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadsTable;
