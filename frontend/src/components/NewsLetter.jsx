import React from "react";

const NewsLetter = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div className="text-center ">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 50% off
      </p>
      <p className="text-gray-400 mt-3">
        Join our community and be the first to know about exclusive deals, new
        arrivals, and special offers. Sign up with your email today and enjoy
        50% off your first purchase. Don’t miss out on savings—shop smarter with{" "}
        <i>ShopNow</i>!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4 "
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
