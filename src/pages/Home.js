// HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-between pt-24 px-4">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="text-center animate-fade-in-up max-w-4xl w-full px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Download YouTube Videos Instantly!
        </h2>
        <p className="text-gray-300 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
          Fast, secure, and easy to use. Search, preview, and download YouTube videos in just a few clicks.
        </p>
      </div>

      {/* Interactive Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-6 justify-center w-full max-w-2xl">
        <button
          onClick={() => navigate("/download-link")}
          className="bg-blue-500 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl font-semibold hover:bg-blue-600 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          🔗 Download by URL
        </button>

        <button
          onClick={() => navigate("/download-search")}
          className="bg-green-500 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl font-semibold hover:bg-green-600 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          📥 Download by Search
        </button>
      </div>

      {/* Footer Section */}
      <footer className="mt-12 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} YouTube Downloader. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
