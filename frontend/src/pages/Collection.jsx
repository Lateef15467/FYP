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
  const [subCategory, setSubCategory] = useState([]);
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
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showsearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
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
    <div className="flex flex-col sm:flex-row gap-1 pt-10 border-t">
      {/* filter option  */}
      <div className="w-60 lg:sticky top-20 self-start pr-4 mr-4">
        <p
          onClick={() => setshowFilters(!showFilters)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filter
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilters ? "rotate-90" : " "}`}
            alt=""
          />
        </p>

        {/* category filter  */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Category</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2 ">
              <input
                onChange={toggleCategory}
                type="checkbox"
                name=""
                id=""
                className="w-3"
                value={"Men"}
              />
              Men
            </p>
            <p className="flex gap-2 ">
              <input
                onChange={toggleCategory}
                type="checkbox"
                name=""
                id=""
                className="w-3"
                value={"Women"}
              />
              Women
            </p>
            <p className="flex gap-2 ">
              <input
                onChange={toggleCategory}
                type="checkbox"
                name=""
                id=""
                className="w-3"
                value={"Kids"}
              />
              Kids
            </p>
          </div>
        </div>
        {/* subcategory */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 my-5 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Types</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2 ">
              <input
                onChange={togglesubCategory}
                type="checkbox"
                name=""
                id=""
                className="w-3"
                value={"Topwear"}
              />
              Topwear
            </p>
            <p className="flex gap-2 ">
              <input
                onChange={togglesubCategory}
                type="checkbox"
                name=""
                id=""
                className="w-3"
                value={"Bottomwear"}
              />
              bottomwear
            </p>
            <p className="flex gap-2 ">
              <input
                onChange={togglesubCategory}
                type="checkbox"
                name=""
                id=""
                className="w-3"
                value={"Winterwear"}
              />
              winterwear
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"All "} text2={"Collections"}></Title>

          {/* product sort */}
          <select
            onChange={(e) => setsortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* map products */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              image={item.image}
              price={item.price}
            ></ProductItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
