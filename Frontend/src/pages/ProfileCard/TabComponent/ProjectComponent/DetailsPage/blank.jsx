import React from "react";
import { useNavigate } from "react-router-dom";

const BlankPage = () => {
  const navigate = useNavigate();

  const goToForum = () => {
    navigate("/forum"); // Navigate to the forum page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#000", // Background color
        color: "#fff", // White text
        padding: "20px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        Like the work? Do share your thoughts by either commenting below or join
        the discussion here on our official forum.
      </p>
      <button
        onClick={goToForum}
        style={{
          backgroundColor: "#F9A825", // Crunchyroll yellow
          color: "#fff",
          padding: "12px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={
          (e) => (e.currentTarget.style.backgroundColor = "#C17900") // Darker yellow on hover
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#F9A825")
        }
      >
        Join
      </button>
    </div>
  );
};

export default BlankPage;
