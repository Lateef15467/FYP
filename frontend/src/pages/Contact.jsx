import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"Contact"} text2={" Us"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={assets.contact_img}
          className="w-full md:max-w-[480px]"
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            2344 olding, skardu <br />
            skardu 234 northen area
          </p>
          <p className="text-gray-500">
            Tel: +92 234 234422 <br />
            Email: admin@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">Join Our Team</p>
          <p className="text-gray-500">
            At <b>ShopNow</b>, we welcome fresh talent and passionate learners.
            Whether you’re a student or a recent graduate, this is your chance
            to gain real experience, build skills, and grow with us. Send your
            CV to careers@ShopNow.com and start your journey today!
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default Contact;
