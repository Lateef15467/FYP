// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { ShopContext } from "../context/ShopContext";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { backendUrl } = useContext(ShopContext);
//   const query = new URLSearchParams(useLocation().search);
//   const token = query.get("token");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Invalid reset link");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (password.length < 8) {
//       toast.error("Password must be at least 8 characters long");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
//         token: token,
//         password: password,
//       });

//       if (res.data.success) {
//         toast.success(res.data.message);
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.error("Reset password error:", error);
//       if (error.response && error.response.data) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Failed to reset password. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!token) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
//           <h2 className="text-2xl font-semibold mb-4 text-red-600">
//             Invalid Reset Link
//           </h2>
//           <p className="text-gray-600">
//             The reset link is invalid or has expired. Please request a new reset
//             link.
//           </p>
//           <button
//             onClick={() => navigate("/forgot-password")}
//             className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
//           >
//             Request New Link
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center">
//           Reset Password
//         </h2>
//         <p className="text-sm text-gray-600 mb-4 text-center">
//           Enter your new password below
//         </p>

//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           minLength={8}
//           className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-black outline-none"
//           placeholder="New Password (min. 8 characters)"
//         />

//         <input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//           minLength={8}
//           className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-black outline-none"
//           placeholder="Confirm New Password"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-900 transition disabled:bg-gray-400"
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

// from here coded by furman ali
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ FROM URL

  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          token: token,
          password: password,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full p-2"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

