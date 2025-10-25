import React, { useEffect, useState } from "react";
import UploadHistoryTable from "../components/UploadHistoryTable";
import axios from "../services/api";

const AdminHistory = () => {
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllUploads = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/history/all");
      setUploads(res.data);
      setFilteredUploads(res.data);
      setError(null);
    } catch {
      setError("Failed to load uploads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUploads();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUploads(uploads);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredUploads(
      uploads.filter(
        (upload) =>
          upload.fileName.toLowerCase().includes(term) ||
          upload.user?.username.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, uploads]);

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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;

    try {
      await axios.delete(`/history/${id}`);
      setUploads((prev) => prev.filter((u) => u._id !== id));
      setFilteredUploads((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete upload");
    }
  };

  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">
        Admin Upload History Dashboard
      </h1>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by filename or user"
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search uploads"
        />
      </div>

      <UploadHistoryTable
        uploads={filteredUploads}
        onDownload={handleDownload}
        onDelete={handleDelete}
        isAdminView={true}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AdminHistory;
