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
    <div className="w-full">
      <div className="hidden xl:block w-full overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900 text-gray-100 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 px-4 py-3 text-left">Filename</th>
              {isAdminView && (
                <th className="border border-gray-700 px-4 py-3 text-left">User</th>
              )}
              <th className="border border-gray-700 px-4 py-3 text-left">Upload Date</th>
              <th className="border border-gray-700 px-4 py-3 text-left">Chart</th>
              <th className="border border-gray-700 px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr
                key={upload._id}
                className="hover:bg-gray-800 transition-colors duration-150 align-top"
              >
                <td
                  className="border border-gray-700 px-4 py-3 font-mono truncate max-w-[220px] md:max-w-xs break-words"
                  title={upload.fileName}
                >
                  {upload.fileName}
                </td>
                {isAdminView && (
                  <td className="border border-gray-700 px-4 py-3 whitespace-nowrap">
                    {upload.user?.username || "Unknown"}
                  </td>
                )}
                <td className="border border-gray-700 px-4 py-3 whitespace-nowrap">
                  {new Date(upload.uploadDate).toLocaleString()}
                </td>
                <td className="border border-gray-700 px-4 py-3">
                  <div className="truncate max-w-[200px]">
                    {upload.chartType && upload.chartType !== "-"
                      ? `${upload.chartType} (${upload.selectedAxes?.x} vs ${upload.selectedAxes?.y})`
                      : "Not configured"}
                  </div>
                </td>
                <td className="border border-gray-700 px-4 py-3 text-center space-x-3">
                  <button
                    onClick={() => onDownload(upload.fileName)}
                    className="text-blue-400 hover:text-blue-600 underline font-semibold text-sm"
                    aria-label={`Download ${upload.fileName}`}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDelete(upload._id)}
                    className="text-red-400 hover:text-red-600 underline font-semibold text-sm"
                    title="Delete Upload"
                    aria-label={`Delete ${upload.fileName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden space-y-3">
        {uploads.map((upload) => (
          <article
            key={upload._id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-sm"
            aria-labelledby={`upload-${upload._id}`}
          >
            <div className="flex flex-col items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-gray-200 text-base w-20 mr-6 shrink-0">FileName:</span>
                <span
                  id={`upload-${upload._id}`}
                  className="text-sm  text-gray-100 truncate"
                  title={upload.fileName}
                >
                  {upload.fileName}
                </span>

                <div className="mt-2 text-xs text-gray-300 space-y-1">
                  {isAdminView && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200 w-20 shrink-0">User:</span>
                      <span className="truncate">{upload.user?.username || "Unknown"}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-200 w-20 shrink-0">Uploaded:</span>
                    <span className="truncate">{new Date(upload.uploadDate).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-200 w-20 shrink-0">Chart:</span>
                    <span className="truncate">
                      {upload.chartType && upload.chartType !== "-"
                        ? `${upload.chartType} (${upload.selectedAxes?.x} vs ${upload.selectedAxes?.y})`
                        : "Not configured"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-end gap-6">
                <button
                  onClick={() => onDownload(upload.fileName)}
                  className="text-blue-400 hover:text-blue-600 underline font-semibold text-sm"
                  aria-label={`Download ${upload.fileName}`}
                >
                  Download
                </button>
                <button
                  onClick={() => onDelete(upload._id)}
                  className="text-red-400 hover:text-red-600 underline font-semibold text-sm"
                  aria-label={`Delete ${upload.fileName}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
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
