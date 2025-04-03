// HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        <h2 className="text-6xl font-bold leading-tight">Download YouTube Videos Instantly!</h2>
        <p className="text-gray-300 mt-4 text-lg max-w-xl mx-auto">
          Fast, secure, and easy to use. Search, preview, and download YouTube videos in just a few clicks.
        </p>
      </div>

      {/* Interactive Buttons */}
      <div className="mt-16 flex flex-wrap gap-8 justify-center">
        {/* <button
          onClick={() => navigate("/playsearch-videos")}
          className="bg-red-500 px-8 py-4 rounded-full text-xl font-semibold hover:bg-red-600 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          🔍 Search and Play Videos
        </button> */}

        <button
          onClick={() => navigate("/download-link")}
          className="bg-blue-500 px-8 py-4 rounded-full text-xl font-semibold hover:bg-blue-600 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          🔗 Download by URL
        </button>

        <button
          onClick={() => navigate("/download-search")}
          className="bg-green-500 px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          📥 Download by Search
        </button>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} YouTube Downloader. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;