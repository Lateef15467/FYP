import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";

const Supplier = () => {
  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://shopnow-phi.vercel.app/api/supplier/add-supplier",
        supplier
      );

      if (response.data.success) {
        toast.success("Supplier added successfully!");
        setSupplier({ name: "", email: "", phone: "", address: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add supplier. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start mt-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add Supplier
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-semibold">
              Supplier Name
            </label>
            <input
              type="text"
              name="name"
              value={supplier.name}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={supplier.email}
              onChange={handleChange}
              placeholder="supplier@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Phone No</label>
            <input
              type="text"
              name="phone"
              value={supplier.phone}
              onChange={handleChange}
              placeholder="0300-0000000"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Address</label>
            <textarea
              name="address"
              value={supplier.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter supplier address"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Save Supplier
          </button>
        </form>
      </div>
    </div>
  );
};

export default Supplier;
