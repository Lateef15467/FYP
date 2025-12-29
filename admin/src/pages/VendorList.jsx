// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const VendorList = ({ token }) => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchVendors = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/vendor/list`, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         setVendors(res.data.vendors);
//       } else {
//         toast.error("Failed to load vendors");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error fetching vendors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleBlock = async (id) => {
//     try {
//       const res = await axios.put(
//         `${backendUrl}/api/vendor/block/${id}`,
//         {},
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         toast.success(res.data.message);
//         fetchVendors();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Action failed");
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Loading vendors...</p>;
//   }

//   return (
//     <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Vendor List</h2>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b text-left">
//               <th className="py-3">Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th className="text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {vendors.map((vendor) => (
//               <tr key={vendor._id} className="border-b hover:bg-gray-50">
//                 <td className="py-3">{vendor.name}</td>
//                 <td>{vendor.email}</td>
//                 <td className="capitalize">{vendor.role}</td>
//                 <td>
//                   {vendor.blocked ? (
//                     <span className="text-red-600 font-semibold">Blocked</span>
//                   ) : (
//                     <span className="text-green-600 font-semibold">Active</span>
//                   )}
//                 </td>
//                 <td className="text-center">
//                   <button
//                     onClick={() => toggleBlock(vendor._id)}
//                     className={`px-4 py-1 rounded-lg text-white ${
//                       vendor.blocked
//                         ? "bg-green-600 hover:bg-green-700"
//                         : "bg-red-600 hover:bg-red-700"
//                     }`}
//                   >
//                     {vendor.blocked ? "Unblock" : "Block"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {vendors.length === 0 && (
//           <p className="text-center py-6 text-gray-500">No vendors found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VendorList;
