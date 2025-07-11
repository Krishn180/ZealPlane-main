// src/components/ProjectComponent/ProjectComponent.jsx
import React, { useState, useEffect } from "react";
import { Button, Card, Typography, CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProjectModal from "./Others/projectModal"; // Import the new modal
import ContentWrapper from "../../../../components/contentWrapper/ContentWrapper";
import Img from "../../../../components/lazyLoadImage/Img";
import "./ProjectComponent.scss";
import axiosInstance from "../../../../Auth/Axios";
import { jwtDecode } from "jwt-decode";

const ProjectComponent = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [uploading, setUploading] = useState(false); // Uploading state for progress
  const [error, setError] = useState(null);
  const [fetchedUsername, setFetchedUsername] = useState("");

  const { id } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;

  const isOwner = id === userId;
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("");

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = (formData) => {
    setUploading(true);

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the JWT token
        const decodedToken = jwtDecode(token);

        // Extract uniqueId from the decoded token
        const uniqueId = decodedToken?.uniqueId;
        const profilePic = decodedToken?.profilePic;

        if (!uniqueId) {
          console.error("uniqueId is missing or invalid from the token.");
          setUploading(false);
          return;
        }

        console.log("Extracted uniqueId:", uniqueId);
        console.log("Extracted profilePic:", profilePic);

        // Create FormData and append fields
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("tags", formData.tags.join(","));
        data.append("subtags", formData.subtags.join(",")); // assuming it's an array
        data.append("publisher", formData.publisher);
        data.append("username", formData.username);
        data.append("id", formData.id);
        data.append("uniqueId", uniqueId);
        data.append("profilePic", profilePic);

        console.log();

        if (formData.thumbnailImage) {
          data.append("thumbnailImage", formData.thumbnailImage);
        }

        // Make POST request
        axiosInstance
          .post(`${apiBaseUrl}/projects`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setSubmittedData((prevData) => [...prevData, response.data]);
            setUploading(false);
            handleClose();
            navigate(`/details/${response.data.projectId}`);
          })
          .catch((error) => {
            console.error("Error posting form data:", error);
            setUploading(false);
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        setUploading(false);
      }
    } else {
      console.error("Token is missing!");
      setUploading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (fetchedUsername) {
        const response = await axios.get(
          `${apiBaseUrl}/projects/username/${fetchedUsername}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("projects fetched by username", response.data);

        setSubmittedData(response.data);
      } else {
        setSubmittedData([]);
        console.error("error fetching your project");
      }
    } catch (error) {
      console.log("Please upload your project here");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get the token from localStorage (if it exists)
        const token = localStorage.getItem("token");

        // Prepare the headers object. If token exists, include it in the header.
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Make the API request with or without the token
        const response = await axiosInstance.get(`/users/${id}`, {
          headers: headers, // Include token if available
        });

        // Check if the user has a username
        if (response.data.user && response.data.user.username) {
          setFetchedUsername(response.data.user.username);
          setStatus(response.data.status);

          console.log(
            "username for the project is",
            response.data.user.username
          );

          // Store username in localStorage
          localStorage.setItem("username", response.data.user.username);
        } else {
          setFetchedUsername(""); // Set to empty if username is not available
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setFetchedUsername(""); // Set to empty if there's an error
      }
    };

    // Only fetch user details if `id` exists
    if (id) {
      fetchUserDetails();
    }
  }, [id]); // Dependency on `id` ensures that the effect runs when `id` changes

  useEffect(() => {
    if (fetchedUsername) {
      fetchData();
    }
  }, [fetchedUsername]);

  return (
    <div>
      <ProjectModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      {loading && <p>Loading...</p>}
      {uploading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && <p>Error: {error.message}</p>}

      <div className="project-cards-container">
        
        {submittedData && submittedData.length > 0 ? (
          submittedData.map((project, index) => (
           <Card
  className="card"
  key={index}
  style={{
    width: window.innerWidth <= 768 ? "44vw" : "240px", // responsive width
    aspectRatio: "2 / 3", // typical comic book format
    margin: "10px",
    flex: "0 0 auto",
    cursor: "pointer",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
  }}
  onClick={() => navigate(`/details/${project.projectId}`)}
>
  {/* Comic Image */}
  <div style={{ width: "100%", height: "100%", position: "relative" }}>
    <Img
      src={project.thumbnailImage}
      alt={project.name}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover", // fills the card like a comic cover
      }}
    />
  </div>

  {/* Title Overlay */}
  <div
    style={{
      position: "absolute",
      bottom: 0,
      width: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      padding: "8px",
      textAlign: "center",
    }}
  >
    <Typography
      variant="subtitle2"
      style={{
        color: "#fff",
        fontWeight: 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {project.name}
    </Typography>
  </div>
</Card>

          
          ))
        ) : (
          <p>No projects found.</p>
        )}
        {status !== "visitor" && (
          <Button
            variant="contained"
            onClick={handleOpen}
            style={{
              background: " #ff4f00",
              marginBottom: "5px",
              display: "flex",
            }}
          >
            Add Project
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectComponent;
