import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../../frontend/src/assets/frontend_assets/assets";

const Navbar = ({ settoken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between font-bold ">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="assets.logo_img1" />
      </Link>
      <button
        onClick={() => {
          settoken("");
        }}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
