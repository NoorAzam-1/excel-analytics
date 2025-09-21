import React from "react";
import PropTypes from "prop-types";

const UploadHistoryTable = ({
  uploads,
  onDownload,
  onDelete,
  isAdminView = false,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <p className="text-gray-400 text-center py-8 text-lg animate-pulse">
        Loading uploads...
      </p>
    );
  }
  if (error) {
    return (
      <p className="text-red-500 text-center py-8 text-lg font-semibold">
        {error}
      </p>
    );
  }
  if (!uploads.length) {
    return (
      <p className="text-gray-400 text-center py-8 text-lg">No uploads found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900 text-gray-100">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="border border-gray-700 px-6 py-3 text-left">Filename</th>
            {isAdminView && (
              <>
                <th className="border border-gray-700 px-6 py-3 text-left">User</th>
              </>
            )}
            <th className="border border-gray-700 px-6 py-3 text-left">Upload Date</th>
            <th className="border border-gray-700 px-6 py-3 text-left">Chart</th>
            <th className="border border-gray-700 px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr
              key={upload._id}
              className="hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="border border-gray-700 px-6 py-3 font-mono truncate max-w-xs" title={upload.fileName}>
                {upload.fileName}
              </td>
              {isAdminView && (
                <td className="border border-gray-700 px-6 py-3">
                  {upload.user?.username || "Unknown"}
                </td>
              )}
              <td className="border border-gray-700 px-6 py-3">
                {new Date(upload.uploadDate).toLocaleString()}
              </td>
              <td className="border border-gray-700 px-6 py-3">
                {upload.chartType && upload.chartType !== "-"
                  ? `${upload.chartType} (${upload.selectedAxes?.x} vs ${upload.selectedAxes?.y})`
                  : "Not configured"}
              </td>
              <td className="border border-gray-700 px-6 py-3 text-center space-x-3">
                <button
                  onClick={() => onDownload(upload.fileName)}
                  className="text-blue-400 hover:text-blue-600 underline font-semibold"
                >
                  Download
                </button>
                <button
                  onClick={() => onDelete(upload._id)}
                  className="text-red-400 hover:text-red-600 underline font-semibold"
                  title="Delete Upload"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UploadHistoryTable.propTypes = {
  uploads: PropTypes.array.isRequired,
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdminView: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default UploadHistoryTable;
