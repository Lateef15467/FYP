import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setvisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ⭐ Use user from context so Navbar re-renders on login/register
  const {
    setshowsearch,
    getCartCount,
    navigate,
    token,
    settoken,
    setCartItems,
    user,
    setUser,
  } = useContext(ShopContext);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    settoken("");
    setUser(null);
    setCartItems({});
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium sticky top-0 bg-white z-50">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          className="w-36 cursor-pointer"
          alt="Logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        {[
          { path: "/", label: "Home" },
          { path: "/collection", label: "Collection" },
          { path: "/about", label: "About" },
          { path: "/contact", label: "Contact" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center group"
          >
            <p className="transition-all duration-300 group-hover:text-black group-hover:scale-105">
              {item.label}
            </p>
            <span className="absolute bottom-[-3px] w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
        ))}

        {/* ⭐Admin Panel moved here */}
        {(user?.role  === "admin" || user?.role === "vendor") && (
          <li>
            <a
              href="http://localhost:5174/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col items-center group"
            >
              <p className="transition-all duration-300 group-hover:text-black group-hover:scale-105">
               Dashboard
              </p>
              <span className="absolute bottom-[-3px] w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        )}
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          className="w-5 cursor-pointer hover:scale-110 transition-transform duration-300"
          onClick={() => {
            setshowsearch(true);
            navigate("/collection");
          }}
          src={assets.search_icon}
          alt="Search"
        />

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <img
            onClick={() => {
              // ⭐ If logged in, toggle dropdown. If not, go to login page.
              if (token) {
                setMenuOpen(!menuOpen);
              } else {
                navigate("/login");
              }
            }}
            src={assets.profile_icon}
            className="w-5 cursor-pointer hover:scale-110 transition-transform duration-300"
            alt="Profile"
          />

          {token && menuOpen && (
            <div className="absolute right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                <p
                  className="cursor-pointer hover:text-black transition-all duration-300"
                  onClick={() => handleNavigate("/profile")}
                >
                  My Profile
                </p>
                <p
                  onClick={() => handleNavigate("/orders")}
                  className="cursor-pointer hover:text-black transition-all duration-300"
                >
                  Orders
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer hover:text-black transition-all duration-300"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative hover:scale-110 transition-transform duration-300"
        >
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setvisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden hover:scale-110 transition-transform duration-300"
          alt="Menu"
        />
      </div>

      {/* Sidebar Menu (Mobile) */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-500 
          ${visible ? "w-full" : "w-0"}`
        }>
        <div className="flex flex-col text-gray-600 h-full">
          <div
            className="flex items-center gap-4 p-3 cursor-pointer border-b hover:bg-gray-100 transition-all duration-300"
            onClick={() => setvisible(false)}
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>

          {[
            { path: "/", label: "Home" },
            { path: "/collection", label: "Collection" },
            { path: "/about", label: "About" },
            { path: "/contact", label: "Contact" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setvisible(false)}
              className="py-3 pl-6 border-b hover:bg-gray-100 hover:text-black transition-all duration-300"
            >
              {item.label}
            </NavLink>
          ))}

          {/* Admin Panel in mobile menu */}
          {user?.role === "admin" && (
            <a
              href="https://shopnow-admins.vercel.app/login"
              target="_blank"
              className="py-3 pl-6 border-b hover:bg-gray-100 hover:text-black transition-all duration-300"
            >
              Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
