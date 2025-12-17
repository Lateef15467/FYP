import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../../frontend/src/assets/frontend_assets/assets";

const Navbar = ({ settoken }) => {
  return (
    <nav className="w-full px-[4%] py-3 flex items-center justify-between bg-white/80 backdrop-blur-md border-b shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src={assets.logo}
          className="w-32 sm:w-40 object-contain"
          alt="logo"
        />
      </Link>

      {/* Logout Button */}
      <button
        onClick={() => settoken("")}
        className="px-6 py-2 rounded-full bg-black text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-gray-900 transition-all"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
