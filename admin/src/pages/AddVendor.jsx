import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const AddVendor = ({ token }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/vendor/add`,
        {
          name,
          email,
          password, // role will be set in backend
        },
        {
          headers: { token },
        }
      );

      if (res.data?.success) {
        toast.success("Vendor added successfully");
        navigate("/users"); // vendor list page
      } else {
        toast.error(res.data?.message || "Failed to add vendor");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="w-full max-w-xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Add Vendor
      </h2>

      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Vendor Name"
        className="w-full p-3 border rounded-xl mb-4"
      />

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full p-3 border rounded-xl mb-4"
      />

      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 border rounded-xl mb-6"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition-all
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-black text-white hover:bg-gray-800 active:scale-95"
          }
        `}
      >
        {loading ? "Adding..." : "Add Vendor"}
      </button>
    </form>
  );
};

export default AddVendor;
