import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const PlayPage = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "http://localhost:5000"; // Adjust as needed

  // 🔍 Search Videos from Backend
  const handleSearch = async () => {
    if (!query) return alert("Please enter a search term!");

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/search`, {
        params: { query },
      });
      setVideos(response.data);
      setError("");
    } catch (err) {
      console.error("Search Error:", err);
      setError("Failed to fetch videos. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // ▶️ Play Selected Video
  const handlePlay = (videoId) => {
    setSelectedVideo(videoId);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

      <div className="pt-24 px-4"> {/* Ensure content starts after navbar */}
        {/* Search Input */}
        <div className="flex items-center mt-8 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search YouTube videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter
            className="flex-grow p-3 rounded-l-lg bg-gray-800 text-white outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-r-lg transition"
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
            <div className="relative">
              <div className="w-32 h-32 border-8 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-semibold animate-pulse">Loading...</span>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Player */}
        {selectedVideo && (
          <div className="mt-8 flex justify-center">
            <iframe
              width="800"
              height="450"
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Video Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="rounded-lg mb-4 w-full cursor-pointer"
                onClick={() => handlePlay(video.videoId)}
              />
              <h2 className="text-lg font-semibold mb-2 text-center">
                {video.title}
              </h2>
              <p className="text-sm text-gray-400">{video.channelTitle}</p>

              <button
                onClick={() => handlePlay(video.videoId)}
                className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                ▶ Play Video
              </button>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {!loading && !error && videos.length === 0 && (
          <p className="mt-8 text-center">Search and play YouTube videos!</p>
        )}
      </div>
    </div>
  );
};

export default PlayPage;