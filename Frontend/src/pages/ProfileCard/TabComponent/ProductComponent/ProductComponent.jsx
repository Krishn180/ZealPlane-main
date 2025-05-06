import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import "./ProductComponent.scss";
import axiosInstance from "../../../../Auth/Axios";
import { Modal } from "antd";

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    tags: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products");
      setProducts(res.data);
      console.log("products are", res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadData = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        uploadData.append(key, value)
      );
      uploadData.append("thumbnailImage", thumbnail);
      additionalImages.forEach((img) =>
        uploadData.append("additionalImages", img)
      );

      const token = localStorage.getItem("token"); // Make sure token is stored

      await axiosInstance.post("/products", uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchProducts();
      setIsModalOpen(false); // Close modal on success
    } catch (err) {
      console.error("Product creation failed", err);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/checkout/${productId}`); // Navigate to the checkout page with the product ID
  };

  return (
    <div className="product-component">
      <div className="product-header">
        <h2>Your Products</h2>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Add Product
        </button>
      </div>

      <div className="product-list">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="product-card"
            onClick={() => handleProductClick(prod._id)} // Handle click to navigate to checkout page
          >
            <img src={prod.thumbnail} alt={prod.title} />
            <div className="card-content">
              <h4>{prod.title}</h4>
              <p>₹ {prod.price}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Add New Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="product-form">
          <input name="title" placeholder="🖊️ Title" onChange={handleInputChange} />
          <textarea name="description" placeholder="💬 Description" onChange={handleInputChange} />
          <input name="price" type="number" placeholder="💰 Price" onChange={handleInputChange} />
          <input name="category" placeholder="📚 Category" onChange={handleInputChange} />
          <input name="subcategory" placeholder="🔍 Subcategory" onChange={handleInputChange} />
          <input name="tags" placeholder="🏷️ Tags (comma separated)" onChange={handleInputChange} />
          <label>🖼️ Thumbnail:</label>
          <input type="file" onChange={handleThumbnailChange} />
          <label>📁 Additional Images:</label>
          <input type="file" multiple onChange={handleAdditionalImagesChange} />
          <button type="submit">🚀 Submit Product</button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductComponent;
