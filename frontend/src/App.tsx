import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageListPage from "./pages/ImageListPage";
import SingleImagePage from "./pages/SingleImagePage";
import Carousel from "./components/Carousel";

export default function App() {
  return (
    <Router>
      <div id="wrapper" className="min-h-screen bg-gray-800">
        <Routes>
          <Route path="/" element={<Carousel />} />

          <Route path="/admin" element={<ImageListPage />} />
          <Route
            path="/admin/images/:imagename"
            element={<SingleImagePage />}
          />
        </Routes>
      </div>
    </Router>
  );
}
