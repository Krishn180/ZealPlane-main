import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import logozp from "/src/assets/logoZP.png";
import { useDispatch } from "react-redux";
import { setUserId } from "../../store/userAction";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginComponent() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // added this code for autologin

  useEffect(() => {
    const autoLogin = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) return;

      try {
        const response = await axios.post(
          "https://api.comicplane.site/api/users/refresh",
          { refreshToken }
        );

        const { token, userId, username } = response.data;

        // Save new token
        localStorage.setItem("token", token);
        localStorage.setItem("Id", userId);
        localStorage.setItem("username", username);

        dispatch(setUserId(userId));
        navigate("/home");
      } catch (err) {
        console.log("Auto-login failed:", err);
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
      }
    };

    autoLogin();
  }, []);

  const login = async () => {
    try {
      toast.success("Signed In to ZealPlane!");

      const response = await axios.post(
        `${apiBaseUrl}/users/login`,
        // `http://localhost:5000/api/users/login`,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      console.log("Response Data after logging in:", response.data);

      const { id: userId, username, token, refreshToken } = response.data;

      // Store tokens and user details
      localStorage.setItem("Id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        console.log("Refresh Token received and saved:", refreshToken);
      } else {
        console.warn("No refresh token received in the response.");
      }

      dispatch(setUserId(userId));
      navigate("/home");
    } catch (err) {
      console.log("Login error:", err);
      toast.error("Please Check your Credentials");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      console.log("Google Token:", googleToken);

      // Send the Google token to your backend for verification
      const response = await axios.post(`${apiBaseUrl}/users/google-login`, {
        token: googleToken,
      });

      console.log(
        "Response Data from backend after Google login:",
        response.data
      );

      // Extract user details from the backend response
      const {
        id: userId,
        username,
        token,
        refreshToken,
        profilePic,
      } = response.data.user;

      // Store tokens and user details in localStorage
      localStorage.setItem("Id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      localStorage.setItem("profilePic", profilePic); // Store profilePic

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        console.log("Refresh Token received and saved:", refreshToken);
      } else {
        console.warn("No refresh token received in the response.");
      }

      // Dispatch user ID to Redux
      dispatch(setUserId(userId));
      toast.success("Google Sign-in Successful!");

      // Redirect to the home page
      navigate("/home");
    } catch (err) {
      console.error("Google Login error:", err);
      toast.error("Google Sign-in failed. Please try again.");
    }
  };

  const handleJoinNowClick = () => {
    navigate("/register"); // Redirect to the registration page
  };

  return (
    <>
      {/* <div className="logo-img">
        <img src={logozp} alt="ZealPlane Logo" className="logo-img" />
        <span style={{ color: "red", fontWeight: "900", fontSize: "19px" }}>
          ZEALPLANE
        </span>
      </div> */}
      <div className="login-wrapper">
        <ToastContainer />
        <div className="login-wrapper-inner">
          <h1 className="heading">Sign in</h1>
          <p className="sub-heading">Stay updated on your professional world</p>

          <div className="auth-inputs">
          <input
  onChange={(event) =>
    setCredentials({ ...credentials, email: event.target.value })
  }
  type="email"
  name="email"
  autoComplete="username"
  className="common-input"
  placeholder="Email"
  value={credentials.email}
/>

<div className="password-input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    autoComplete="current-password"
    className="common-input password-input"
    placeholder="Password"
    value={credentials.password}
    onChange={(event) =>
      setCredentials({
        ...credentials,
        password: event.target.value,
      })
    }
  />
  <button
    type="button"
    className="toggle-password-visibility"
    onClick={handlePasswordVisibility}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

            <div className="forgot-password-container">
              <span
                className="forgot-password-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>
          </div>

          <button onClick={login} className="login-btn">
            Sign in
          </button>
          <div>Or</div>
          <div className="google-btn-container">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleLogin(credentialResponse)
              }
              onError={() =>
                toast.error("Google Sign-in failed. Please try again.")
              }
            />
          </div>
          <button onClick={handleJoinNowClick} className="join-now-btn">
            Join now
          </button>
        </div>
      </div>
    </>
  );
}
