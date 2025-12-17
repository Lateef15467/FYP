import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserList = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/users`, {
        headers: { token },
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setFiltered(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const lower = value.toLowerCase();

    const results = users.filter((u) => {
      const name =
        u.firstName || u.lastName
          ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
          : u.name || "";

      return (
        name.toLowerCase().includes(lower) ||
        (u.email || "").toLowerCase().includes(lower)
      );
    });

    setFiltered(results);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-gray-600 animate-pulse">Loading users...</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">Users</h1>

        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="px-4 py-2 border rounded-xl w-full md:w-72 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow-md border">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => {
                const displayName =
                  user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : user.name || "Unknown";

                return (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => navigate(`/users/${user._id}`)}
                    >
                      {displayName}
                    </td>

                    <td
                      className="p-3 cursor-pointer"
                      onClick={() => navigate(`/users/${user._id}`)}
                    >
                      {user.email}
                    </td>

                    <td className="p-3 capitalize">{user.role}</td>

                    <td
                      className={`p-3 font-medium ${
                        user.blocked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {user.blocked ? "Blocked" : "Active"}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => navigate(`/users/${user._id}`)}
                        className="px-4 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filtered.map((user) => {
          const displayName =
            user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : user.name || "Unknown";

          return (
            <div
              key={user._id}
              className="bg-white p-5 rounded-xl shadow border hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{displayName}</h2>
              <p className="text-gray-700">{user.email}</p>
              <p className="text-sm mt-1">
                Role: <span className="font-medium">{user.role}</span>
              </p>
              <p
                className={`mt-1 font-medium ${
                  user.blocked ? "text-red-600" : "text-green-600"
                }`}
              >
                {user.blocked ? "Blocked" : "Active"}
              </p>

              <button
                onClick={() => navigate(`/users/${user._id}`)}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
