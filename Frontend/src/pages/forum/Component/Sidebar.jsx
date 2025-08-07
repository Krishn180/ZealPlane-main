import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFire, FaStar } from "react-icons/fa";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* FEEDS SECTION */}
      <div className="sidebar-section">
        {/* <h3 className="section-title">Feeds</h3> */}
        <Link to="/home" className="sidebar-link">
          <FaHome className="icon" /> Home
        </Link>
        <Link to="/forum" className="sidebar-link">
          <FaHome className="icon" /> Forum
        </Link>
        <Link to="/news" className="sidebar-link">
          <FaStar className="icon" /> News
        </Link>
        <Link to="/popular" className="sidebar-link">
          <FaFire className="icon" /> Popular
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
