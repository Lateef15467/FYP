import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      <div className="mb-6 flex justify-between items-center">
        <p className="text-2xl font-bold text-gray-800">All Products</p>
        <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow-sm">
          Total: {list.length}
        </span>
      </div>

      {/* Table Header (Desktop Only) */}
      <div
        className="hidden md:grid grid-cols-12 py-3 px-5 bg-gray-100 
    border rounded-xl text-gray-700 font-semibold shadow-sm text-sm"
      >
        <p className="col-span-2">Image</p>
        <p className="col-span-4">Name</p>
        <p className="col-span-2">Category</p>
        <p className="col-span-2">Price</p>
        <p className="col-span-2 text-center">Actions</p>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-4 mt-4">
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-12 items-center gap-4 
          px-4 py-4 border rounded-xl bg-white shadow-sm 
          hover:shadow-lg transition-all duration-200"
          >
            {/* Image */}
            <div className="col-span-3 md:col-span-2 flex justify-center">
              <img
                src={item.image[0]}
                alt=""
                className="w-16 h-16 object-cover rounded-md border shadow-sm"
              />
            </div>

            {/* Name */}
            <p className="col-span-9 md:col-span-4 font-semibold text-gray-800 text-sm md:text-base">
              {item.name}
            </p>

            {/* Category */}
            <p className="hidden md:block col-span-2 text-gray-600 font-medium">
              {item.category}
            </p>

            {/* Price */}
            <p className="hidden md:block col-span-2 font-bold text-gray-900">
              {currency}
              {item.price}
            </p>

            {/* Mobile Price */}
            <p className="col-span-4 md:hidden text-gray-700 font-semibold">
              {currency}
              {item.price}
            </p>

            {/* Actions */}
            <div className="col-span-8 md:col-span-2 flex justify-end md:justify-center gap-4">
              {/* Delete Button */}
              <button
                onClick={() => {
                  setDeleteId(item._id);
                  setShowWarning(true);
                }}
                className="p-2 rounded-lg bg-red-50 text-red-600 
  hover:bg-red-100 transition-all shadow-sm active:scale-90"
              >
                ✕
              </button>

              {/* Edit Button */}
              <button
                onClick={() => navigate(`/product/edit/${item._id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg 
              shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {showWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-xl p-6 shadow-xl animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Delete Product?
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 
          hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await removeProduct(deleteId);
                  setShowWarning(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white 
          hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
