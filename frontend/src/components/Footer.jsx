import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-m">
        <div className="mb-5 w-32">
          <Link to="/">
            <h1 className="text-4xl">
              Dev
              <span className="text-yellow-700">
                <i>Mart</i>
              </span>
            </h1>
          </Link>
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            libero quae minus4 maxime
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5  ">Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className=" ">
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1 234 234 23423</li>
            <li>lateef@gmail.com </li>
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
