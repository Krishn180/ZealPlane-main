import React, { useState } from "react";
import axiosInstance from "../../Auth/Axios";
import "./SupportModal.scss";

const SupportModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSupportClick = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/payment/support");

      if (res.data.success) {
        const { order_id, key, amount, currency } = res.data;

        const options = {
          key,
          amount,
          currency,
          name: "ZealPlane Support",
          description: "Support our work and get exclusive perks!",
          order_id,
          handler: function (response) {
            setPaymentId(response.razorpay_payment_id);
            setShowModal(false);
            setSuccessModal(true);

            // Auto close after 4 seconds (optional)
            setTimeout(() => {
              setSuccessModal(false);
            }, 4000);
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
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Support error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Support Button */}
      <button onClick={() => setShowModal(true)} className="support-btn">
       Support
      </button>

      {/* Payment Modal */}
      {showModal && (
        <div className="support-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="support-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Support Our Work 🙌</h2>
            <p>Just ₹50 can inspire your favorite creator to keep producing the content you love.
Your support = their motivation.</p>
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

      {/* Success Modal */}
      {successModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <h2>🎉 Payment Successful!</h2>
            <p>Thank you so much for your support ❤️</p>

            <p className="payment-id">
              Payment ID: <span>{paymentId}</span>
            </p>

            <button onClick={() => setSuccessModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportModal;
