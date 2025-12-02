import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-xl font-semibold text-gray-700">All Products</p>
        <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
          Total: {list.length}
        </span>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] py-3 px-4 bg-gray-100 border rounded-lg text-gray-700 font-semibold text-sm shadow-sm">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Price</p>
        <p className="text-center">Action</p>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-3 mt-3">
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 px-4 py-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* Image */}
            <img
              src={item.image[0]}
              alt=""
              className="w-14 h-14 object-cover rounded-md border"
            />

            {/* Name */}
            <p className="font-medium text-gray-800">{item.name}</p>

            {/* Category */}
            <p className="text-gray-600">{item.category}</p>

            {/* Price */}
            <p className="font-semibold text-gray-900">
              {currency}
              {item.price}
            </p>

            {/* Delete Button */}
            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-600 font-bold hover:bg-red-100 rounded-lg p-2 text-center transition-all"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
