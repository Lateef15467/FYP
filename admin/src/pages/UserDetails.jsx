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

  // Fetch orders (unchanged)
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

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">User not found.</p>;

  // support both schemas: { firstName, lastName } or { name }
  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.name || "Unknown";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">User Details</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <div className="flex items-center gap-6">
          <img src={assets.profile_icon} className="w-20" alt="" />
          <div>
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Role: <span className="font-medium">{user.role}</span>
            </p>
          </div>
        </div>

        <button
          onClick={toggleBlock}
          className={`mt-5 px-4 py-2 rounded-lg text-white ${
            user.blocked ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {user.blocked ? "Unblock User" : "Block User"}
        </button>
      </div>

      {/* Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold">Orders ({orders.length})</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="p-4 border rounded-lg my-2">
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
