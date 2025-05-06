import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axiosInstance from "../../Auth/Axios";
import "./Checkout.scss";
import { Link } from "react-router-dom"; // Add Link


const Checkout = () => {
  const { id } = useParams(); // Use useParams to get the product ID from the URL params

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null); // State to store product data
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false); // Loading for purchase process
  const [error, setError] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState(""); // Success/Error message
  
  const userId = localStorage.getItem("Id");

  useEffect(() => {
    // Fetch user data from API
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

    const handleAddToCart = (product) => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find(item => item._id === product._id);
    
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
    
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`🛒 ${product.title} has been added to your cart!`);
    };
    

    // Fetch product data from API
    const fetchProductData = async () => {
      try {
        console.log("Fetching product with ID:", id); // Log the product ID
        const response = await axiosInstance.get(`/products/${id}`);
        console.log("Product data:", response.data); // Log the product data

        if (response.data) {
          setProduct(response.data); // Set product state
        } else {
          setError("❌ Product not found.");
        }
      } catch (err) {
        setError("❌ Failed to fetch product data. Please try again.");
        console.error("Failed to fetch product:", err);
      }
    };

    if (id) {
      fetchProductData(); // Fetch product data if productId exists
    }

    fetchUserData(); // Fetch user data
  }, [id, userId]); // Re-run when productId or userId changes

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

  if (loading) return <p className="loading-message">🔄 Loading user data...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p className="error-message">❌ No product data found!</p>;

  const isUserUpdated = user?.fullName && user?.address;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-details">
        <div className="checkout-image-container">
          <img
            src={product.thumbnail}
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
    ⚠️ Please update your user info to proceed. You can update it in{" "}
    <Link to="/settings" style={{ color: "#FF5733", fontWeight: "bold" }}>
      Settings
    </Link>.
  </p>
)}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
