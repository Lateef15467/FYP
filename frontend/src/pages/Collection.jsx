import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showsearch } = useContext(ShopContext);
  const [showFilters, setshowFilters] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setsubCategory] = useState([]);
  const [sortType, setsortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };
  const togglesubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setsubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setsubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showsearch && search) {
      productsCopy = productsCopy.filter(
        (item) =>
          item?.name && item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showsearch, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t">
      {/* ---------- LEFT SIDE FILTERS ---------- */}
      <div className="w-full sm:w-60 lg:sticky top-24 self-start pr-2 sm:pr-4">
        <p
          onClick={() => setshowFilters(!showFilters)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold"
        >
          Filters
          <img
            src={assets.dropdown_icon}
            className={`h-4 sm:hidden transition-transform duration-300 ${
              showFilters ? "rotate-90" : ""
            }`}
            alt=""
          />
        </p>

        <div
          className={`space-y-5 ${
            showFilters ? "block" : "hidden"
          } sm:block transition-all`}
        >
          {/* CATEGORY */}
          <div className="border rounded-xl shadow-sm border-gray-200 px-5 py-4 bg-white">
            <p className="mb-3 text-sm font-semibold text-gray-800">Category</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={toggleCategory}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  value="Men"
                />
                Men
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={toggleCategory}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  value="Women"
                />
                Women
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={toggleCategory}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  value="Kids"
                />
                Kids
              </label>
            </div>
          </div>

          {/* SUB CATEGORY */}
          <div className="border rounded-xl shadow-sm border-gray-200 px-5 py-4 bg-white">
            <p className="mb-3 text-sm font-semibold text-gray-800">Types</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={togglesubCategory}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  value="Topwear"
                />
                Topwear
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={togglesubCategory}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  value="Bottomwear"
                />
                Bottomwear
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  onChange={togglesubCategory}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  value="Winterwear"
                />
                Winterwear
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- RIGHT SIDE COLLECTIONS ---------- */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Title text1="All " text2="Collections" />

          <select
            onChange={(e) => setsortType(e.target.value)}
            className="border border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 bg-white hover:border-gray-400 transition-all"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              image={item.image}
              price={item.price}
              stock={item.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
