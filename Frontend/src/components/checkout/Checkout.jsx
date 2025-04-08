import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../Auth/Axios";
import "./Checkout.scss";

const Checkout = () => {
  const location = useLocation();
  const { product } = location.state || {}; // Get product data from state

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false); // Loading for purchase process
  const [error, setError] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState(""); // Success/Error message

  const userId = localStorage.getItem("Id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axiosInstance.get(`/users/${userId}`, {
          headers,
        });
        setUser(response.data.user);
      } catch (err) {
        setError("❌ Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleConfirmPurchase = async () => {
    if (!user || !product) return;

    setPurchaseLoading(true); // Start loading

    try {
      const purchaseData = {
        userId,
        userEmail: user.email,
        userName: user.fullName,
        productTitle: product.title,
        productPrice: product.price,
      };

      const response = await axiosInstance.post(
        "https://api.comicplane.site/api/confirm-purchase",
        purchaseData
      );

      if (response.status === 200) {
        const whatsappNumber = "+918249071144"; // Replace with your WhatsApp number
        const whatsappMessage = encodeURIComponent(
          `Hello, I have successfully purchased ${product.title} for ₹${product.price}. I have an enquiry.`
        );
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        setPurchaseStatus(
          <div className="success-message">
            <p>✅ Purchase successful! A confirmation email has been sent.</p>
            <p>
              📞 Need help?{" "}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", fontWeight: "bold" }}
              >
                Contact us on WhatsApp
              </a>
            </p>
          </div>
        );
      }
    } catch (err) {
      setPurchaseStatus("❌ Error processing your purchase. Please try again.");
      console.error("Error purchasing:", err);
    } finally {
      setPurchaseLoading(false); // Stop loading
    }
  };

  if (!product)
    return <p className="error-message">❌ No product data found!</p>;
  if (loading)
    return <p className="loading-message">🔄 Loading user data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const isUserUpdated = user?.fullName && user?.address;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-details">
        <div className="checkout-image-container">
          <img
            src={product.image}
            alt={product.title}
            className="checkout-product-image"
          />
        </div>

        <div className="checkout-info">
          <h3>Product Title: {product.title}</h3>
          <p>
            <strong>Description: </strong>{" "}
            {product?.description || "Not updated"}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>

          <div className="user-info">
            <h4>User Information</h4>
            <p>
              <strong>Name:</strong> {user?.fullName || "Not updated"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "Not available"}
            </p>
            <p>
              <strong>Address:</strong> {user?.address || "Not updated"}
            </p>
          </div>

          <button
            className="confirm-purchase-button"
            disabled={!isUserUpdated || purchaseLoading}
            onClick={handleConfirmPurchase}
            style={{
              backgroundColor: isUserUpdated ? "#FF5733" : "gray",
              cursor: isUserUpdated ? "pointer" : "not-allowed",
            }}
          >
            {purchaseLoading ? "Processing..." : "Confirm Purchase"}
          </button>

          {purchaseLoading && (
            <p className="loading-message">
              🔄 Processing your purchase, please wait...
            </p>
          )}
          {purchaseStatus && (
            <p className="purchase-message">{purchaseStatus}</p>
          )}
          {!isUserUpdated && (
            <p className="error-message">
              ⚠️ Please update your user info to proceed.You can update your
              data in settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
