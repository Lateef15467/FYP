import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { search, setsearch, showsearch, setshowsearch } =
    useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate(); // 👈 added for redirecting
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    // Show search bar on home (/) or collection page
    if (
      location.pathname.includes("/collection") ||
      location.pathname === "/"
    ) {
      setvisible(true);
    } else {
      setvisible(false);
    }
  }, [location]);

  // 👇 When typing on home page, redirect automatically to /collection
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setsearch(value);

    if (location.pathname === "/" && value.trim() !== "") {
      navigate("/collection");
      setshowsearch(true); // make sure it stays visible
    }
  };

  return showsearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-inherit text-sm"
        />
        <img src={assets.search_icon} className="w-4" alt="search" />
      </div>

      <img
        src={assets.cross_icon}
        className="inline w-3 cursor-pointer"
        alt="close"
        onClick={() => setshowsearch(false)}
      />
    </div>
  ) : null;
};

export default SearchBar;
