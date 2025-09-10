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
            Welcome to <i>ShopNow</i>, a trusted destination for quality
            products and a smooth shopping experience. We specialize in offering
            a wide selection of clothing, jacket shirts and so on, all at
            affordable prices. Our mission is to combine style, convenience, and
            reliability, making online shopping simple and enjoyable for
            everyone.
          </p>
          <p className="">
            We take pride in delivering products that meet high standards of
            quality and value. With secure payment options, fast shipping, and
            dedicated customer support, we ensure every order is handled with
            care. At <i>ShopNow</i>, customer satisfaction is not just a
            promise—it’s our priority. Shop with us and discover a better way to
            shop online.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p className="">
            At <i>ShopNow</i>, our mission is to make online shopping simple,
            affordable, and trustworthy. We aim to provide customers with a wide
            range of quality products, combining style, value, and convenience
            in every purchase. By focusing on secure payments, fast delivery,
            and exceptional service, we strive to create a shopping experience
            that you can always rely on.
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
            At <i>ShopNow</i>, we are committed to delivering only the highest
            quality products. Each item is carefully selected and inspected to
            ensure it meets our standards of durability, style, and value—so you
            can shop with confidence every time.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience</b>
          <p className="text-gray-600">
            We believe shopping should be simple and stress-free. With an
            easy-to-use platform, secure payment options, and fast delivery, we
            make it effortless for you to find what you need and have it
            delivered straight to your doorstep.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">
            Your satisfaction is our priority. Our dedicated support team is
            always ready to assist you with any questions, concerns, or
            feedback, ensuring a smooth and enjoyable shopping experience from
            start to finish.
          </p>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default About;
