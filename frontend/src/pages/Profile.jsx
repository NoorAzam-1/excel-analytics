import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { FiSave, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
const Profile = () => {
  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUserName((u) => res.data.name || u);
        setUserEmail((e) => res.data.email || e);
        setRole(res.data.role || "");
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load profile.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put("/auth/me", {
        username: username,
        useremail: useremail,
      });

      setUserName(res.data.username || username);
      setUserEmail(res.data.useremail || useremail);

      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill both password fields.");
      return;
    }

    try {
      await axios.put("/auth/change-password", {
        oldpassword: oldPassword,
        newpassword: newPassword,
      });

      toast.success("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to change password. Check your current password."
      );
    }
  };
  if (loading) return <div className="text-white p-6">Loading profile...</div>;

  return (
    <div className="w-full">
      <div className="w-full space-y-4 md:space-y-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Profile Settings
        </h1>
        <div className="bg-slate-900 p-4 md:p-8 rounded-3xl shadow-2xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0 relative w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-pink-500">
              <div className="w-full h-full flex items-center justify-center bg-pink-700 text-gray-400 text-6xl font-extrabold">
                {useremail ? useremail.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-pulse-slow"></div>
            </div>

            <div className="flex-grow w-full space-y-8 mt-6 md:mt-0">
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {username}
                </h3>
                <p className="text-gray-400">{useremail}</p>
                <span className="mt-2 inline-block px-4 py-1 text-sm font-semibold bg-pink-600 text-white rounded-full">
                  {role || "User"}
                </span>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-gray-600">
                <h4 className="text-xl font-semibold text-white mb-4">
                  Update Details
                </h4>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="userName"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white  focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="userEmail"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="userEmail"
                      value={useremail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white  focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 mt-4 text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-lg font-bold transition-all duration-200"
                  >
                    <FiSave className="mr-2" size={20} />
                    Save Changes
                  </button>
                </form>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-gray-700">
                <h4 className="text-xl font-semibold text-white mb-4">
                  Change Password
                </h4>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label
                      htmlFor="oldPassword"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 mt-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg font-bold transition-all duration-200"
                  >
                    <FiLock className="mr-2" size={20} />
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
