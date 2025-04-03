import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DownloadByUrl = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [playingVideo, setPlayingVideo] = useState(null);
    const [showPlayModal, setShowPlayModal] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState("mp4");
    

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Fetch Video Info by URL
    const handleFetchVideo = async () => {
        if (!searchQuery) {
            alert("Please enter a YouTube URL!");
            return;
        }

        setLoading(true);
        setError("");
        setProgress(0);

        try {
            const response = await axios.get(`${backendUrl}/preview`, {
                params: { url: searchQuery },
            });

            if (response.status !== 200 || !response.data) {
                throw new Error("Invalid response from the backend.");
            }

            setVideo(response.data);
        } catch (error) {
            console.error("Preview Fetch Error:", error);
            setError("Error fetching video info. Ensure the URL is correct.");
        } finally {
            setLoading(false);
        }
    };

    // Download Video by videoId
    const handleDownload = async (videoId, format) => {
        if (!videoId) {
            setError("Invalid video ID.");
            return;
        }

        // if (!format) {
        //     setError("Please select format");
        //     return;
        // }

        setLoading(true);
        setProgress(0);

        try {
            const response = await axios({
                method: "GET",
                url: `${backendUrl}/download`,
                params: { videoId, format: selectedFormat},
                responseType: "blob",
                onDownloadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percentCompleted);
                },
            });

            if (response.status !== 200) {
                throw new Error(`Download failed with status ${response.status}`);
            }

            if (!response.data) {
                throw new Error("Empty download response.");
            }

            // Create blob and download link
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.setAttribute("download", `${video?.title || "video"}.${selectedFormat}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Revoke Blob URL after download to avoid memory leak
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Download Error:", error);
            setError("Error downloading video. Ensure the backend is working.");
        } finally {
            setTimeout(() => {
                setProgress(0);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="relative bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
            <Navbar />

            {/* Loader Overlay */}
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

                {/* URL Input */}
                <div className="flex items-center mb-8 w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Enter YouTube URL..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleFetchVideo()}
                        className="flex-grow p-3 rounded-l-lg bg-gray-800 text-white outline-none"
                    />
                    <button
                        onClick={handleFetchVideo}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-r-lg"
                    >
                        Fetch Video
                    </button>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-400">{error}</p>}

                {/* Video Preview */}
                {video && (
                    <div className="bg-gray-800 p-4 rounded-lg max-w-lg">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full rounded-lg"
                        />
                        <div className="mt-4 flex justify-center">
                            <h2 className="mt-4 font-semibold">{video.title}</h2>
                        </div>

                        {/* Format Selection Buttons */}
                        <div className="flex gap-2 mt-4 ml-12">
                <button onClick={() => setSelectedFormat("mp3")} className={`px-4 py-4 rounded transition ${selectedFormat === "mp3" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"}`}>MP3</button>
                <button onClick={() => setSelectedFormat("mp4")} className={`px-4 py-4 rounded transition ${selectedFormat === "mp4" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-700"}`}>MP4</button>
                <button onClick={() => handleDownload(video.videoId)} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition">📥 Download</button>
                <button onClick={() => { setPlayingVideo(video.videoId); setShowPlayModal(true); }} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition">▶ Play</button>
              </div>
                    </div>
                )}

                {/* Video Modal */}
                {showPlayModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded" onClick={() => setShowPlayModal(false)}>X</button>
            <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${playingVideo}`} frameBorder="0" allowFullScreen className="rounded-lg"></iframe>
          </div>
        </div>
      )}
            </div>
        </div>
    );
};

export default DownloadByUrl;
