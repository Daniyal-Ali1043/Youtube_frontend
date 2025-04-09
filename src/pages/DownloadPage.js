import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DownloadPage = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSearch = async () => {
    if (!query) return alert("Please enter a search term!");
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/search`, { params: { query } });
      setVideos(response.data);
      setError("");
    } catch (err) {
      console.error("Search Error:", err);
      setError("Failed to fetch videos. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (video) => {
    const quality = "720p";
    setLoading(true);
    try {
      console.log("📥 Downloading:", video.title, selectedFormat, quality);

      const response = await axios({
        method: "GET",
        url: `${backendUrl}/download`,
        params: { videoId: video.videoId, format: selectedFormat, quality },
        responseType: "blob",
      });

      console.log("✅ Download Complete!");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${video.title}.${selectedFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Download Error:", error);
      setError("Failed to download video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
          <div className="relative">
            <div className="w-20 h-20 sm:w-32 sm:h-32 border-8 border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl font-semibold animate-pulse">Loading...</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 px-4 sm:px-6 flex flex-col items-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-center">YouTube Video Downloader</h1>
        <div className="flex flex-col sm:flex-row items-stretch w-full max-w-xl gap-2 mb-8">
          <input
            type="text"
            placeholder="Search YouTube videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow p-3 rounded-lg sm:rounded-l-lg bg-gray-800 text-white outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg sm:rounded-r-lg transition w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-2">
          {videos.map((video) => (
            <div key={video.videoId} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
              <img src={video.thumbnail} alt={video.title} className="rounded-lg mb-4 w-full h-auto object-cover" />
              <h2 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2">{video.title}</h2>
              <p className="text-sm text-gray-400 truncate">{video.channelTitle}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                <button
                  onClick={() => setSelectedFormat("mp3")}
                  className={`px-3 py-2 rounded text-sm ${selectedFormat === "mp3" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"}`}
                >
                  MP3
                </button>
                <button
                  onClick={() => setSelectedFormat("mp4")}
                  className={`px-3 py-2 rounded text-sm ${selectedFormat === "mp4" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"}`}
                >
                  MP4
                </button>
                <button
                  onClick={() => handleDownload(video)}
                  className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded text-sm"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => {
                    setPlayingVideo(video.videoId);
                    setShowPlayModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-sm"
                >
                  ▶ Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPlayModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              onClick={() => setShowPlayModal(false)}
            >
              X
            </button>
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${playingVideo}`}
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
