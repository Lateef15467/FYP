import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-40 text-m">
        <div className="mb-5 w-32">
          <Link to="/">
            <h1 className="text-4xl mb-8">
              Dev
              <span className="text-yellow-700">
                <i>Mart</i>
              </span>
            </h1>
          </Link>
          <p className="w-full md:w-40 text-gray-600">
            This is a fully functional an e-commerce website application which
            is built in mern stack.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5  ">Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/collection"}>
              <li>Collection</li>
            </Link>
            <Link to={"/contact"}>
              <li>Contact</li>
            </Link>
            <Link to={"/about"}>
              <li>About</li>
            </Link>
          </ul>
        </div>
        <div className=" ">
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1 234 234 23423</li>
            <li>lateef@gmail.com </li>
            <li>+92 334 234 234</li>
            <li>admin@gmail.com </li>
          </ul>
        </div>
      </div>
      <div className="">
        <hr className="" />
        <p className="py-5 text-sm text-center ">
          Copyright 2025@ DevMart.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
