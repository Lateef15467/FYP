import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-40 text-m">
        <div
          className="mb-5 w-32"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Link to="/">
            <img
              src={assets.logo}
              className="w-36 py-5"
              alt="assets.logo_img1"
            />
          </Link>
          <p className="w-full md:w-40 text-gray-600">
            This is a fully functional an e-commerce website application which
            is built in mern stack.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5  ">Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/collection" onClick={() => window.scrollTo(0, 0)}>
                Collection
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className=" ">
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+92 33 234 2423</li>
            <li>lateef@gmail.com </li>
            <li>+92 33 234 284</li>
            <li>Furman@gmail.com </li>
          </ul>
        </div>
      </div>
      <div className="">
        <hr className="" />
        <p className="py-5 text-sm text-center ">
          Copyright 2025@ ShopNow.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
