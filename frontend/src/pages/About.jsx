import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"About"} text2={" Us"}></Title>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
            veniam autem sed minima dolorum odio expedita harum quas, atque
            delectus obcaecati eveniet fugit, tenetur maxime minus itaque saepe
            delectus obcaecati eveniet fugit, tenetur maxime minus itaque saepe
            hic repellat.
          </p>
          <p className="">
            Lorem, ipsum dolor sit amet consecteturab quasi numquam praesentium
            veritatis doloremque eligendi asperiores voluptatem, sit sint, sunt
            minus. Iusto aspernatur corrupti accusamus laborum quia.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p className="">
            Lorem, ipsum dolor sit amet consecteturab quasi numquam praesentium
            veritatis doloremque eligendi asperiores voluptatem, sit sint, sunt
            minus. Iusto aspernatur corrupti accusamus laborum quia.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"Why"} text2={" Choose Us"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro
            iusto similique eos, rerum laboriosam ducimus in explicabo? Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Porro iusto
            similique eos, rerum laboriosam ducimus in explicabo?
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro
            iusto similique eos, rerum laboriosam ducimus in explicabo? Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Porro iusto
            similique eos, rerum laboriosam ducimus in explicabo?
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro
            iusto similique eos, rerum laboriosam ducimus in explicabo? Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Porro iusto
            similique eos, rerum laboriosam ducimus in explicabo?
          </p>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default About;
