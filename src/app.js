import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DownloadPage from './pages/DownloadPage';
import DownloadByUrl from "./pages/DownloadByUrl";
// import VideoPlayPage from './pages/VideoPlayPage';
import Login from '../src/pages/AdminLogin';
import AdminDashboard from "./pages/AdminDashboard";
function app() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download-search" element={<DownloadPage />} />
        <Route path="/download-link" element={<DownloadByUrl />} />
        {/* <Route path="/playsearch-videos" element={<VideoPlayPage/>} /> */}
        <Route path="/admin" element={<Login/>}/>
        <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default app;
