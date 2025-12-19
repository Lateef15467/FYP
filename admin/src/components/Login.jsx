// import React, { useState } from "react";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Login = ({ settoken }) => {
//   const [email, setemail] = useState("");
//   const [password, setpassword] = useState("");

//   const onSubmitHandler = async (e) => {
//     try {
//       e.preventDefault();
//       const response = await axios.post(backendUrl + "/api/user/admin", {
//         email,
//         password,
//       });

//       if (response.data.success) {
//         settoken(response.data.token);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
//       <div className="backdrop-blur-md bg-white/80 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md border border-gray-200">
//         <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
//         <p className="text-center text-gray-500 mb-6 text-sm">
//           Sign in to access your admin dashboard
//         </p>

//         <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-1 block">
//               Email Address
//             </label>
//             <input
//               onChange={(e) => setemail(e.target.value)}
//               value={email}
//               type="email"
//               placeholder="admin@example.com"
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-black/50 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-1 block">
//               Password
//             </label>
//             <input
//               onChange={(e) => setpassword(e.target.value)}
//               value={password}
//               type="password"
//               placeholder="Enter password"
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-black/50 outline-none"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-900 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// last admin + vender with role and token store in local storage
import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ settoken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // clear old login data (important)
      localStorage.clear();

      const response = await axios.post(
        `${backendUrl}/api/user/admin`,
        { email, password }
      );

      if (response.data.success) {
        const { token, role } = response.data;

        // save token & role
        settoken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role.toLowerCase());

        toast.success("Login successful");

        // redirect to dashboard
        navigate("/add");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="backdrop-blur-md bg-white/80 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center mb-2">
          Admin / Vendor Login
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign in to access your dashboard
        </p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-black/50 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-black/50 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
