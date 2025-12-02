import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/orders/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/orders/status",
        {
          orderId,
          status: event.target.value,
        },
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-4 md:p-6">
      {/* Header / Total Orders */}
      <div className="mb-6 flex justify-between items-center bg-white shadow-md border rounded-xl p-5">
        <h3 className="text-xl font-semibold text-gray-800">Orders</h3>
        <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-lg text-lg font-bold">
          Total: {orders.length}
        </span>
      </div>

      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl shadow-md hover:shadow-lg transition-all p-6 mb-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-5 items-start">
              {/* Order Icon */}
              <img
                className="w-14 opacity-90"
                src={assets.parcel_icon}
                alt="parcel"
              />

              {/* Order Items & Address */}
              <div className="text-gray-700">
                <div className="mb-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="mb-1">
                      <p className="font-medium text-sm">
                        {item.name}
                        {index < order.items.length - 1 && ","}
                      </p>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="font-semibold text-gray-900 mt-2">
                  {order.address.firstName} {order.address.lastName}
                </p>

                <div className="text-sm mt-1">
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country} - {order.address.zipcode}
                  </p>
                  <p className="mt-1 font-medium">{order.address.phone}</p>
                </div>
              </div>

              {/* Payment & Method */}
              <div className="text-gray-700">
                <p className="font-semibold text-[15px]">
                  Items: {order.items.length}
                </p>
                <p className="mt-3 text-sm">Method: {order.paymentMethod}</p>
                <p className="text-sm">
                  Payment:{" "}
                  <span
                    className={
                      order.payment ? "text-green-600" : "text-red-600"
                    }
                  >
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>
                <p className="text-sm">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              {/* Total Price */}
              <p className="text-lg font-bold text-gray-800">
                {currency}
                {order.amount}
              </p>

              {/* Status Select */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="border rounded-lg p-2 shadow-sm font-semibold text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-blue-300"
              >
                <option value="OrderPlaced">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
