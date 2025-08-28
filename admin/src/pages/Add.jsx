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
        { headers: { token } }
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
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full gap-3 items-start "
    >
      <div className="">
        <p className="mb-2">Upload Image</p>
      </div>

      <div className=" flex gap-2">
        <label htmlFor="image1">
          <img
            className="w-20"
            src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
            alt=""
          />
          <input
            onChange={(e) => setImage1(e.target.files[0])}
            type="file"
            id="image1"
            hidden
          />
        </label>
        <label htmlFor="image2">
          <img
            className="w-20"
            src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
            alt=""
          />
          <input
            onChange={(e) => setImage2(e.target.files[0])}
            type="file"
            id="image2"
            hidden
          />
        </label>
        <label htmlFor="image3">
          <img
            className="w-20"
            src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
            alt=""
          />
          <input
            onChange={(e) => setImage3(e.target.files[0])}
            type="file"
            id="image3"
            hidden
          />
        </label>
        <label htmlFor="image4">
          <img
            className="w-20"
            src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
            alt=""
          />
          <input
            onChange={(e) => setImage4(e.target.files[0])}
            type="file"
            id="image4"
            hidden
          />
        </label>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setname(e.target.value)}
          value={name}
          type="text"
          placeholder="type here"
          required
          className="w-full max-w-[500px] px-3 py-2"
          name=""
          id=""
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setdescription(e.target.value)}
          value={description}
          type="text"
          placeholder="Write Content Here"
          required
          className="w-full max-w-[500px] px-3 py-2"
          name=""
          id=""
        />
      </div>
      <div className=" flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div className="">
          <p className="my-2">Product Category</p>
          <select
            onChange={(e) => setcategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="">
          <p className="my-2">Product Subcategory</p>
          <select
            onChange={(e) => setsubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div className="">
          <p className="my-2 ">Product Price</p>
          <input
            onChange={(e) => setprice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="24"
          />
        </div>
      </div>
      <div className="">
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  Sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setbestseller((prev) => !prev)}
          type="checkbox"
          id="bestseller"
          checked={bestseller}
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>

      <button className="w-28 py-3 mt-4 bg-black text-white">Add</button>
    </form>
  );
};

export default Add;
