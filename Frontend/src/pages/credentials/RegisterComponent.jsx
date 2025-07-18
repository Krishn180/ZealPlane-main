import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./RegisterComponent.scss";
import "/src/AboutCard/ModelStyle.css";
import logozp from "/src/assets/logoZP.png";
import { useDispatch } from "react-redux";
import { setUser, setUserId } from "../../store/userSlice";
import glogo from "/src/assets/Google__G__logo.svg.png";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterComponent({ showModal, handleClose }) {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(""); // State for OTP input
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent
  const [loading, setLoading] = useState(false); // State for button loading
  const dispatch = useDispatch();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    try {
      if (!credentials.email) {
        toast.error("Email is required to send OTP");
        return;
      }

      if (!isValidEmail(credentials.email)) {
        toast.error("Please enter a valid email format");
        return;
      }

      setLoading(true); // Start loading spinner
      const response = await axios.post(
        // `http://localhost:5000/api/users/register`,
        `https://api.comicplane.site/api/users/register`,
        {
          email: credentials.email,
        }
      );
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.message || "Failed to send OTP";
        if (err.response.status === 400) {
          toast.error("Invalid request. Please check your input.");
        } else if (err.response.status === 401) {
          toast.error("Unauthorized request. Please log in again.");
        } else if (err.response.status === 403) {
          toast.error("You are not allowed to perform this action.");
        } else if (err.response.status === 404) {
          toast.error("API endpoint not found.");
        } else if (err.response.status === 409) {
          toast.error("This email is already registered.");
        } else if (err.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error(
          "No response from the server. Check your internet connection."
        );
      } else {
        toast.error("An unexpected error occurred while sending OTP.");
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const register = async () => {
    try {
      if (
        !credentials.username ||
        !credentials.email ||
        !credentials.password ||
        !confirmPassword
      ) {
        toast.error("All fields are required");
        return;
      }

      if (credentials.username.includes(" ")) {
        toast.error("Username cannot contain spaces");
        return;
      }

      if (!isValidEmail(credentials.email)) {
        toast.error("Please enter a valid email format");
        return;
      }

      if (credentials.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      if (credentials.password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!otp) {
        toast.error("Please enter the OTP sent to your email");
        return;
      }

      // Verify OTP and register the user
      const response = await axios.post(
        `https://api.comicplane.site/api/users/register`,
        // `http://localhost:5000/api/users/register`,
        {
          ...credentials,
          otp,
        }
      );

      toast.success("Successfully registered");
      dispatch(setUser(response.data.user));
      navigate("/login");
      handleClose();
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message || "Registration failed";
        if (err.response.status === 400) {
          toast.error("Invalid input. Please check your data.");
        } else if (err.response.status === 401) {
          toast.error("Unauthorized request. Please log in again.");
        } else if (err.response.status === 403) {
          toast.error("You are not authorized to perform this action.");
        } else if (err.response.status === 404) {
          toast.error("Registration API endpoint not found.");
        } else if (err.response.status === 409) {
          toast.error("Email already exists. Please use a different email.");
        } else if (err.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error("No response from server. Check your network connection.");
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      console.log("Google Token:", googleToken);

      // Send the Google token to your backend for verification and login
      const response = await axios.post(
        // `http://localhost:5000/api/users/google-login`,
        `https://api.comicplane.site/api/users/google-login`,
        {
          token: googleToken,
        }
      );

      const {
        id: userId,
        username,
        token,
        refreshToken,
        profilePic,
      } = response.data.user;

      localStorage.setItem("Id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (profilePic) {
        localStorage.setItem("profilePic", profilePic);
      }

      dispatch(setUser(response.data.user));
      dispatch(setUserId(userId));
      toast.success("Successfully logged in with Google!");
      navigate("/home");
    } catch (err) {
      console.error("Error handling Google Sign-In:", err);
      if (err.response) {
        const errorMessage =
          err.response.data?.message || "Google Sign-in failed";
        if (err.response.status === 400) {
          toast.error("Invalid request. Try again.");
        } else if (err.response.status === 401) {
          toast.error("Google authentication failed. Please try again.");
        } else if (err.response.status === 403) {
          toast.error(
            "Access denied. You are not allowed to perform this action."
          );
        } else if (err.response.status === 404) {
          toast.error("Google login API endpoint not found.");
        } else if (err.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error("No response from server. Check your internet connection.");
      } else {
        toast.error("An unexpected error occurred during Google Sign-In.");
      }
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
      <div className="login-wrapper">
        <ToastContainer />
        <div className="login-wrapper-inner">
          <h1 className="heading">
            Whether You Draw or Just Love Comics — This Is Your New Home.
          </h1>

          <div className="auth-inputs">
            <input
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              type="text"
              className="common-input"
              placeholder="Your Unique Name"
            />
            <input
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              type="email"
              className="common-input"
              placeholder="Email"
            />
            <input
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              type="password"
              className="common-input"
              placeholder="Password (6 or more characters)"
            />
            <input
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              className="common-input"
              placeholder="Confirm Password"
            />
            {otpSent && (
              <input
                onChange={(event) => setOtp(event.target.value)}
                type="text"
                className="common-input"
                placeholder="Enter OTP"
              />
            )}
          </div>
          {!otpSent ? (
            <button onClick={sendOtp} className="login-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Send OTP"}
            </button>
          ) : (
            <button onClick={register} className="login-btn">
              Verify OTP & Join
            </button>
          )}
          <div className="google-btn-container">
            <p className="go-to-signup">
              Already on ZealPlane?{" "}
              <span className="join-now" onClick={() => navigate("/login")}>
                Sign in
              </span>
            </p>
          </div>
          <p className="go-to-signup">Or you can join through Google Login</p>
          <div className="google-btn-container">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleRegister(credentialResponse)
              }
              onError={() =>
                toast.error("Google Sign-in failed. Please try again.")
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
