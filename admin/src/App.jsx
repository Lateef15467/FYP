import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Route, Routes, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import Order from "./pages/Order";
import List from "./pages/List";
import Login from "./components/Login";
import Supplier from "./pages/Supplier";
import SupplierList from "./pages/SupplierList";
import EditProduct from "./pages/EditProduct";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const [token, settoken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<Login settoken={settoken} />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar settoken={settoken} />
                <hr />
                <div className="flex w-full">
                  <SideBar />
                  <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                    <Routes>
                      <Route path="/" element={<Add token={token} />} />
                      <Route path="/add" element={<Add token={token} />} />
                      <Route path="/list" element={<List token={token} />} />
                      <Route
                        path="/users"
                        element={<UserList token={token} />}
                      />
                      <Route path="/orders" element={<Order token={token} />} />
                      <Route
                        path="/users/:id"
                        element={<UserDetails token={token} />}
                      />
                      <Route
                        path="/supplier"
                        element={<Supplier token={token} />}
                      />
                      <Route
                        path="/suppliers"
                        element={<SupplierList token={token} />}
                      />
                      <Route
                        path="/product/edit/:id"
                        element={<EditProduct token={token} />}
                      />
                    </Routes>
                  </div>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
};

export default App;
