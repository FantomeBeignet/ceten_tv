import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import SingleImagePage from "./pages/SingleImagePage";
import Carousel from "./components/Carousel";

export default function App() {
  return (
    <BrowserRouter>
      <div id="wrapper" className="min-h-screen bg-gray-800">
        <Routes>
          <Route path="/" element={<Carousel />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/admin/images/:imagename"
            element={<SingleImagePage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
