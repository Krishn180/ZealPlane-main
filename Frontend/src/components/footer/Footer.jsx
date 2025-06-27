// // Footer.js

// import React from "react";
// import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux"; // Import useDispatch from react-redux
// import { logoutUser } from "../../store/userAction"; // Import logoutUser action

// import ContentWrapper from "../contentWrapper/ContentWrapper";
// import LogOutImage from "../../assets/logout.png";
// import "./style.scss";

// const Footer = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch(); // Get dispatch function from useDispatch

//     const handleLogout = () => {
//         dispatch(logoutUser());
//         navigate("/login");
//     };

//     return (
//         <footer className="footer">
//             <ContentWrapper>
// <ul className="menuItems">
//     <li className="menuItem">Terms Of Use</li>
//     <li className="menuItem">Privacy-Policy</li>
//     <li className="menuItem">About</li>
//     <li className="menuItem">Blog</li>
//     <li className="menuItem">FAQ</li>
// </ul>
//                 <div className="infoText">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
//                     do eiusmod tempor incididunt ut labore et dolore magna
//                     aliqua. Ut enim ad minim veniam, quis nostrud exercitation
//                     ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                     Duis aute irure dolor in reprehenderit in voluptate velit
//                     esse cillum dolore eu fugiat nulla pariatur.
//                 </div>
//                 <div className="socialIcons">
//                     <span className="icon">
//                         <FaFacebookF />
//                     </span>
//                     <span className="icon">
//                         <FaInstagram />
//                     </span>
//                     <span className="icon">
//                         <FaTwitter />
//                     </span>
//                     <span className="icon">
//                         <FaLinkedin />
//                     </span>
//                     <span className="icon">
//                         <button className="logoutButton" onClick={handleLogout} style={{ borderRadius: '50%' }}>
//                             <img src={LogOutImage} alt="Log Out" className="logoutIcon" />
//                         </button>
//                     </span>
//                 </div>
//             </ContentWrapper>
//         </footer>
//     );
// };

// export default Footer;

// import React from "react";
// import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../store/userAction";
// import { Link } from "react-router-dom"; // Import Link for routing

// import LogoImage from "../../assets/logoZP.png"; // Your company logo image
// import "./style.scss";

// const Footer = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate("/login");
//   };

//   return (
//     <footer className="footer">
//       <div className="footerContainer">
//         {/* Logo & Brand Name */}
//         <div className="logoSection">
//           <img src={LogoImage} alt="Zealplane Logo" className="companyLogo" />
//           <span className="companyName">ZEALPLANE</span>
//         </div>

//         {/* Navigation Links */}
//         <ul className="menuItems">
//           <li className="menuItem">
//             <Link to="/terms-of-use">Terms Of Use</Link>
//           </li>
//           <li className="menuItem">
//             <Link to="/privacy-policy">Privacy Policy</Link>
//           </li>
//           <li className="menuItem">
//             <Link to="/about">About</Link> {/* Link to About Page */}
//           </li>
//           <li className="menuItem">
//             <Link to="/faq">FAQ</Link> {/* Link to FAQ Page */}
//           </li>
//           <li className="menuItem">Blog</li>
//         </ul>

//         {/* Social Media Icons */}
//         <div className="socialIcons">
//           <a
//             href="https://www.facebook.com/groups/683526374340078/?ref=share&mibextid=NSMWBT"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="icon facebook"
//           >
//             <FaFacebookF />
//           </a>
//           <a
//             href="https://chat.whatsapp.com/LyKc7CvcEL6KWf3XApw9p2"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="icon whatsapp"
//           >
//             <FaWhatsapp />
//           </a>
//           <a
//             href="https://x.com/plane38843"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="icon twitter"
//           >
//             <FaTwitter />
//           </a>
//           <a
//             href="https://www.linkedin.com/company/zealplane"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="icon linkedin"
//           >
//             <FaLinkedin />
//           </a>
//         </div>

//         {/* Footer Bottom */}
//         <div className="footerBottom">
//           <p>© {new Date().getFullYear()} Zealplane. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/userAction";
import LogoImage from "../../assets/logoZP.png";
import "./style.scss";

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Logo and Brand */}
        <div className="footer-brand">
          <img src={LogoImage} alt="Zealplane Logo" className="logo" />

          <span
            className="brand-name"
            style={{ color: "red", fontWeight: "900", fontSize: "18px" }}
          >
            ZEAL<span className="plane">PLANE</span>
          </span>
        </div>

        {/* Center: Links + Social */}
        <div className="middle">
          <div className="footer-links">
  <a href="#">Terms of Use</a>
  <a href="#">Privacy Policy</a>
  <span onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
    About
  </span>
  <a href="#">Blog</a>
  <span onClick={() => navigate("/faq")} style={{ cursor: "pointer" }}>
    FAQ
  </span>
</div>


          <div className="footer-socials">
            <a
              href="https://www.facebook.com/groups/683526374340078/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://chat.whatsapp.com/LyKc7CvcEL6KWf3XApw9p2"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon whatsapp"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://x.com/plane38843"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Zealplane. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
