import React, { useState } from "react";
import axios from "axios";
import "./SupportModal.scss";
import axiosInstance from "../../Auth/Axios";

const SupportModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSupportClick = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/payment/support");

      if (res.data.success) {
        const { order_id, key, amount, currency } = res.data;

        // Razorpay options
        const options = {
          key,
          amount,
          currency,
          name: "ZealPlane Support",
          description: "Support our work and get exclusive perks!",
          order_id,
          handler: function (response) {
            alert(`🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            setShowModal(false);
          },
          prefill: {
            name: "Supporter",
            email: "supporter@example.com",
          },
          theme: {
            color: "#f37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Something went wrong while creating the order!");
      }
    } catch (error) {
      console.error("Error during support:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Support Button */}
      <button onClick={() => setShowModal(true)} className="support-btn">
        ❤️ Support Us
      </button>

      {/* Modal */}
      {showModal && (
        <div className="support-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="support-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2>Support Our Work 🙌</h2>
            <p>
              Your ₹50 contribution helps us continue creating awesome content and
              improve this platform.
            </p>
            <p>
              In return, you'll get access to exclusive updates and early previews.
            </p>

            <div className="modal-actions">
              <button
                onClick={handleSupportClick}
                disabled={loading}
                className="proceed-btn"
              >
                {loading ? "Processing..." : "Proceed to Support ₹50"}
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportModal;
