import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openDeletePopup = (id) => {
    setDeleteId(id);
    setShowPopup(true);
  };

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
      console.error(error);
      toast.error("Delete error");
    }
    setShowPopup(false);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-600 font-medium">
        Loading suppliers...
      </p>
    );

  return (
    <>
      <div className="w-full min-h-screen p-6 bg-gray-50">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 py-5">
            Supplier Management
          </h2>

          <Link
            to="/supplier"
            className="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-gray-900 transition"
          >
            + Add Supplier
          </Link>
        </div>

        {suppliers.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600 text-lg">No suppliers available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {supplier.name}
                </h3>

                <div className="text-gray-600 space-y-1 text-sm">
                  <p>
                    <strong>Email:</strong> {supplier.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {supplier.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {supplier.address}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-green-600 font-semibold">
                      {supplier.status || "active"}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => openDeletePopup(supplier._id)}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Confirm Delete
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this supplier? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
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
