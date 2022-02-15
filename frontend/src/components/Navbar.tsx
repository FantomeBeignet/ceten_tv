import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-start h-16 px-4 py-3 shadow-sm dark:bg-gray-900/50">
      <Link to="/admin">
        <div className="flex items-center justify-start w-fit">
          <img src="/ceten.png" alt="Le logo du CETEN" height="40" width="40" />
          <span className="px-2 text-lg font-semibold text-gray-200">
            CETEN TV
          </span>
        </div>
      </Link>
    </nav>
  );
}
