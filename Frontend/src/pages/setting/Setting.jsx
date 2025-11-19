import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Setting.scss";
import axiosInstance from "../../Auth/Axios";
import Header from "../../components/header/Header";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);

  const userIdLocalStorage = localStorage.getItem("Id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        navigate("/login");
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
        setContactNumber(userData.contactNumber || ""); // ✅ API expects 'contactNumber'
        setAddress(userData.address || "");
        setVerificationStatus(userData.verificationStatus || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again later.");
      }
    };

    fetchUserData();
  }, [userIdLocalStorage, token, navigate]);

  const handleUpdateInfo = async () => {
    if (!contactNumber && !address) {
      alert("Please enter at least one field to update.");
      return;
    }

    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      await axiosInstance.put(
        `/users/${userIdLocalStorage}`,
        { contactNumber, address }, // ✅ API expects 'contactNumber'
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Information updated successfully!");
    } catch (error) {
      console.error("Error updating information:", error);
      alert("Failed to update information.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      await axiosInstance.delete(`/users/${userIdLocalStorage}/delete`, {
        // ✅ Ensure this matches your backend
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully!");
      localStorage.clear();
      navigate("/register");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    alert("Logged out successfully!");
  };

  const handleApplyVerification = async () => {
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/users/${userIdLocalStorage}/apply-verification`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVerificationStatus("Pending");
      alert(response.data.message || "Verification request submitted!");
    } catch (error) {
      console.error("Error applying for verification:", error);
      alert("Failed to apply for verification.");
    }
  };

  return (
    <div className="settings-page">
      <Header/>
      <br />
      <br />
      <h1>Settings</h1>

      {/* Verification Section */}
      <div className="setting-item">
        <h3>Apply for Verification</h3>
        <p>
          Get a verification badge to let others know you are a verified user.
        </p>
        <button
          className="apply-verification-btn"
          onClick={handleApplyVerification}
        >
          {verificationStatus === "Pending"
            ? "Verification Pending"
            : "Apply for Verification"}
        </button>
      </div>

      {/* Contact Info Update Section */}
      <div className="setting-item">
        <h3>Update Contact Info</h3>
        <label>Contact Number:</label> {/* ✅ Fixed to match API */}
        <input
          type="text"
          placeholder="Enter new contact number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        <label>Address:</label>
        <input
          type="text"
          placeholder="Enter new address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="update-info-btn" onClick={handleUpdateInfo}>
          Update Info
        </button>
      </div>

      {/* Delete Account Section */}
      <div className="setting-item">
        <h3>Delete Account</h3>
        <p>Permanently delete your account. This action cannot be undone.</p>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

      {/* Logout Section */}
      <div className="setting-item">
        <h3>Log Out</h3>
        <p>Log out from your account securely.</p>
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
