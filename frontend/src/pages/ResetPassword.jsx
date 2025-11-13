import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { backendUrl } = useContext(ShopContext);
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        password,
      });
      if (res.data.success) toast.success(res.data.message);
      else console.log(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-black outline-none"
          placeholder="New Password"
        />
        <button className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-900 transition">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
