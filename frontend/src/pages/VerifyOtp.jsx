import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  // ⬅️ We must get password saved during signup
  const password = localStorage.getItem("signupPassword");

  /* ------------------- OTP Auto-Focus Handler ------------------- */
  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  /* -------------------- Timer -------------------- */
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  /* -------------------- Verify OTP -------------------- */
  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Enter complete 6-digit OTP");
    }

    try {
      setIsLoading(true);

      // 1️⃣ Verify OTP
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/verify-otp",
        { email, otp: finalOtp }
      );

      if (response.data.success) {
        toast.success("Email Verified Successfully!");

        // 2️⃣ Get saved password
        const savedPassword = localStorage.getItem("signupPassword");

        if (!savedPassword) {
          toast.error("Password missing! Cannot auto-login.");
          return navigate("/login");
        }

        // 3️⃣ Auto Login
        const loginRes = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/user/login",
          {
            email,
            password: savedPassword,
          }
        );

        if (loginRes.data.success) {
          localStorage.setItem("token", loginRes.data.token);
          localStorage.setItem("user", JSON.stringify(loginRes.data.user));

          // 4️⃣ REMOVE TEMP PASSWORD
          localStorage.removeItem("signupPassword");

          return navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------- Resend OTP ------------------------- */
  const resendOtp = async () => {
    if (timer > 0) return;

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/resend-otp",
        { email }
      );

      toast.success("OTP sent again!");
      setTimer(30);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10 animate-fadeIn"
      >
        <h1 className="text-3xl font-semibold text-center mb-3 text-gray-800">
          Verify Your Email
        </h1>

        <p className="text-center mb-6 text-gray-600 text-sm">
          We’ve sent a 6-digit verification code to
          <br />
          <strong className="text-black">{email}</strong>
        </p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black transition-all"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) =>
                e.key === "Backspace" && handleBackspace(e.target.value, index)
              }
            />
          ))}
        </div>

        <button
          disabled={isLoading}
          className={`w-full bg-black text-white py-3 rounded-xl text-lg font-medium transition 
            ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"
            }`}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Didn’t receive the code?
          <span
            className={`ml-2 font-semibold cursor-pointer ${
              timer === 0
                ? "text-black hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={resendOtp}
          >
            {timer === 0 ? "Resend OTP" : `Resend in ${timer}s`}
          </span>
        </p>
      </form>

      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default VerifyOtp;
