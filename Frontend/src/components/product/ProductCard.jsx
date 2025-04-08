import React from "react";
import { useNavigate } from "react-router-dom";
import products from "../../assets/product";
import "./ProductCard.scss";

const ProductCard = () => {
  const navigate = useNavigate(); // Get the navigate function from react-router

  const handleBuyNow = (product) => {
    // Navigate to the checkout page and pass the product data as state
    navigate("/checkout", { state: { product } });
  };

  return (
    <div className="product-container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
          <div className="product-details">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-price">Price: ₹{product.price}</p>
            <button
              className="buy-button"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
