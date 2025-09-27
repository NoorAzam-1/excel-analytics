import React, { useState, useEffect } from "react";

import { FiSave, FiLock } from "react-icons/fi";
import axios from "../services/api";
import { toast } from "react-toastify";
const Settings = () => {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUsername(res.data.name);
        setUseremail(res.data.email);
        setRole(res.data.role);
        setLoading(false);
      } catch {
        setLoading(false);
        toast.error("Failed to fetch user profile");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (role === "admin") {
      const fetchUsers = async () => {
        try {
          const res = await axios.get("/admin/users");
          setUsers(res.data);
        } catch {
          console.error("Failed to fetch users");
          toast.error("Unable to load users.");
        }
      };
      fetchUsers();
    }
  }, [role]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/admin/settings", { username, useremail });
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Profile update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please fill both password fields.");
      return;
    }

    try {
      await axios.put("/auth/change-password", {
        oldpassword: currentPassword,
        newpassword: newPassword,
      });
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to change password. Check your current password."
      );
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.patch(`/admin/role/${userId}`, {
        role: newRole,
      });
      toast.success("User role updated.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      toast.error("Failed to update user role.");
      console.error("Role update failed:", err.response?.data || err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-6xl rounded-3xl p-8 lg:p-12 bg-slate-900 shadow-2xl space-y-12 animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-8 md:space-y-0 md:space-x-12 pb-6 border-b border-slate-800">
          <div className="flex-shrink-0 relative w-36 h-36 rounded-full overflow-hidden shadow-xl border-4 border-indigo-500/50 transform transition-transform hover:scale-105">
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-7xl font-extrabold">
              {useremail ? useremail.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse-slow"></div>
          </div>
          <div className="flex-grow w-full space-y-2 mt-6 md:mt-0">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {username}
            </h3>
            <p className="text-slate-400 text-lg">{useremail}</p>
            <span className="mt-2 inline-block px-4 py-1.5 text-sm font-semibold bg-indigo-600 text-white rounded-full shadow-lg">
              {role || "User"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
            <h4 className="text-2xl font-semibold text-white mb-6">
              Update Details
            </h4>
            <form onSubmit={handleUpdateInfo} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-400 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="useremail"
                  className="block text-sm font-medium text-slate-400 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="useremail"
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 mt-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg font-bold transition-all duration-300 transform hover:-translate-y-1"
              >
                <FiSave className="mr-2" size={20} />
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
            <h4 className="text-2xl font-semibold text-white mb-6">
              Change Password
            </h4>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-slate-400 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-slate-400 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 mt-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg font-bold transition-all duration-300 transform hover:-translate-y-1"
              >
                <FiLock className="mr-2" size={20} />
                Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Admin Role Management Section */}
        {role === "admin" && users.length > 0 && (
          <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 mt-12">
            <h4 className="text-2xl font-semibold text-white mb-6">
              User Role Management
            </h4>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-700 p-4 rounded-xl transition-all duration-200 hover:bg-slate-600/50"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-white">{user.username}</p>
                    <p className="text-sm text-slate-400">{user.useremail}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor={`role-${user._id}`}
                      className="text-sm font-medium text-slate-400"
                    >
                      Role:
                    </label>
                    <select
                      id={`role-${user._id}`}
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="bg-slate-950 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
