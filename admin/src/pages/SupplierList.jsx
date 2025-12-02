import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // <-- popup ID
  const [showPopup, setShowPopup] = useState(false); // <-- popup visibility

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        "https://shopnow-phi.vercel.app/api/supplier/all"
      );

      if (response.data.success) {
        setSuppliers(response.data.suppliers);
      } else {
        toast.error("Failed to load suppliers");
      }
    } catch (error) {
      toast.error("Error fetching suppliers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Open popup
  const openDeletePopup = (id) => {
    setDeleteId(id);
    setShowPopup(true);
  };

  // Delete supplier
  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `https://shopnow-phi.vercel.app/api/supplier/delete/${deleteId}`
      );

      if (response.data.success) {
        toast.success("Supplier deleted");
        setSuppliers((prev) => prev.filter((item) => item._id !== deleteId));
      } else {
        toast.error("Failed to delete supplier");
      }
    } catch (error) {
      toast.error("Delete error");
    }

    setShowPopup(false);
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Suppliers</h2>

          <Link
            to="/supplier"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Add More Supplier
          </Link>
        </div>

        {suppliers.length === 0 ? (
          <p>No suppliers found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="border rounded-lg p-4 shadow-md bg-white"
              >
                <h3 className="text-xl font-semibold">{supplier.name}</h3>

                <p>
                  <strong>Email:</strong> {supplier.email}
                </p>
                <p>
                  <strong>Phone:</strong> {supplier.phone}
                </p>
                <p>
                  <strong>Address:</strong> {supplier.address}
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => openDeletePopup(supplier._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- CUSTOM DELETE POPUP ---------- */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this supplier?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierList;
