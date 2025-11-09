import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const fetchUser = async () => {
        try {
          const res = await axios.get(`${backendUrl}/api/user/${userId}`);
          if (res.data.success) {
            setUserData(res.data.user);
            setUpdatedData(res.data.user);
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to load user data");
        }
      };
      fetchUser();
    } catch (err) {
      console.error("Token decode failed:", err);
    }
  }, []);

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);

      // 🔥 Show image instantly before upload
      const previewUrl = URL.createObjectURL(file);
      setUpdatedData((prev) => ({ ...prev, profilePic: previewUrl }));
    }
  };

  const handleSave = async () => {
    try {
      let uploadedUrl = updatedData.profilePic;

      if (profilePicFile) {
        console.log("Uploading file:", profilePicFile);
        const formData = new FormData();
        formData.append("file", profilePicFile);
        formData.append("upload_preset", "unsigned_upload"); // must be unsigned preset
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkfxlw36y/image/upload",
          formData
        );

        uploadedUrl = cloudinaryRes.data.secure_url;
        console.log("✅ Uploaded to Cloudinary:", uploadedUrl);
        setUpdatedData((prev) => ({ ...prev, profilePic: uploadedUrl }));
      }

      const res = await axios.put(`${backendUrl}/api/user/${userData._id}`, {
        ...updatedData,
        profilePic: uploadedUrl,
      });

      if (res.data.success) {
        setUserData(res.data.user);
        setEditMode(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      toast.error("Error updating profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-lg border border-gray-100"
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={
                updatedData.profilePic ||
                `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff&size=128`
              }
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white mb-2"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute bottom-0 left-0 text-xs"
              />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {userData.name}
          </h2>
          <p className="text-gray-500 mb-6">{userData.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${
                !editMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              value={updatedData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${
                !editMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">User ID</label>
            <input
              type="text"
              value={userData._id}
              disabled
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setUpdatedData(userData);
                  setEditMode(false);
                }}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
