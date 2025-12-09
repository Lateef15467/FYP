import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const UserDetails = ({ token }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/users/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        setUser(res.data.user);
        fetchOrders();
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("fetchUser error:", error.message);
      toast.error("Failed to load user");
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/orders/userorders`,
        { userId: id },
        { headers: { token } }
      );
      if (res.data.success) setOrders(res.data.orders);
    } catch (error) {
      console.log("fetchOrders error:", error.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Block / Unblock
  const toggleBlock = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/user/block/${id}`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setUser({ ...user, blocked: !user.blocked });
      }
    } catch (error) {
      console.log("toggleBlock error:", error.message);
      toast.error("Failed to update status");
    }
  };

  // Delete user (no browser confirm)
  const deleteUser = async () => {
    try {
      const res = await axios.delete(`${backendUrl}/api/user/delete/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("User deleted successfully");
        window.location.href = "/users";
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("deleteUser error:", error.message);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">User not found.</p>;

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.name || "Unknown";

  return (
    <div className="p-6 space-y-6">
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-5">
              Are you sure you want to delete this user?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold">User Details</h1>

      {/* USER CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition">
        <div className="flex items-center gap-6">
          <img
            src={assets.profile_icon}
            className="w-20 rounded-full border shadow"
            alt=""
          />
          <div>
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Role: <span className="font-medium">{user.role}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={toggleBlock}
            className={`px-4 py-2 rounded-lg text-white transition shadow ${
              user.blocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {user.blocked ? "Unblock User" : "Block User"}
          </button>

          <button
            onClick={() => setShowDeletePopup(true)}
            className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition shadow"
          >
            Delete User
          </button>
        </div>
      </div>

      {/* ORDER LIST */}
      <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition">
        <h3 className="text-lg font-semibold mb-2">Orders ({orders.length})</h3>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          orders.map((o) => (
            <div
              key={o._id}
              className="p-4 border rounded-lg my-2 hover:bg-gray-50 transition"
            >
              <p className="font-medium">Order ID: {o._id}</p>
              <p className="text-gray-700">Amount: Rs {o.amount}</p>
              <p className="text-sm">
                Date: {new Date(o.date).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDetails;
