import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import logozp from "/src/assets/logoZP.png";
import "./ForgotPassword.scss";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/users/send-otp`, {
        email,
      });

      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Error sending OTP. Try again.");
      console.error("Error:", error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/users/verify-otp`, {
        email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password successfully updated!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Error resetting password.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="logo-img">
        <img src={logozp} alt="ZealPlane Logo" className="logo-img" />
        <span style={{ color: "red", fontWeight: "900", fontSize: "19px" }}>
          ZEALPLANE
        </span>
      </div>

      <div className="forgot-password-wrapper-comic">
        <h1 className="comic-heading">🦸 Reset Your Secret Identity</h1>
        <p className="comic-subtext">
          We’ll send a one-time code to your inbox.
        </p>

        {!otpSent ? (
          <form
            className="forgot-password-form-comic"
            onSubmit={handleEmailSubmit}
          >
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g., clark@dailyplanet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="comic-btn">
              ✉️ Send OTP
            </button>
          </form>
        ) : (
          <form
            className="forgot-password-form-comic"
            onSubmit={handlePasswordReset}
          >
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter the code from email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="comic-btn">
              ⚡ Update Password
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default ForgotPassword;
