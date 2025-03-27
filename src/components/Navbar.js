// Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-900 shadow-lg z-50">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center">
        <span className="text-red-500 text-4xl mr-2">▶</span> YouTube Downloader
      </h1>
    </nav>
  );
};

export default Navbar;