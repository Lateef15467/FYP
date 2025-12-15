import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="animate-fadeIn bg-gradient-to-b from-gray-50 to-white">
      {/* Page Title */}
      <div className="text-center text-4xl font-semibold pt-10 border-t border-gray-200">
        <Title text1={"Contact"} text2={" Us"} />
        <p className="text-gray-500 text-sm mt-2">
          We’re here to help — reach out anytime!
        </p>
      </div>

      {/* Contact Section */}
      <div className="my-16 flex flex-col md:flex-row justify-center items-center gap-12 px-6">
        {/* Image */}
        <div className="relative group">
          <img
            src={assets.contact_img}
            className="w-full md:max-w-[480px] rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
            alt="Contact"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity duration-500"></div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center items-start gap-6 max-w-lg bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500">
          <h2 className="font-semibold text-3xl text-gray-700 flex items-center gap-3">
            <FaMapMarkerAlt className="text-[#0B132B]" /> Our Store
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Near Govt. Boys Degree College Skardu, Main Bazaar, Skardu
          </p>

          <div className="flex flex-col gap-2 text-gray-600">
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#0B132B]" />{" "}
              <span className="font-medium">+92 234 234422</span>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-[#0B132B]" />{" "}
              <a
                href="mailto:admin@gmail.com"
                className="hover:text-[#FCA311] transition-colors duration-300"
              >
                admin@gmail.com
              </a>
            </p>
          </div>

          {/* Join Our Team Section */}
          <div className="pt-4 border-t border-gray-200 w-full">
            <h3 className="font-semibold text-2xl text-gray-700 flex items-center gap-3 mb-2">
              <FaUsers className="text-[#0B132B]" /> Join Our Team
            </h3>
            <p className="text-gray-600 leading-relaxed">
              At <b>ShopNow</b>, we welcome fresh talent and passionate
              learners. Whether you’re a student or a recent graduate, this is
              your chance to gain real experience, build skills, and grow with
              us.
            </p>

            <p className="mt-3 text-gray-600">
              Send your CV to{" "}
              <a
                href="mailto:careers@ShopNow.com"
                className="text-[#FCA311] hover:underline"
              >
                careers@ShopNow.com
              </a>{" "}
              and start your journey today!
            </p>

            <button className="flex items-center gap-2 border border-[#0B132B] text-[#0B132B] px-8 py-3 mt-5 text-sm font-medium rounded-full hover:bg-[#0B132B] hover:text-[#FCA311] transition-all duration-500 hover:shadow-[0_0_15px_rgba(252,163,17,0.4)]">
              <FaPaperPlane /> Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="px-6 mb-20">
        <p className="text-center text-2xl font-semibold text-gray-700 mb-4">
          Find Us On Map
        </p>
        <div className="flex justify-center">
          <iframe
            title="Govt. Boys Degree College Skardu Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.981496259256!2d75.63135797458883!3d35.30237425218427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38f54a23a1f6b04b%3A0x4b56dfb5931b7c74!2sGovt.%20Boys%20Degree%20College%20Skardu!5e0!3m2!1sen!2s!4v1731425000000!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{
              border: 0,
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-200">
        <NewsLetter />
      </div>
    </div>
  );
};

export default Contact;
