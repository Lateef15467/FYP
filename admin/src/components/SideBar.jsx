// import React from "react";
// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";

// const SideBar = () => {
//   return (
//     <div className="w-[18%] min-h-screen border-r-2">
//       <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/add"
//         >
//           <img className="w-5 h-5" src={assets.add_icon} />
//           <p className="hidden md:block">Add items</p>
//         </NavLink>
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/list"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} />
//           <p className="hidden md:block">List items</p>
//         </NavLink>
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/orders"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} />
//           <p className="hidden md:block">Orders </p>
//         </NavLink>
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/supplier"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} />
//           <p className="hidden md:block">Supplier</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/suppliers"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} />
//           <p className="hidden md:block">Supplier-List</p>
//         </NavLink>
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/users"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} />
//           <p className="hidden md:block">Users</p>
//         </NavLink>
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/addVendor"
//         >
//           <img className="w-5 h-5" src={assets.add_icon} />
//           <p className="hidden md:block">Add Vendor</p>
//         </NavLink>
//         <NavLink
//           className="flex items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1"
//           to="/vendorList"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} />
//           <p className="hidden md:block">Vendor List</p>
//         </NavLink>

//       </div>
//     </div>
//   );
// };

// export default SideBar;

// from here admin + vendor both can access
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const role = localStorage.getItem("role"); // admin | vendor

  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">

        {/* ✅ COMMON (Admin + Vendor) */}
        <NavLink
          className="flex items-center gap-3 px-3 py-2"
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} />
          <p className="hidden md:block">Add items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 px-3 py-2"
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} />
          <p className="hidden md:block">List items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 px-3 py-2"
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        {/* ✅ ADMIN ONLY */}
        {role === "admin" && (
          <>
            <NavLink
              className="flex items-center gap-3 px-3 py-2"
              to="/supplier"
            >
              <img className="w-5 h-5" src={assets.order_icon} />
              <p className="hidden md:block">Supplier</p>
            </NavLink>

            <NavLink
              className="flex items-center gap-3 px-3 py-2"
              to="/suppliers"
            >
              <img className="w-5 h-5" src={assets.order_icon} />
              <p className="hidden md:block">Supplier List</p>
            </NavLink>

            <NavLink
              className="flex items-center gap-3 px-3 py-2"
              to="/users"
            >
              <img className="w-5 h-5" src={assets.order_icon} />
              <p className="hidden md:block">Users</p>
            </NavLink>

            <NavLink
              className="flex items-center gap-3 px-3 py-2"
              to="/addVendor"
            >
              <img className="w-5 h-5" src={assets.add_icon} />
              <p className="hidden md:block">Add Vendor</p>
            </NavLink>

            <NavLink
              className="flex items-center gap-3 px-3 py-2"
              to="/vendorList"
            >
              <img className="w-5 h-5" src={assets.order_icon} />
              <p className="hidden md:block">Vendor List</p>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
