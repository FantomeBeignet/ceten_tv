import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ImageList from "./components/ImageList";

export default function App() {
  return (
    <Router>
      <div id="wrapper" className="min-h-screen bg-gray-800">
        <Routes>
          <Route
            path="/admin"
            element={
              <>
                <Navbar />
                <ImageList />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
