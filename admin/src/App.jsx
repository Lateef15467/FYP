import React from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <>
        <Navbar></Navbar>
        <hr />
        <div className="flex w-full">
          <SideBar></SideBar>
        </div>
      </>
    </div>
  );
};

export default App;
