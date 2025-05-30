import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { products, currency, cartItems } = useContext(ShopContext);

  const [cartData, setcartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const item in cartItems[item]) {
      for (const items in cartItems[items]) {
        if (cartItems[items][item]) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    console.log(tempData);
  }, [cartItems]);
  return <div>Cart</div>;
};

export default Cart;
