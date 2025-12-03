import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all orders
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

  // Update Order Status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/orders/status",
        {
          orderId,
          status: event.target.value,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Open Popup
  const handleDeleteClick = (orderId) => {
    setDeleteId(orderId);
    setShowPopup(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/orders/delete/${deleteId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order deleted successfully");
        setShowPopup(false);
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
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
                  Payment:
                  <span
                    className={`ml-1 ${
                      order.payment ? "text-green-600" : "text-red-600"
                    }`}
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

              {/* Status & Delete */}
              <div className="flex flex-col gap-3">
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

                <button
                  onClick={() => handleDeleteClick(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRMATION POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Order;
