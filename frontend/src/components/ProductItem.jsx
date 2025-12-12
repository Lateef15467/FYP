import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, stock }) => {
  const { currency } = useContext(ShopContext);

  const isOutOfStock = stock <= 0;

  return (
    <div
      className={`text-gray-700 relative ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <Link
        to={`/product/${id}`}
        className="absolute inset-0 z-10"
        onClick={() => window.scrollTo(0, 0)}
      ></Link>

      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={image[0]}
          className="hover:scale-110 transition ease-in-out"
          alt=""
        />
      </div>

      {/* Product Name */}
      <p className="pt-3 pb-1 text-sm">{name}</p>

      {/* Product Price */}
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>

      {/* Stock Status */}
      {isOutOfStock ? (
        <p className="text-red-600 text-sm font-semibold mt-1">Out of Stock</p>
      ) : (
        <p className="text-green-600 text-sm mt-1">In Stock: {stock}</p>
      )}
    </div>
  );
};

export default ProductItem;
