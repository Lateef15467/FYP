import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const preview = (item) => {
    if (!item) return assets.upload_area;
    if (typeof item === "string") return item;
    return URL.createObjectURL(item);
  };

  useEffect(() => {
    const applyProductToState = (p) => {
      setName(p.name || "");
      setDescription(p.description || "");
      setPrice(p.price ?? "");
      setCategory(p.category || "Men");
      setSubCategory(p.subCategory || "Topwear");
      setBestseller(Boolean(p.bestseller));
      setSizes(Array.isArray(p.Sizes) ? p.Sizes : []);

      const fetchedImages = Array.isArray(p.image) ? p.image : [];
      const temp = [null, null, null, null];
      for (let i = 0; i < Math.min(fetchedImages.length, 4); i++) {
        temp[i] = fetchedImages[i];
      }
      setImages(temp);
    };

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        if (res.data?.success) {
          applyProductToState(res.data.product);
          return;
        }
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            const res2 = await axios.post(`${backendUrl}/api/product/single`, {
              productId: id,
            });
            if (res2.data?.success) {
              applyProductToState(res2.data.product);
              return;
            }
          } catch {
            toast.error("Failed to load product");
          }
        } else {
          toast.error("Error loading product");
        }
      }
    };

    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("category", category);
      form.append("subCategory", subCategory);
      form.append("bestseller", bestseller);
      form.append("Sizes", JSON.stringify(Sizes));

      images.forEach((img, idx) => {
        if (img instanceof File) {
          const fieldName = `image${idx + 1}`;
          form.append(fieldName, img);
        }
      });

      const res = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        form,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        toast.success("Product updated");
        navigate("/list");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="w-full max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Edit Product</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
        {images.map((img, i) => (
          <label key={i} className="cursor-pointer">
            <div className="h-32 border-2 border-dashed rounded-xl overflow-hidden bg-gray-100">
              <img
                src={preview(img)}
                alt="preview"
                className="h-full w-full object-cover"
              />
            </div>

            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                const copy = [...images];
                copy[i] = file || null;
                setImages(copy);
              }}
            />
          </label>
        ))}
      </div>

      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="w-full p-3 border rounded-xl mb-4"
      />

      <textarea
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product Description"
        className="w-full p-3 border rounded-xl mb-4 h-32"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full p-3 border rounded-xl mb-4"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option>Men</option>
          <option>Women</option>
          <option>Kids</option>
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option>Topwear</option>
          <option>Bottomwear</option>
          <option>Winterwear</option>
        </select>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-2">Sizes</p>
        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                )
              }
              className={`px-4 py-2 rounded-xl border ${
                Sizes.includes(s) ? "bg-black text-white" : "bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller(!bestseller)}
        />
        <label>Bestseller</label>
      </div>

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
        {loading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default EditProduct;
