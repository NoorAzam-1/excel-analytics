import React from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa6";

const DashboardCard = ({ to, icon, title, description, color }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      className="flex flex-col items-center text-center p-8 bg-slate-800 rounded-2xl shadow-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-slate-700 hover:scale-[1.02] cursor-pointer"
    >
      <div className={`text-5xl mb-6 ${color}`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <>
      <div className="">
        <h1 className="text-4xl lg:text-4xl font-bold mb-4 text-white  drop-shadow-md">
          UserDashboard
        </h1>
        <p className="text-lg text-gray-400 ">
          Welcome back! Here's a quick overview of your Excel Analytics tools.
        </p>
      </div>
      <main className="flex-1  py-8">
        <div className="mx-auto max-w-7xl">
          {/* Your UserDashboard cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <DashboardCard
              to="/upload"
              icon={<FiUploadCloud />}
              title="Upload File"
              description="Start by uploading your Excel or CSV data."
              color="text-fuchsia-400"
            />
            <DashboardCard
              to="/history"
              icon={<FaHistory />}
              title="View History"
              description="Access your past uploads and analysis reports."
              color="text-indigo-400"
            />
            <DashboardCard
              to="/chart"
              icon={<FaRegChartBar />}
              title="Interactive Charts"
              description="Visualize your data with a variety of chart types."
              color="text-teal-400"
            />
            <DashboardCard
              to="/ai"
              icon={<FaRegChartBar />}
              title="AI-Powered Insights"
              description="Get smart, automated insights and predictions."
              color="text-sky-400"
            />
            {/* Add other cards similarly */}
          </div>
          <div className="mt-12 p-8 bg-gray-800 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Tips</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-400">
              <li>
                For best results, make sure your data columns have clear
                headings.
              </li>
              <li>
                Use the history section to re-run analysis on a previous file.
              </li>
              <li>
                Try our AI Insights feature for a deeper look into your data
                trends.
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
