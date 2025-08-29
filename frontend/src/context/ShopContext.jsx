import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setsearch] = useState("");
  const [showsearch, setshowsearch] = useState(false);
  const [cartItem, setcartItem] = useState({});
  const [products, setproducts] = useState([]);
  const [token, settoken] = useState("");
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

  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setproducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
      console.log("Products loaded", response.data.products);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      settoken(localStorage.getItem("token"));
    }
  }, []);
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
    backendUrl,
    settoken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
