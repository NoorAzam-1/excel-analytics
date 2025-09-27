import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiBarChart2,
  FiClock,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "../services/api";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data?.name);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  const getAccentColor = (currentRole) => {
    return currentRole === "admin" ? "purple-500" : "pink-500";
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-slate-900 shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link
            to="/"
            className={`text-2xl font-extrabold tracking-wider text-${getAccentColor(
              role
            )} `}
          >
            Excel Analytics
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-500 hover:text-white md:hidden"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-4">
          <NavItem
            to="/dashboard"
            icon={<FiBarChart2 />}
            label="Dashboard"
            role={role}
          />
          <NavItem
            to="/history"
            icon={<FiClock />}
            label="History"
            role={role}
          />

          {/* Only visible to users */}
          {role !== "admin" && (
            <>
              <NavItem
                to="/upload"
                icon={<FiUpload />}
                label="Upload File"
                role={role}
              />
              <NavItem
                to="/analysis"
                icon={<FiClock />}
                label="Analysis"
                role={role}
              />
              <NavItem
                to="/profile"
                icon={<FaRegUserCircle />}
                label="Profile"
                role={role}
              />
            </>
          )}

          {/* Only visible to admins */}
          {role === "admin" && (
            <NavItem
              to="/settings"
              icon={<FiSettings />}
              label="Settings"
              role={role}
            />
          )}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors duration-200"
          >
            <FiLogOut className="mr-3 text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-slate-900 shadow-lg p-4 md:hidden sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 focus:outline-none hover:text-white"
          >
            <FiMenu size={24} />
          </button>
          <div className="text-lg font-bold tracking-wide text-white">
            Excel Analytics
          </div>
          <FaRegUserCircle size={24} className="text-slate-500" />
        </header>

        <header className="hidden md:flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950 sticky top-0 z-20">
          <h1 className="text-2xl font-semibold text-white">
            {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
          <div className="flex items-center space-x-4 gap-2">
            Welcome,
            <span className="text-slate-300">{user ? user : "Loading..."}</span>
            <Link to="/profile">
              <FaRegUserCircle size={28} className="text-slate-400" />
            </Link>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-900} `}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

const NavItem = ({ to, icon, label, role }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? `${
              role === "admin" ? "bg-purple-600" : "bg-pink-600"
            } text-white font-semibold shadow-md`
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    {icon && <span className="mr-4 text-xl">{icon}</span>}
    <span>{label}</span>
  </NavLink>
);
