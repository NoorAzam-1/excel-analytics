import React, { useEffect, useState } from "react";
import axios from "../services/api";

const UploadsTable = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="text-gray-400">Loading uploads...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!uploads.length)
    return <p className="text-gray-400">No uploads found.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Uploaded Files</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-gray-200 border-collapse border border-gray-600 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-4 py-2 text-left">
                Filename
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Uploaded By
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Chart
              </th>
              <th className="border border-gray-600 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <React.Fragment key={upload._id}>
                <tr className="hover:bg-gray-800">
                  <td className="border border-gray-600 px-4 py-2">
                    {upload.fileName}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {upload.user?.username || "N/A"}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(upload.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {upload.chartType !== "-" ? (
                      <span>
                        {upload.chartType} ({upload.selectedAxes?.x} vs{" "}
                        {upload.selectedAxes?.y})
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not configured
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center space-x-4">
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

                {/* Data Preview Row */}
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
    </div>
  );
};

export default UploadsTable;
