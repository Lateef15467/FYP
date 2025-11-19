import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);

  // --------------------------
  // LOAD USER ON PAGE LOAD
  // --------------------------
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(`${backendUrl}/api/user/${userId}`);

        if (res.data.success) {
          setUserData(res.data.user);
          setUpdatedData(res.data.user);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user data");
      }
    };

    loadUser();
  }, []);

  // --------------------------
  // INPUT HANDLER
  // --------------------------
  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // --------------------------
  // FILE HANDLER → PREVIEW IMAGE
  // --------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicFile(file);

    const previewUrl = URL.createObjectURL(file);
    setUpdatedData((prev) => ({ ...prev, profilePic: previewUrl }));
  };

  // --------------------------
  // SAVE PROFILE
  // --------------------------
  const handleSave = async () => {
    try {
      if (!userData?._id) {
        toast.error("User not loaded yet");
        return;
      }

      let imageUrl = updatedData.profilePic;

      // Upload image to Cloudinary
      if (profilePicFile) {
        const fd = new FormData();
        fd.append("file", profilePicFile);
        fd.append("upload_preset", "unsigned_upload");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkfxlw36y/image/upload",
          fd
        );

        imageUrl = uploadRes.data.secure_url;
      }

      // UPDATE USER → FIXED ROUTE
      const res = await axios.put(
        `${backendUrl}/api/user/update/${userData._id}`,
        {
          name: updatedData.name,
          email: updatedData.email,
          profilePic: imageUrl,
        }
      );

      if (res.data.success) {
        setUserData(res.data.user);
        setUpdatedData(res.data.user);
        setEditMode(false);

        // 🔥 SUCCESS TOAST
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error("Error updating profile");
    }
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // --------------------------
  // LOADING SCREEN
  // --------------------------
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full"
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={
                updatedData.profilePic ||
                `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff&size=128`
              }
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />

            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute bottom-0 left-0 text-xs opacity-80"
              />
            )}
          </div>

          <h2 className="text-2xl font-semibold mt-2">{userData.name}</h2>
          <p className="text-gray-500">{userData.email}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={updatedData.name}
              disabled={!editMode}
              onChange={handleInputChange}
              className={`w-full p-2 mt-1 border rounded-lg ${
                !editMode ? "bg-gray-100" : ""
              }`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              disabled={!editMode}
              value={updatedData.email}
              onChange={handleInputChange}
              className={`w-full p-2 mt-1 border rounded-lg ${
                !editMode ? "bg-gray-100" : ""
              }`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">User ID</label>
            <input
              type="text"
              disabled
              value={userData._id}
              className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setUpdatedData(userData);
                  setEditMode(false);
                }}
                className="bg-gray-300 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
