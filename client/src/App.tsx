import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import Carousel from "./components/Carousel";

export const LoginContext = createContext({
  loggedIn: false,
  setLoggedIn: (state: boolean) => {},
});

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
      <BrowserRouter>
        <div id="wrapper" className="min-h-screen bg-gray-800">
          <Routes>
            <Route path="/" element={<Carousel />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/:imagename" element={<AdminPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoginContext.Provider>
  );
}
