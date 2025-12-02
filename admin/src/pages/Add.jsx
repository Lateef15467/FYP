import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("Men");
  const [subCategory, setsubCategory] = useState("Topwear");
  const [bestseller, setbestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("Sizes", JSON.stringify(Sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setname("");
        setdescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setprice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-gray-100 animate-fadeIn flex flex-col gap-7"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
          Add New Product
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below to list a new product.
        </p>
      </div>

      {/* Upload Section */}
      <div>
        <p className="mb-3 font-semibold text-gray-700">Upload Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[image1, image2, image3, image4].map((img, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              className="group cursor-pointer"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 h-28 flex items-center justify-center shadow-sm group-hover:border-black transition relative">
                <img
                  className="w-full h-full object-cover rounded-xl"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt="upload"
                />
                {!img && (
                  <span className="absolute text-xs text-gray-600 group-hover:text-black">
                    Click to Upload
                  </span>
                )}
              </div>

              <input
                type="file"
                hidden
                id={`image${index + 1}`}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (index === 0) setImage1(file);
                  if (index === 1) setImage2(file);
                  if (index === 2) setImage3(file);
                  if (index === 3) setImage4(file);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Enter product name"
          className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black outline-none shadow-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-medium text-gray-700">Product Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Write a detailed description..."
          className="w-full mt-1 px-4 py-3 h-32 rounded-xl border border-gray-300 bg-gray-50 outline-none shadow-sm focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Category / Subcategory / Price */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className="font-medium text-gray-700">Category</label>
          <select
            onChange={(e) => setcategory(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 shadow-sm focus:ring-2 focus:ring-black"
          >
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-gray-700">Subcategory</label>
          <select
            onChange={(e) => setsubCategory(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 shadow-sm focus:ring-2 focus:ring-black"
          >
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setprice(e.target.value)}
            placeholder="0"
            className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 shadow-sm focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-3 font-semibold text-gray-700">Available Sizes</p>
        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((s) => s !== size)
                    : [...prev, size]
                )
              }
              className={`px-5 py-2 rounded-xl border shadow-sm transition ${
                Sizes.includes(size)
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex items-center gap-3 mt-1">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setbestseller(!bestseller)}
          className="w-5 h-5 cursor-pointer accent-black"
        />
        <label htmlFor="bestseller" className="cursor-pointer font-medium">
          Mark as Bestseller
        </label>
      </div>

      {/* Submit */}
      <button className="mt-6 bg-black text-white py-3 rounded-xl shadow-md hover:bg-gray-900 transition text-lg font-semibold">
        Add Product
      </button>
    </form>
  );
};

export default Add;
