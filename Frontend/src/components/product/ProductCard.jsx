import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Auth/Axios";
import "./ProductCard.scss";

const ProductCard = ({ currentProjectId }) => {
  const navigate = useNavigate();
  const [recommendedProjects, setRecommendedProjects] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.get("/projects");

        if (Array.isArray(res.data)) {
          // Filter out current project
          const filteredProjects = res.data.filter(
            (project) => project._id !== currentProjectId
          );

          // Shuffle and pick top 4
          const shuffled = filteredProjects.sort(() => 0.5 - Math.random());
          setRecommendedProjects(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [currentProjectId]);

  const handleReadMore = (project) => {
    const slug = `${project._id}-${project.name
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    navigate(`/viewer/${slug}?start=0`);
  };

  return (
    <div className="product-recommendation-container">
      <h2 className="recommendation-heading">
        🎯 Enjoyed reading? <span>Continue your adventure!</span>
      </h2>

      <div className="product-container">
        {recommendedProjects.length > 0 ? (
          recommendedProjects.map((project) => (
            <div
              className="product-card"
              key={project._id}
              onClick={() => handleReadMore(project)}
            >
              <img
                src={project.thumbnailImage || "/placeholder.jpg"}
                alt={project.name}
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-title">{project.name}</h3>
                <p className="continue-reading">👉 Tap to keep reading</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#fff", textAlign: "center" }}>Loading recommendations...</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
