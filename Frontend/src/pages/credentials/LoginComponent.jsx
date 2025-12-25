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
          `${apiBaseUrl}/users/refresh`,
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
  toast.warn("Session expired. Please login again.");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
}
    };

    autoLogin();
  }, []);

const login = async () => {
  try {
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both Email and Password");
      return;
    }

    const response = await axios.post(`${apiBaseUrl}/users/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    const {
      id: userId,
      username,
      token,
      refreshToken,
      points = 0,     // 👈 fallback
      rewardGiven,    // 👈 whether points rewarded today
    } = response.data;

    // Save tokens & details
    localStorage.setItem("Id", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("points", points);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    dispatch(setUserId(userId));

    // 🎯 Handle reward info
    if (rewardGiven) {
      toast.success(`Welcome back! 🎉 You earned 50 points. Total: ${points}`);
    } else {
      toast.info(`Welcome back ${username}! Your total points: ${points}`);
    }

    navigate("/home");
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error("Invalid credentials. Please try again.");
    } else if (err.response?.status === 404) {
      toast.error("User not found.");
    } else {
      toast.error("Login failed. Please check your connection.");
    }
    console.error("Login error:", err);
  }
};


  const handleGoogleLogin = async (credentialResponse) => {
  try {
    const googleToken = credentialResponse.credential;

    if (!googleToken) {
      toast.error("Google login failed. No token received.");
      return;
    }

    const response = await axios.post(`${apiBaseUrl}/users/google-login`, {
      token: googleToken,
    });

    const {
      id: userId,
      username,
      token,
      refreshToken,
      profilePic,
      points = 0,
      rewardGiven,
    } = response.data.user;

    localStorage.setItem("Id", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("points", points);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    dispatch(setUserId(userId));

    if (rewardGiven) {
      toast.success(`🎉 Google Login Successful! You earned 50 points. Total: ${points}`);
    } else {
      toast.info(`Google Login Successful! Welcome ${username}. Points: ${points}`);
    }

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
