import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Settings from "./pages/Setting";
import UploadPage from "./pages/Upload";
import DataAnalysisWrapper from "./components/DataAnalysisWrapper";
import DataAnalysis from "./pages/Analysis";

function App() {
  const role = localStorage.getItem("role");
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      {/* Protected user/admin */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/upload"
          element={
            role === "admin" ? <Navigate to="/dashboard" /> : <UploadPage />
          }
        />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="analysis" element={<DataAnalysis />} />

        <Route path="/visualize/:filename" element={<DataAnalysisWrapper />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
export default App;
