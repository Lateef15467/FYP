import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProduct from "../components/RelatedProduct";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [producData, setproductData] = useState(false);
  const [image, setimage] = useState("");
  const [size, setsize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setproductData(item);
        setimage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);
  return producData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-500">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-auto sm:overflow-y-scroll justify-normal sm:w-[18.7%] w-full">
            {producData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setimage(item)}
                src={item}
                alt=""
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>

        {/* product info */}

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{producData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3 5" alt="" />
            <img src={assets.star_icon} className="w-3 5" alt="" />
            <img src={assets.star_icon} className="w-3 5" alt="" />
            <img src={assets.star_icon} className="w-3 5" alt="" />
            <img src={assets.star_dull_icon} className="w-3 5" alt="" />
            <p className="pl-2 ">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {producData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {producData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p className="">Select Size</p>
            <div className="flex gap-2">
              {producData.Sizes.map((item, index) => (
                <button
                  onClick={() => setsize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              addToCart(producData._id, size);
            }}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            Add to cart
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% original product.</p>
            <p>Cash on delivery is avialable.</p>
            <p>Easy return policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* decription and review */}

      <div className="mt-20">
        <div className="flex ">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6  texy-sm text-gray-500">
          <p>
            Discover the perfect blend of style, comfort, and quality with this
            product. Designed with premium materials, it offers durability and
            everyday usability, making it an ideal choice for your wardrobe or
            lifestyle.
          </p>
          <p>
            Whether you’re looking for a modern look or a timeless classic, this
            piece is crafted to meet your needs. Enjoy reliable quality,
            affordable pricing, and a product that’s made to fit seamlessly into
            your daily life.
          </p>
        </div>
      </div>

      {/* dislay related product */}

      <RelatedProduct
        category={producData.category}
        subcategory={producData.subcategory}
      ></RelatedProduct>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
