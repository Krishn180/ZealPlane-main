import React, { useState, useEffect } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../.../../../Auth/Axios";

const EnquiryModal = ({ open, onClose, emailAddress }) => {
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");

  const userIdLocalStorage = localStorage.getItem("Id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContactNumber = async () => {
      if (!token) {
        console.error("Authentication token is missing.");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/users/${userIdLocalStorage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data.user;
        setContactNumber(userData.contactNumber || ""); // Fetching from backend
      } catch (error) {
        console.error("Error fetching contact number:", error);
      }
    };

    if (open) {
      fetchContactNumber();
    }
  }, [open, userIdLocalStorage, token]);

  const isValidContact = contactNumber && contactNumber.trim() !== "";
  const message = encodeURIComponent("Hi, I am interested in your project!");
  const whatsappUrl = isValidContact
    ? `https://wa.me/${contactNumber}?text=${message}`
    : null;
  const emailSubject = encodeURIComponent("Project Inquiry");
  const emailBody = encodeURIComponent("Hi, I am interested in your project!");
  const mailUrl = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyles}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
          Contact Us
        </Typography>

        {isValidContact ? (
          <>
            <Typography sx={{ mb: 3, color: "#b8b8b8" }}>
              Choose your preferred mode of communication:
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* WhatsApp Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#25D366",
                  color: "#fff",
                  "&:hover": { bgcolor: "#1E9E50" },
                }}
                onClick={() => window.open(whatsappUrl, "_blank")}
              >
                WhatsApp
              </Button>

              {/* Email Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#F47521",
                  color: "#fff",
                  "&:hover": { bgcolor: "#d45f1c" },
                }}
                onClick={() => (window.location.href = mailUrl)}
              >
                Email
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography sx={{ mb: 3, color: "#F47521", fontWeight: "bold" }}>
              No contact number found! Contact via email or update your number.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Email Button */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#F47521",
                  color: "#fff",
                  "&:hover": { bgcolor: "#d45f1c" },
                }}
                onClick={() => (window.location.href = mailUrl)}
              >
                Email
              </Button>

              {/* Update Contact Number */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#ffffff",
                  color: "#F47521",
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
                onClick={() => navigate("/settings")}
              >
                Update Contact Number
              </Button>
            </Box>
          </>
        )}

        <Button sx={{ mt: 2, color: "#ffffff" }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "#181818",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  color: "#ffffff",
  // textAlign: "center",
  border: "0.1px solid gray",
};

export default EnquiryModal;
