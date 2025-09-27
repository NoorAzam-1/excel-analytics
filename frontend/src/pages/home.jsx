import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileUpload, FaHistory, FaChartBar, FaRobot } from 'react-icons/fa';
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl transition duration-300 ease-in-out hover:bg-white/20 text-center cursor-default">
    <div className="text-6xl mb-6 flex justify-center items-center h-20 w-20 mx-auto rounded-full bg-white/10 text-pink-400">
      {icon}
    </div>
    <h3 className="font-bold text-xl sm:text-2xl mb-2 text-white">{title}</h3>
    <p className="text-white/70 leading-relaxed text-sm sm:text-base">{description}</p>
  </div>
);

const Home = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <section className="relative overflow-hidden py-48">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6 md:space-y-10 mb-16 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              Unlock the <span className="text-pink-400">Power</span><br /> of Your Data
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Upload, visualize, and analyze your Excel files with powerful, AI-driven tools — all in one intuitive and beautiful app.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 sm:space-x-8 pt-4">
              <Link
                to="/upload"
                className="bg-pink-500 hover:bg-pink-600 px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base"
              >
                Upload File
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold transition transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className=" flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1732464508481-6d1f170c73a8?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Data analytics illustration"
              className="rounded-3xl shadow-2xl max-w-full h-auto w-full md:w-[500px] object-cover animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 rounded-t-[5rem] shadow-2xl py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-16 tracking-tight text-white">
            Features You'll Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <FeatureCard
              icon={<FaFileUpload />}
              title="Easy Upload"
              description="Quickly upload your Excel files with a drag-and-drop interface."
            />
            <FeatureCard
              icon={<FaHistory />}
              title="Upload History"
              description="Access a complete history of all your past analyses and data."
            />
            <FeatureCard
              icon={<FaChartBar />}
              title="Interactive Charts"
              description="Generate beautiful, interactive charts and visualizations."
            />
            <FeatureCard
              icon={<FaRobot />}
              title="AI-Powered Insights"
              description="Uncover powerful trends and hidden insights with smart AI analysis."
            />
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;