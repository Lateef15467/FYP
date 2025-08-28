import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ settoken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between font-bold ">
      <Link to="/">
        <h1 className="text-4xl">
          Dev
          <span className="text-yellow-700 ">
            <i>Mart</i>
          </span>
        </h1>
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
