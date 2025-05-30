import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setsearch] = useState("");
  const [showsearch, setshowsearch] = useState(false);
  const [cartItem, setcartItem] = useState({});
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    let cartData = structuredClone(cartItem);

    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setcartItem(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setcartItem(cartData);
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItem) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItem[itemId]) {
        try {
          const quantity = cartItem[itemId][size];
          if (quantity > 0) {
            totalAmount += itemInfo.price * quantity;
          }
        } catch (error) {
          console.log("Error calculating cart amount:", error);
        }
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setsearch,
    showsearch,
    setshowsearch,
    cartItem,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
