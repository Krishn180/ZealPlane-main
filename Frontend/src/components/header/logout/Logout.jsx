// src/components/Logout.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import "../style.scss";

const Logout = ({ onLogoutComplete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear(); // Clears everything stored in localStorage

    console.log("All localStorage items cleared.");

    // Reset any Redux states if required (example: user state)
    dispatch({ type: "RESET_USER_STATE" }); // Replace with your action to reset user state in Redux

    // Notify parent component if needed
    if (onLogoutComplete) {
      onLogoutComplete();
    }

    // Redirect the user to the login page
    navigate("/");
  };

  return (
    <div onClick={handleLogout} className="logout-item">
      <CiLogout className="header-icon" />
      Logout
    </div>
  );
};

export default Logout;
