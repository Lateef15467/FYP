import axios from "axios";

const JazzCashPay = ({ amount, userId }) => {
  const payNow = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/initiateJazzcash`,
        { userId, items: [], amount, address: "test address" }, // send relevant data
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.html) {
        // Open a new window and write the html (it will auto-submit)
        const w = window.open("", "_blank");
        w.document.write(res.data.html);
        w.document.close();
      } else {
        alert("Failed to get payment form");
      }
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <button
      onClick={payNow}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Pay with JazzCash
    </button>
  );
};

export default JazzCashPay;
