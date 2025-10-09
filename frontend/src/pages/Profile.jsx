import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Latif Lahari",
    email: "latiflahari@gmail.com",
    phone: "+92 300 1234567",
    address: "Skardu, Pakistan",
    bio: "Recent Computer Science graduate, learning MERN stack and exploring web development opportunities.",
    avatar:
      "https://ui-avatars.com/api/?name=Latif+Lahari&background=4f46e5&color=fff&size=128",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  // take photo from webcam
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setEditedUser((prev) => ({ ...prev, avatar: imageSrc }));
    setShowCamera(false);
  };

  // save changes
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-96 text-center">
        {showCamera ? (
          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg w-64 h-48"
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={capturePhoto}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Capture
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <img
              src={editedUser.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto shadow-md"
            />
            {isEditing && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Photo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-sm"
                />
                <p
                  onClick={() => setShowCamera(true)}
                  className="text-indigo-600 cursor-pointer mt-2 text-sm hover:underline"
                >
                  Take a photo with camera
                </p>
              </div>
            )}
          </>
        )}

        {/* Editable fields */}
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleChange}
              className="mt-4 w-full border rounded-md p-2"
            />
            <textarea
              name="bio"
              value={editedUser.bio}
              onChange={handleChange}
              className="mt-2 w-full border rounded-md p-2 text-sm"
            />
          </>
        ) : (
          <>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">{user.bio}</p>
          </>
        )}

        <div className="mt-4 text-left space-y-2">
          {["email", "phone", "address"].map((field) => (
            <p key={field}>
              <span className="font-semibold capitalize">{field}:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={editedUser[field]}
                  onChange={handleChange}
                  className="border rounded-md p-1 w-full"
                />
              ) : (
                user[field]
              )}
            </p>
          ))}
        </div>

        {isEditing ? (
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              className="w-1/2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-1/2 bg-gray-400 text-white py-2 rounded-xl hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
