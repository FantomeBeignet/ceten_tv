import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div id="wrapper" className="min-h-screen bg-gray-800">
        <Routes>
          <Route path="/admin" element={<Navbar />} />
        </Routes>
      </div>
    </Router>
  );
}
