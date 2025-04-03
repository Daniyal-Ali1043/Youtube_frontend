import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DownloadPage = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
  const handleDownload = async (video) => {
    const quality = "720p";
    setLoading(true);
    setProgress(0);
    try {
      console.log("📥 Downloading:", video.title, selectedFormat, quality);
      const response = await axios({
        method: "GET",
        url: `${backendUrl}/download`,
        params: { videoId: video.videoId, format: selectedFormat, quality },
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          } else {
            setProgress(-1); // Indeterminate state
          }
        },
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
      setTimeout(() => {
        setProgress(100);
        setLoading(false);
      }, 500);
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
              <span className="text-white text-xl font-semibold animate-pulse">Loading...{progress}%</span>
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
            <div key={video.videoId} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center">
              <img src={video.thumbnail} alt={video.title} className="rounded-lg mb-4 w-full" />
              <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
              <p className="text-sm text-gray-400">{video.channelTitle}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setSelectedFormat("mp3")} className={`px-4 py-4 rounded transition ${selectedFormat === "mp3" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"}`}>MP3</button>
                <button onClick={() => setSelectedFormat("mp4")} className={`px-4 py-4 rounded transition ${selectedFormat === "mp4" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"}`}>MP4</button>
                <button onClick={() => handleDownload(video)} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition">📥 Download</button>
                <button onClick={() => { setPlayingVideo(video.videoId); setShowPlayModal(true); }} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition">▶ Play</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPlayModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded" onClick={() => setShowPlayModal(false)}>X</button>
            <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${playingVideo}`} frameBorder="0" allowFullScreen className="rounded-lg"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
