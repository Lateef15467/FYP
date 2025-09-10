import React from "react";

const Profile = () => {
  const user = {
    name: "Latif Lahari",
    email: "latiflahari@gmail.com",
    phone: "+92 300 1234567",
    address: "skardu, Pakistan",
    bio: "Recent Computer Science graduate, learning MERN stack and exploring web development opportunities.",
    avatar:
      "https://ui-avatars.com/api/?name=Latif+Lahari&background=4f46e5&color=fff&size=128",
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-96 text-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto shadow-md"
        />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {user.name}
        </h2>
        <p className="text-gray-500 text-sm">{user.bio}</p>

        <div className="mt-4 text-left space-y-2">
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {user.phone}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {user.address}
          </p>
        </div>

        <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
