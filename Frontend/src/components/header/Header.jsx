import React, { useState, useEffect } from "react";
import { FaUsers, FaPlus } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import avatar from "../../assets/avatar.png";
import axiosInstance from "../../Auth/Axios";
import Searchbar from "./Searchbar";
import Navbar from "../../AboutCard/Navbar";
import Logout from "./logout/Logout";
import logozp from "/src/assets/logoZP.png";
import HeaderNotificationBell from "../Notification/NotificationBell";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;
  const [userName, setUserName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (token && userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `${apiBaseUrl}/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("User data fetched for header:", response.data.user);
          setUserName(response.data.user.username);
          setProfilePic(response.data.user.profilePic || avatar);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [token, userId]);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const handleProfileClick = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  const handleVisitProfile = () => {
    navigate(`/profile/${userId}`);
    setShowProfileOptions(false);
  };

  const handleForumClick = () => {
    navigate("/forum");
  };
  const handleNewsClick = () => {
  navigate("/news"); // Navigate to the News page
};


  if (!token) {
    return <Navbar />;
  }

  return (
    <>
      <header
        className={`header1 ${show}`}
        style={{
          position: "fixed",
          background: "rgba(0, 0, 0, 0.4)",
          width: "100%",
        }}
      >
        <ContentWrapper>
          <div className="logo" onClick={() => navigate("/home")}>
            <img src={logozp} alt="Logo" />
            <span
              className="logo-text"
              style={{ color: "red", fontWeight: "900", fontSize: "18px" }}
            >
              ZEAL<span className="plane">PLANE</span>
            </span>
          </div>
          <Searchbar axiosInstance={axiosInstance} />

         <ul className="menuItems">

            <li className="menuItem2" onClick={() => navigate("/dashboard")}>
    {window.innerWidth <= 568 ? (
      <div className="iconWrapper">
        <span className="hoverText">Dashboard</span>
      </div>
    ) : (
      "Dashboard"
    )}
  </li>

  <li className="menuItem2" onClick={handleForumClick}>
    {window.innerWidth <= 568 ? (
      <div className="iconWrapper">
        <FaUsers className="communityIcon" />
        <span className="hoverText">Communities</span>
      </div>
    ) : (
      "Communities"
    )}
  </li>


  {/* Plus Icon for Modal */}
  <li
    className="menuItem1"
    style={{ color: "white", cursor: "pointer" }}
    onClick={() => setShowModal(true)}
  >
    <FaPlus />
  </li>

  {/* Notification Bell Component */}
  <li className="menuItem1">
    < HeaderNotificationBell/>
  </li>

  {/* Profile Section */}
  <li
    className="menuItem1 profile-container"
    onMouseEnter={() => setShowProfileOptions(true)}
    onMouseLeave={() => setShowProfileOptions(false)}
  >
    <img
      src={profilePic || avatar}
      alt="Profile"
      className="avatarImage"
      onClick={handleProfileClick}
    />
    {userName && (
      <span className="username" onClick={handleProfileClick}>
        {userName}
      </span>
    )}
    {showProfileOptions && (
      <div className={`profile-options ${showProfileOptions ? "active" : ""}`}>
        <ul>
          <li onClick={handleVisitProfile}>Profile</li>
          <hr />
          <li>
            <Logout />
          </li>
          <li onClick={() => navigate("/settings")}>
            <FiSettings className="header-icon" /> Settings
          </li>
        </ul>
      </div>
    )}
  </li>
</ul>
        </ContentWrapper>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h2>What do you want to do?</h2>
            <button onClick={() => navigate(`/profile/${userId}`)}>
              Add Project
            </button>
            <button onClick={() => navigate("/forum/create-post")}>
              Make a Post
            </button>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
