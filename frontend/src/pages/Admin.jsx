import React, { useState, useEffect } from "react";
import axios from "../services/api";
import {
  FiUsers,
  FiUploadCloud,
  FiBarChart2,
  FiTrash2,
  FiSlash,
  FiCheck,
  FiInfo,
  FiLoader,
} from "react-icons/fi";
import exportToCSV from "../../utils/exportToCSV";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const USERS_PER_PAGE = 5;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get("/admin/stats"),
          axios.get("/admin/users"),
        ]);
        setStats(statsRes.data);
        const normalized = (usersRes.data || []).map((u) => ({
          ...u,
          email: u.email || u.useremail || "",
        }));
        setUsers(normalized.filter((u) => u.role !== "admin"));
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, users.length]);

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await axios.patch(`/admin/users/${userId}/block`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser?._id === userId) {
        setSelectedUser((s) => ({ ...s, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to toggle user status", err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      user.username?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q);
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-slate-400 p-6">
        <FiLoader className="animate-spin mr-3 text-4xl" />
        <span className="text-xl">Loading admin data...</span>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="bg-slate-900 sm:rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-950/50 border border-slate-800">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2 text-lg max-w-2xl">
              A comprehensive overview and management portal for your platform's users.
            </p>
          </div>
          <button
            onClick={() => exportToCSV(filteredUsers)}
            className="hidden md:flex items-center px-8 lg:px-2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-transform transform hover:scale-105"
          >
            Export to CSV
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || users.length}
            icon={<FiUsers />}
            color="text-indigo-400"
          />
          <StatCard
            title="Total Uploads"
            value={stats?.totalUploads || 0}
            icon={<FiUploadCloud />}
            color="text-emerald-400"
          />
          <StatCard
            title="Most Used Chart"
            value={stats?.mostUsedChart || "N/A"}
            icon={<FiBarChart2 />}
            color="text-amber-400"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">User Management</h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between mb-6">
          <input
            type="text"
            placeholder="🔍 Search by username or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-full md:w-auto px-5 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-colors"
          />
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <button
              onClick={() => exportToCSV(filteredUsers)}
              className="md:hidden flex-1 px-8 lg:px-2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors"
            >
              Export to CSV
            </button>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg border border-slate-700">
          <div className="hidden xl:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${user.role === "admin" ? "bg-fuchsia-600" : "bg-purple-600"
                          } text-white`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${user.status === "active" ? "bg-emerald-600" : "bg-red-600"
                          } text-white`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockToggle(user._id, user.status);
                        }}
                        className={`text-2xl transition-transform transform hover:scale-110 ${user.status === "active"
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-emerald-400 hover:text-emerald-300"
                          }`}
                        title={user.status === "active" ? "Block User" : "Unblock User"}
                      >
                        {user.status === "active" ? <FiSlash /> : <FiCheck />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user._id);
                        }}
                        className="text-red-400 hover:text-red-300 transition-transform transform hover:scale-110 text-2xl"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 xl:hidden">
            {paginatedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${user.status === "active" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                      }`}
                  >
                    {user.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">
                  <strong className="text-slate-500">Email:</strong> {user.email || "N/A"}
                </p>
                <p className="text-slate-400 text-sm mb-2">
                  <strong className="text-slate-500">Role:</strong> {user.role}
                </p>
                <div className="flex justify-end space-x-4 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlockToggle(user._id, user.status);
                    }}
                    className={`text-xl transition-transform transform hover:scale-110 ${user.status === "active"
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-emerald-400 hover:text-emerald-300"
                      }`}
                  >
                    {user.status === "active" ? <FiSlash /> : <FiCheck />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user._id);
                    }}
                    className="text-red-400 hover:text-red-300 transition-transform transform hover:scale-110 text-xl"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-slate-800 rounded-b-2xl">
            <p className="text-slate-400 text-sm">
              Showing <span className="font-bold text-lg">{paginatedUsers.length}</span> of <span className="font-bold text-lg">{filteredUsers.length}</span> users
            </p>
            <div className="space-x-2">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700 rounded-lg text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-700 rounded-lg text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-3xl font-light transition-colors duration-200"
            >
              &times;
            </button>
            <div className="mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">User Details 📝</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <p className="flex justify-between items-center text-lg">
                <strong className="font-semibold text-slate-400">Username:</strong>
                <span className="font-medium text-white">{selectedUser.username}</span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="font-semibold text-slate-400">Email:</strong>
                <span className="font-medium text-white">{selectedUser.email || "N/A"}</span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="font-semibold text-slate-400">Role:</strong>
                <span className="font-medium text-white">{selectedUser.role}</span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="font-semibold text-slate-400">Status:</strong>
                <span className="font-medium text-white">{selectedUser.status}</span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="font-semibold text-slate-400">ID:</strong>
                <span className="font-mono text-slate-500 break-all text-sm">{selectedUser._id}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-950/30 border border-slate-700 flex gap-4 items-center justify-between transition-transform transform hover:-translate-y-1">
    <div>
      <h3 className="text-xl font-semibold text-slate-400">{title}</h3>
      <p className="text-5xl font-bold mt-2 text-white">{value}</p>
    </div>
    <div className={`text-6xl ${color} opacity-80`}>{icon}</div>
  </div>
);
