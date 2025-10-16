import React, { useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  // Add multiple hero images in an array
  const heroImages = [
    assets.hero,
    assets.hero1,
    assets.hero2,
    assets.hero3,
    assets.hero4,
    assets.hero5,
    assets.hero6,
    assets.hero7,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div>
      <div className="border-t"></div>
      <section className="relative w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl mt-5 overflow-hidden">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-12 lg:py-20 gap-10">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-snug">
              Discover the Latest{" "}
              <span className="text-indigo-600">Trends</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0">
              Step into fashion that speaks your style. From men’s, women’s, and
              kids’ wear to timeless essentials — ShopNow brings you the perfect
              collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/collection"
                className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
              >
                shop now
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image Slider */}
          <div className="flex-1 flex justify-center relative overflow-hidden ">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="w-full max-h-[500px] object-contain drop-shadow-xl flex-shrink-0 "
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
