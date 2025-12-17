import React, { useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Simulate backend submission
    setTimeout(() => {
      setSubmitted(true);
      setEmail("");
    }, 800);
  };

  return (
    <div className="text-center bg-gradient-to-b from-gray-50 to-white py-14 px-6">
      <p className="text-3xl font-semibold text-gray-800 flex items-center justify-center gap-2">
        <FaEnvelope className="text-[#0a2540] text-3xl" /> Subscribe now & get{" "}
        <span className="text-[#ff7b00]">50% off</span>
      </p>

      <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
        Join our community and be the first to know about{" "}
        <b>exclusive deals, new arrivals,</b> and <b>special offers</b>. Sign up
        today and enjoy <b>50% off</b> your first purchase. Shop smarter with{" "}
        <i>ShopNow</i>!
      </p>

      {!submitted ? (
        <form
          onSubmit={onSubmitHandler}
          className="w-full sm:w-[500px] flex items-center gap-3 mx-auto my-8 border border-gray-300 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 px-3"
        >
          <FaEnvelope className="text-gray-400 text-lg ml-2" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-2 outline-none text-gray-700"
            required
          />
          <a href="mailto:lateef4262@gmail.com">
            <button
              type="submit"
              className="bg-[#0a2540] hover:bg-[#ff7b00] text-white flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-all duration-300"
            >
              <FaPaperPlane className="text-white" />
              Subscribe
            </button>
          </a>
        </form>
      ) : (
        <div className="text-[#0a2540] font-medium text-lg flex flex-col items-center mt-8">
          <FaPaperPlane className="text-[#ff7b00] text-3xl mb-2 animate-bounce" />
          Thank you for subscribing! <br />
          You’ll receive exclusive deals in your inbox soon.
        </div>
      )}
    </div>
  );
};

export default NewsLetter;
