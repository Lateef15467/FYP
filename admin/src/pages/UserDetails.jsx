import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const UserDetails = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    } catch {
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
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Delete User
  const deleteUser = async () => {
    try {
      const res = await axios.delete(`${backendUrl}/api/user/delete/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("User deleted successfully");
        navigate("/users");
      } else {
        toast.error(res.data.message);
      }
    } catch {
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
      : user.name;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">User Details</h1>

      {/* User Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-5">
        <div className="flex items-center gap-6">
          <img
            src={assets.profile_icon}
            className="w-24 rounded-full shadow-md"
            alt=""
          />

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {displayName}
            </h2>
            <p className="text-gray-700">{user.email}</p>

            <p className="text-sm text-gray-600 mt-1">
              Role:{" "}
              <span className="font-semibold text-gray-800">{user.role}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {/* Action Buttons */}
        {user.role !== "admin" && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={toggleBlock}
              className={`px-4 py-2 rounded-lg text-white font-medium shadow-md ${
                user.blocked ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {user.blocked ? "Unblock User" : "Block User"}
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-lg bg-red-700 text-white font-medium shadow-md"
            >
              Delete User
            </button>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <h3 className="text-xl font-semibold">Orders ({orders.length})</h3>

        {orders.length === 0 ? (
          <p className="text-gray-500 mt-2">No orders yet</p>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="p-4 border rounded-xl shadow-sm bg-gray-50"
              >
                <p className="font-semibold">Order ID: {o._id}</p>
                <p className="text-gray-700">Amount: Rs {o.amount}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(o.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600">
              Are you sure you want to permanently delete this user?
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-700 text-white rounded-lg shadow-md"
                onClick={deleteUser}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
