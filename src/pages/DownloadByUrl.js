import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DownloadByUrl = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [format, setFormat] = useState("mp3"); // New state for format
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quality, setQuality] = useState('');


    // const backendUrl = "http://localhost:5000"; // Ensure your backend is running
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // 🔍 Fetch Video Info by URL
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

    // 📥 Download Video by videoId
    const handleDownload = async (videoId, format, quality) => {
        if (!videoId) {
            setError("Invalid video ID.");
            return;
        }

        if (!format || !quality) {
            setError("Please select both format and quality.");
            return;
        }

        setLoading(true);
        setProgress(0);

        try {
            const response = await axios({
                method: "GET",
                url: `${backendUrl}/download`,
                params: { videoId, format, quality }, // Include both format and quality
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
            link.setAttribute("download", `${video?.title || "video"}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Revoke Blob URL after download to avoid memory leak
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Download Error:", error);
            setError("Error downloading video. Ensure the backend is working.");
        } finally {
            // Reset progress and loading state
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

                {/* 🔎 URL Input */}
                <div className="flex items-center mb-8 w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Enter YouTube URL..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleFetchVideo()} // Trigger search on Enter
                        className="flex-grow p-3 rounded-l-lg bg-gray-800 text-white outline-none"
                    />
                    <button
                        onClick={handleFetchVideo}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-r-lg"
                    >
                        Fetch Video
                    </button>
                </div>

                {/* ❌ Error Message */}
                {error && <p className="text-red-400">{error}</p>}

                {/* 🎥 Video Preview */}
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
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
                            >
                                Select Format
                            </button>
                        </div>
                    </div>
                )}

                {/* Format Selection Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                            <h2 className="text-xl mb-4 text-white">Select Download Format</h2>

                            {/* Format Selection Buttons */}
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={() => setFormat('mp3')}
                                    className={`px-4 py-2 rounded-lg ${format === 'mp3' ? 'bg-red-500' : 'bg-gray-600'} hover:bg-red-600 text-white`}
                                >
                                    MP3
                                </button>
                                <button
                                    onClick={() => setFormat('mp4')}
                                    className={`px-4 py-2 rounded-lg ${format === 'mp4' ? 'bg-red-500' : 'bg-gray-600'} hover:bg-red-600 text-white`}
                                >
                                    MP4
                                </button>
                            </div>

                            {/* Quality Selection Based on Format */}
                            {format === 'mp3' && (
                                <div className="flex gap-4 mb-4">
                                    <button
                                        onClick={() => setQuality('256kbps')}
                                        className={`px-4 py-2 rounded-lg ${quality === '256kbps' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600 text-white`}
                                    >
                                        256 kbps
                                    </button>
                                    <button
                                        onClick={() => setQuality('320kbps')}
                                        className={`px-4 py-2 rounded-lg ${quality === '320kbps' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600 text-white`}
                                    >
                                        320 kbps
                                    </button>
                                </div>
                            )}

                            {format === 'mp4' && (
                                <div className="flex gap-4 mb-4">
                                    <button
                                        onClick={() => setQuality('720p')}
                                        className={`px-4 py-2 rounded-lg ${quality === '720p' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600 text-white`}
                                    >
                                        720p
                                    </button>
                                    <button
                                        onClick={() => setQuality('1080p')}
                                        className={`px-4 py-2 rounded-lg ${quality === '1080p' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600 text-white`}
                                    >
                                        1080p
                                    </button>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleDownload(video.videoId, format, quality);
                                        setIsModalOpen(false);
                                    }}
                                    disabled={!format || !quality}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ℹ️ Info Message */}
                {!loading && !error && !video && (
                    <p className="mt-8">Enter a YouTube URL to fetch and download the video!</p>
                )}
            </div>
        </div>
    );
};

export default DownloadByUrl;