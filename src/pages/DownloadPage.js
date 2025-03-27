import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DownloadPage = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [format, setFormat] = useState("mp3");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [quality, setQuality] = useState("");
  const backendUrl = "http://localhost:5000";

  // 🔍 Search Videos from Backend
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

  // 📥 Handle Download
  const handleDownload = async () => {
    if (!selectedVideo || !format || !quality) return alert("Please select video, format, and quality.");

    setLoading(true);
    setProgress(0);
    setShowModal(false);

    try {
      const response = await axios({
        method: "GET",
        url: `${backendUrl}/download`,
        params: { videoId: selectedVideo.videoId, format, quality },
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedVideo.title}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download Error:", error);
      setError("Failed to download video.");
    } finally {
      setShowModal(false);
      setTimeout(() => {
        setProgress(0);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

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

      <div className="pt-24 flex flex-col items-center p-8">
        <h1 className="text-4xl font-bold mb-8">YouTube Video Downloader</h1>

        <div className="flex items-center mb-8 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search YouTube videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow p-3 rounded-l-lg bg-gray-800 text-white outline-none"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-r-lg transition"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center"
            >
              <img src={video.thumbnail} alt={video.title} className="rounded-lg mb-4 w-full" />
              <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
              <p className="text-sm text-gray-400">{video.channelTitle}</p>

              <button
                onClick={() => {
                  setSelectedVideo(video);
                  setShowModal(true);
                }}
                className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition"
              >
                📥 Select Format
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl mb-4">Select Download Format</h2>

            <div className="flex gap-4 mb-4">
              {["mp3", "mp4"].map((f) => (
                <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2 rounded-lg ${format === f ? 'bg-red-500' : 'bg-gray-600'} hover:bg-red-600 text-white`}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-4 mb-4">
              {format === "mp3" && ["256kbps", "320kbps"].map((q) => (
                <button key={q} onClick={() => setQuality(q)} className={`px-4 py-2 rounded-lg ${quality === q ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600 text-white`}>
                  {q}
                </button>
              ))}
              {format === "mp4" && ["720p", "1080p"].map((q) => (
                <button key={q} onClick={() => setQuality(q)} className={`px-4 py-2 rounded-lg ${quality === q ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600 text-white`}>
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">Cancel</button>
              <button onClick={handleDownload} disabled={!format || !quality} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white">Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
