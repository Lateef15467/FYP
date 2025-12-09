import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setcurrentState] = useState("Login");
  const { token, settoken, setUser, navigate, backendUrl } =
    useContext(ShopContext);

  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false); // ⭐ NEW STATE

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // ⭐ START LOADING

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
          role: "user",
        });

        if (response.data.success) {
          toast.success("OTP sent to your email!");
          localStorage.setItem("signupPassword", password);
          navigate(`/verify-otp?email=${email}`);
        } else {
          toast.error(response.data.message);
        }

        setLoading(false);
        return;
      }

      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);

        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // ⭐ STOP LOADING
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]"
      >
        <div className="text-center mb-2">
          <h1 className="text-3xl font-semibold text-gray-800">
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {currentState === "Login"
              ? "Please sign in to continue shopping"
              : "Join us and start your shopping journey"}
          </p>
        </div>

        {currentState === "Sign Up" && (
          <input
            onChange={(e) => setname(e.target.value)}
            value={name}
            type="text"
            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
            placeholder="Full Name"
            required
          />
        )}

        <input
          onChange={(e) => setemail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
          placeholder="Email Address"
          required
        />

        <div className="w-full relative">
          <input
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-black outline-none pr-12 transition"
            placeholder="Password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-sm text-gray-600 cursor-pointer select-none hover:text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <div className="w-full flex justify-between text-sm text-gray-600 mt-[-4px]">
          <p
            onClick={() => navigate("/forgot-password")}
            className="cursor-pointer hover:text-black transition"
          >
            Forgot Password?
          </p>

          {currentState === "Login" ? (
            <p
              onClick={() => setcurrentState("Sign Up")}
              className="cursor-pointer hover:text-black transition"
            >
              Create Account
            </p>
          ) : (
            <p
              onClick={() => setcurrentState("Login")}
              className="cursor-pointer hover:text-black transition"
            >
              Login Here
            </p>
          )}
        </div>

        {/* ⭐ Button with Loading Spinner */}
        <button
          disabled={loading}
          className={`bg-black text-white font-medium px-8 py-3 mt-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-900"}
          `}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : currentState === "Login" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
