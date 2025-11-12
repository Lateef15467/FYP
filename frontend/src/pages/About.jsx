import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
import { FaShieldAlt, FaSmile, FaShoppingBag } from "react-icons/fa";

const About = () => {
  return (
    <div className="animate-fadeIn">
      {/* About Us Title */}
      <div className="text-3xl text-center pt-10 border-t border-gray-200 font-semibold">
        <Title text1={"About"} text2={" Us"} />
      </div>

      {/* About Content */}
      <div className="my-16 flex flex-col md:flex-row gap-12 items-center px-6 md:px-12">
        {/* Image with hover animation */}
        <div className="relative group">
          <img
            src={assets.about_img}
            className="w-full md:max-w-[450px] rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
            alt="About ShopNow"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 leading-relaxed">
          <p>
            Welcome to <b className="text-black">ShopNow</b> — your trusted
            destination for high-quality products and a smooth shopping
            experience. From stylish clothing to modern essentials, we combine
            affordability with convenience to make your online shopping journey
            enjoyable and reliable.
          </p>
          <p>
            We take pride in delivering only the best. Every order is handled
            with care, ensuring fast delivery, secure payments, and top-tier
            service. At <i>ShopNow</i>, customer satisfaction isn’t just a goal
            — it’s our promise.
          </p>

          <div>
            <b className="text-gray-800 text-lg">Our Mission</b>
            <p className="mt-2">
              Our mission is simple — to make shopping easy, affordable, and
              trustworthy. We provide access to top-quality products backed by
              exceptional service, so every purchase feels effortless and
              rewarding.
            </p>
          </div>

          {/* Small Call-to-Action */}
          <button className="mt-4 w-fit border border-black px-8 py-3 text-sm font-medium rounded-full hover:bg-black hover:text-white transition-all duration-500 hover:shadow-[0_0_12px_rgba(0,0,0,0.3)]">
            Learn More
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center my-20 px-6">
        <Title text1={"Why"} text2={" Choose Us"} />
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Discover what makes <b>ShopNow</b> stand out — quality, convenience,
          and care that redefine your shopping experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Quality Assurance */}
          <div className="border rounded-2xl px-8 py-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center gap-5">
            <FaShieldAlt className="text-4xl text-black" />
            <b className="text-lg">Quality Assurance</b>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              Every product is handpicked and quality-checked to meet our high
              standards — durability, comfort, and style in every item.
            </p>
          </div>

          {/* Convenience */}
          <div className="border rounded-2xl px-8 py-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center gap-5">
            <FaShoppingBag className="text-4xl text-black" />
            <b className="text-lg">Convenience</b>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              From a seamless interface to fast delivery, we make shopping
              easier than ever — everything you need, delivered to your door.
            </p>
          </div>

          {/* Customer Service */}
          <div className="border rounded-2xl px-8 py-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center gap-5">
            <FaSmile className="text-4xl text-black" />
            <b className="text-lg">Exceptional Support</b>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              Our dedicated support team ensures every question is answered and
              every concern resolved — because your happiness matters most.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetter />
    </div>
  );
};

export default About;
