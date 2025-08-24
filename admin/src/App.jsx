import React from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import Order from "./pages/Order";
import List from "./pages/List";

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <>
        <Navbar></Navbar>
        <hr />
        <div className="flex w-full">
          <SideBar></SideBar>
          <div className="w-[70%] mx-auto ml-[max{5vw,25px}] my-8 text-gray-600 text-base">
            <Routes>
              <Route path="/add" element={<Add></Add>}></Route>
              <Route path="/list" element={<List></List>}></Route>
              <Route path="/list" element={<Order></Order>}></Route>
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;
