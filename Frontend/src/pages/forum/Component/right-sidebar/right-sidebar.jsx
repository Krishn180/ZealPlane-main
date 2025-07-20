import React from "react";
import { FaGift, FaStar, FaUserPlus } from "react-icons/fa";
import "./right-sidebar.scss";

const CuratedSidebar = () => {
  return (
    <div className="curated-sidebar-container">
      <h3>🎁 Win Free Comic Books!</h3>
      <p>
        Register now to enter our exclusive <strong>monthly giveaway</strong>!
        First-time users stand a chance to get <strong>free physical comic copies</strong> delivered to their door!
      </p>
      <ul className="curated-benefits-list">
        <li><FaGift /> Monthly Comic Drops</li>
        <li><FaStar /> Exclusive Access to Collector Editions</li>
        <li><FaUserPlus /> Showcase or Sell Your Own Comics</li>
      </ul>
      <div className="register-now-button">
        <a href="/register" className="bold-register-button">
          Claim Your Gift Now 🚀
        </a>
      </div>
    </div>
  );
};

export default CuratedSidebar;
