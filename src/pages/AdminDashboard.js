import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Download, Search, BarChart3 } from "lucide-react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
    const [totalSearches, setTotalSearches] = useState(0);
    const [searchList, setSearchList] = useState([]);
    const [showSearches, setShowSearches] = useState(false);
    const [totalDownloads, setTotalDownloads] = useState(0);
    const [downloadList, setDownloadList] = useState([]);
    const [showDownloads, setShowDownloads] = useState(false);
    const [mp3Count, setMp3Count] = useState(0);
    const [mp4Count, setMp4Count] = useState(0);
    const [topSearchQueries, setTopSearchQueries] = useState([]);
    const [qualityData, setQualityData] = useState({});
    const [deviceCounts, setDeviceCounts] = useState({
        mobile: 0,
        desktop: 0,
        other: 0,
    });
    const [errorLogs, setErrorLogs] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchErrorSearches = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/errors');
            const data = await response.json();
            setErrorLogs(data);
          } catch (error) {
            console.error('Error fetching logs:', error);
          }
    };

    // Fetch format distribution count (MP3, MP4)
    const fetchFormatDistribution = async () => {
        try {
            const response = await axios.get(`${backendUrl}/download/count/formats`);
            const { mp3, mp4 } = response.data;
            setMp3Count(mp3);
            setMp4Count(mp4);
        } catch (error) {
            console.error("❌ Error fetching format distribution:", error.message);
            alert("Error fetching format distribution. Please try again later.");
        }
    };

    // Fetch Quality Distribution (720p, 1080p, etc.)
    const fetchQualityDistribution = async () => {
        try {
            const response = await axios.get(`${backendUrl}/download/count/quality`);
            setQualityData(response.data);
        } catch (error) {
            console.error("❌ Error fetching quality distribution:", error.message);
            alert("Error fetching quality distribution. Please try again later.");
        }
    };

    // Fetch both distributions on component mount
    useEffect(() => {
        fetchFormatDistribution();
        fetchQualityDistribution();
    }, []);

    // Fetch total download count
    const fetchDownloadCount = async () => {
        try {
            const response = await axios.get(`${backendUrl}/download/count`);
            setTotalDownloads(response.data.totalDownloads);
        } catch (error) {
            console.error("❌ Error fetching download count:", error.message);
            alert("Error fetching download count. Please try again later.");
        }
    };

    const fetchAllDownloads = async () => {
        try {
            const response = await axios.get(`${backendUrl}/download/all`);
            setDownloadList(response.data);
            setShowDownloads(true);
        } catch (error) {
            console.error("❌ Error fetching download list:", error);
            alert("Error fetching download list. Please try again later.");
        }
    };

    // Fetch total search count
    const fetchSearchCount = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/search/count`);
            setTotalSearches(response.data.totalSearches);
        } catch (error) {
            console.error("❌ Error fetching search count:", error.message);
            alert("Error fetching search count. Please try again later.");
        }
    };

    const fetchAllSearches = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/search/all`);
            setSearchList(response.data);
            setShowSearches(true);
        } catch (error) {
            console.error("❌ Error fetching search list:", error);
            alert("Error fetching search list. Please try again later.");
        }
    };

    useEffect(() => {
        fetchDownloadCount();
        fetchSearchCount();
        fetchFormatDistribution();
    }, []);

    // Fetch top search queries
    const fetchTopSearchQueries = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/search/top`);
            console.log("✅ Fetched Data:", response.data);
            setTopSearchQueries([...response.data]); // Ensure new reference
        } catch (error) {
            console.error("❌ Error fetching top search queries:", error.message);
        }
    };


    useEffect(() => {
        fetchFormatDistribution();
        fetchTopSearchQueries();
    }, []);


    const handleLogout = () => {
        window.location.href = "/admin"; // Redirect to login page
    };

    const closeSearchModal = () => {
        setShowSearches(false);
        setSearchList([]); // Reset search list
    };

    const closeDownloadModal = () => {
        setShowDownloads(false);
        setDownloadList([]); // Reset download list
    };

    // Pie chart data
    const pieChartData = {
        labels: ['MP3', 'MP4'],
        datasets: [
            {
                data: [mp3Count, mp4Count],
                backgroundColor: ['#FF5733', '#4D79FF'],
                hoverOffset: 4,
            },
        ],
    };

    const pieChartQualityData = {
        labels: Object.keys(qualityData), // ['720p', '1080p']
        datasets: [
            {
                data: Object.values(qualityData), // [10, 5]
                backgroundColor: ["#2ECC71", "#FFC300", "#8A2BE2", "#FF5733", "#4D79FF"],
                hoverOffset: 4,
            },
        ],
    };


    // Simulate fetching client data (replace this with your real data source)
    const mockClientData = [
        { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, // Desktop
        { userAgent: "Mozilla/5.0 (Linux; Android 11)" }, // Mobile
        { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16)" }, // Mobile
        { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" }, // Desktop
        { userAgent: "Mozilla/5.0 (PlayStation 4 7.02)" }, // Other
        { userAgent: "Mozilla/5.0 (iPad; CPU OS 14_0)" }, // Mobile (Tablet)
        { userAgent: "Mozilla/5.0 (CrOS x86_64 13020.82.0)" }, // Desktop (Chromebook)
        { userAgent: "Mozilla/5.0 (SMART-TV; Linux)" }, // Other (Smart TV)
    ];

    useEffect(() => {
        const updatedCounts = { mobile: 0, desktop: 0, other: 0 };

        mockClientData.forEach((client) => {
            const ua = client.userAgent.toLowerCase();

            console.log("User Agent:", ua); // Debugging output

            if (
                /(mobi|android|iphone|ipad|ipod|blackberry|webos|windows phone)/.test(ua) &&
                !/cros/.test(ua) // Exclude ChromeOS (Desktop)
            ) {
                updatedCounts.mobile += 1; // Mobile devices
            } else if (
                /(windows|macintosh|linux|cros)/.test(ua) &&
                !/(mobi|android|iphone|ipad|ipod)/.test(ua) // Ensure true desktop detection
            ) {
                updatedCounts.desktop += 1; // Desktop devices
            } else {
                updatedCounts.other += 1; // Other devices (e.g., PlayStation, Smart TV)
            }
        });

        console.log("Updated Counts:", updatedCounts); // Debugging output
        setDeviceCounts(updatedCounts);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-900 shadow-lg z-50">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center">
                    <span className="text-red-500 text-4xl mr-2">▶</span> YouTube Downloader
                </h1>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>
            <div className="min-h-screen bg-[#0f172a] text-white p-8">
                <header className="mt-16 flex items-center justify-center mb-4">

                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                </header>
                <div className="flex justify-end">
                    <div className="flex justify-end">
                        <button
                            className="mb-4 mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={() => {
                                fetchSearchCount();
                                fetchDownloadCount();
                                fetchFormatDistribution(); // Refresh format distribution data
                                fetchQualityDistribution();
                                fetchTopSearchQueries();

                            }}
                        >
                            Refresh Data
                        </button>
                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Total Downloads */}
                    <Card className="bg-[#1e293b] text-white">
                        <CardContent className="flex flex-col p-6">
                            <div className="flex items-center gap-4">
                                <Download size={40} className="text-red-400" />
                                <div>
                                    <h2 className="text-lg">Total Downloads</h2>
                                    <p className="text-4xl font-bold">{totalDownloads}</p>
                                    <button onClick={fetchAllDownloads} className="text-blue-400">
                                        View all downloads →</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Searches */}
                    <Card className="bg-[#1e293b] text-white">
                        <CardContent className="flex flex-col p-6">
                            <div className="flex items-center gap-4">
                                <Search size={40} className="text-blue-400" />
                                <div>
                                    <h2 className="text-lg">Total Searches</h2>
                                    <p className="text-4xl font-bold">{totalSearches}</p>
                                    <button onClick={fetchAllSearches} className="text-blue-400">
                                        View all searches →</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Format Distribution */}
                    <Card className="bg-[#1e293b] text-white">
                        <CardContent className="flex flex-col p-6">
                            <div className="flex items-center gap-4">
                                <BarChart3 size={40} className="text-yellow-400" />
                                <div>
                                    <h2 className="text-lg">Format Distribution</h2>
                                    <p className="text-1xl font-bold mt-4">🎵 {mp3Count} MP3 &nbsp; 📹 {mp4Count} MP4</p>

                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card className="bg-[#1e293b] text-white">
                        <h2 className="text-2xl font-bold">Download By Format</h2>
                        <CardContent className="flex flex-col p-8">
                            <div className="flex items-center ml-24 gap-4">

                                {/* Pie Chart */}
                                <div className="mt-4">
                                    <Pie data={pieChartData} />
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="bg-[#1e293b] text-white">
                        <h2 className="text-2xl font-bold">Download By Quality</h2>
                        <CardContent className="flex flex-col p-8">
                            <div className="flex items-center ml-24 gap-4">
                                <div className="mt-4">
                                    <Pie data={pieChartQualityData} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1  gap- mt-6">
                    <Card className="bg-[#1e293b] text-white shadow-lg rounded-lg">
                        <CardContent className="flex flex-col p-6">
                            <h2 className="text-xl font-semibold text-center mb-6">Top Search Query</h2>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="text-left p-2">Title</th>
                                        <th className="text-right p-2">Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSearchQueries && topSearchQueries.length > 0 ? (
                                        topSearchQueries.map((query, index) => (
                                            <tr key={index} className="border-b border-gray-700">
                                                <td className="p-2">{query.title}</td>
                                                <td className="text-right p-2">{query.count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center p-4">No search queries available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
                <h2 className="text-2xl font-bold px-4 py-4 text-center mt-4">
                    Client Distribution
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2 px-4 py-4">
                    {/* Mobile Card */}
                    <Card className="bg-[#1e293b] text-white shadow-lg rounded-lg hover:scale-105 transition-transform">
                        <CardContent className="flex flex-col p-6 items-center">
                            <h3 className="text-lg font-semibold">Mobile Users</h3>
                            <p className="text-4xl mt-4">{deviceCounts.mobile}</p>
                        </CardContent>
                    </Card>

                    {/* Desktop Card */}
                    <Card className="bg-[#1e293b] text-white shadow-lg rounded-lg hover:scale-105 transition-transform">
                        <CardContent className="flex flex-col p-6 items-center">
                            <h3 className="text-lg font-semibold">Desktop Users</h3>
                            <p className="text-4xl mt-4">{deviceCounts.desktop}</p>
                        </CardContent>
                    </Card>

                    {/* Other Card */}
                    <Card className="bg-[#1e293b] text-white shadow-lg rounded-lg hover:scale-105 transition-transform">
                        <CardContent className="flex flex-col p-6 items-center">
                            <h3 className="text-lg font-semibold">Other Devices</h3>
                            <p className="text-4xl mt-4">{deviceCounts.other}</p>
                        </CardContent>
                    </Card>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                    {/* Total Downloads */}
                    <Card className="bg-[#1e293b] text-white hover:bg-gray-700 hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <button onClick={fetchAllDownloads} className="w-full h-full text-left">
                            <CardContent className="flex flex-col p-6">
                                <div className="flex items-center gap-4">
                                    <Download size={40} className="text-red-400" />
                                    <div>
                                        <h2 className="text-lg">Manage Downloads</h2>
                                        <p className="text-4xl font-bold">{totalDownloads}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </button>
                    </Card>


                    {/* Total Searches */}
                    <Card className="bg-[#1e293b] text-white">
                        <button onClick={fetchAllSearches}  >

                            <CardContent className="flex flex-col p-6">
                                <div className="flex items-center gap-4">
                                    <Search size={40} className="text-blue-400" />
                                    <div>
                                        <h2 className="text-lg">Manage Searches</h2>
                                        <p className="text-4xl font-bold">{totalSearches}</p>


                                    </div>
                                </div>
                            </CardContent>
                        </button>
                    </Card>

                    {/* Format Distribution */}
                    <Card className="bg-[#1e293b] text-white hover:bg-gray-700 hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <button onClick={fetchErrorSearches} className="w-full h-full text-left">
                            <CardContent className="flex flex-col p-6">
                                <div className="flex items-center gap-4">
                                    <BarChart3 size={40} className="text-yellow-400" />
                                    <div>
                                        <h2 className="text-lg">Error Logs</h2>
                                        <p className="text-4xl font-bold">{errorLogs.length}</p>
                                    </div>
                                </div>

                                {/* Display Dynamic Error Logs */}
                                <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                                    {errorLogs.length === 0 ? (
                                        <p className="text-gray-400">No errors found</p>
                                    ) : (
                                        errorLogs.map((log, index) => (
                                            <div key={index} className="bg-gray-800 p-3 rounded-lg">
                                                <h3 className="text-md font-semibold">{log.title}</h3>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(log.date).toLocaleString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </button>
                    </Card>

                </div>
                {/* Search List Modal with Table */}
                {showSearches && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 mt-12">
                        <div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-4xl overflow-auto max-h-[80vh] relative">

                            {/* Close Button (Red Cross) */}
                            <button
                                className="absolute top-4 right-4 bg-red-600 text-3xl font-bold py-1 px-4 rounded-xl"
                                onClick={closeSearchModal}
                            >
                                X
                            </button>

                            <h2 className="text-2xl mb-4">All Searches</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-[#0f172a] text-white border border-gray-600">
                                    <thead>
                                        <tr className="bg-[#1e293b]">
                                            <th className="py-2 px-4 border-b">#</th>
                                            <th className="py-2 px-4 border-b">Query</th>
                                            <th className="py-2 px-4 border-b">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchList.map((search, index) => (
                                            <tr key={index} className="hover:bg-[#2a3b4d]">
                                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                                <td className="py-2 px-4 border-b">{search.query}</td>
                                                <td className="py-2 px-4 border-b">{new Date(search.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Close Button (Bottom) */}
                            <button
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl"
                                onClick={closeSearchModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}


                {/* Download List Modal with Table */}
                {showDownloads && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 mt-12">
                        <div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-4xl overflow-auto max-h-[80vh] relative">
                            {/* Close Button (Red Cross) */}
                            <button
                                className="absolute top-4 right-4 bg-red-600 text-3xl font-bold py-1 px-4 rounded-xl"
                                onClick={closeDownloadModal}
                            >
                                X
                            </button>
                            <h2 className="text-2xl mb-4">All Downloads</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-[#0f172a] text-white border border-gray-600">
                                    <thead>
                                        <tr className="bg-[#1e293b]">
                                            <th className="py-2 px-4 border-b">#</th>
                                            <th className="py-2 px-4 border-b">Title</th>
                                            <th className="py-2 px-4 border-b">Format</th>
                                            <th className="py-2 px-4 border-b">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {downloadList.map((download, index) => (
                                            <tr key={index} className="hover:bg-[#2a3b4d]">
                                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                                <td className="py-2 px-4 border-b">{download.title}</td>
                                                <td className="py-2 px-4 border-b">{download.format}</td>
                                                <td className="py-2 px-4 border-b">{new Date(download.downloadedAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                            <button
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl"
                                onClick={closeDownloadModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
