import React, { useState } from "react";
import "../AboutCard/NavbarStyle.css"; // Assuming the CSS file is named NavbarStyle.css
import logozp from "../assets/logoZP.png";
import Modal from "../AboutCard/Model";
import LoginComponent from "../pages/credentials/LoginComponent";
import RegisterComponent from "../pages/credentials/RegisterComponent";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  return (
    <div className="nav-top">
      {/* <div className="logo-img">
        <img src={logozp} alt="ZealPlane Logo" className="logo-img" />
        <span
          style={{
            color: "red",
            fontWeight: "900",
            fontSize: window.innerWidth <= 768 ? "17px" : "19px",
          }}
        >
          ZEAL<span className="plane">PLANE</span>
        </span>
      </div> */}
      <Link to="/" className="logo-img" style={{ textDecoration: "none" }}>
        <img src={logozp} alt="ZealPlane Logo" className="logo-img" />
        <span
          style={{
            color: "red",
            fontWeight: "900",
            fontSize: window.innerWidth <= 768 ? "17px" : "19px",
          }}
        >
          ZEAL<span className="plane">PLANE</span>
        </span>
      </Link>

      <div className="nav-menu">
        <button onClick={handleLoginClick} className="btn1">
          Login
        </button>
        <button onClick={handleRegisterClick} className="btn2">
          Join ZealPlane
        </button>
      </div>
      <Modal show={showLoginModal} handleClose={handleCloseLoginModal}>
        <LoginComponent />
      </Modal>
      <Modal show={showRegisterModal} handleClose={handleCloseRegisterModal}>
        <RegisterComponent />
      </Modal>
    </div>
  );
};

export default Navbar;
