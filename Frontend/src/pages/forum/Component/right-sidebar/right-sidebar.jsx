import React from "react";
import "./right-sidebar.scss";

const CuratedSidebar = () => {
  return (
    <div className="curated-sidebar-container">
      <h3>🔥 Limited-Time Comic Fan Rewards! 🔥</h3>
      <ul className="curated-benefits-list">
        <li className="curated-post-item">
          🎁 <strong>FREE Comic Book Delivery</strong> for first-time registered users!
        </li>
        <li className="curated-post-item">
          🕹️ Get <strong>exclusive access</strong> to unreleased superhero stories and fan art!
        </li>
        <li className="curated-post-item">
          🏆 <strong>Win limited-edition collectibles</strong> just by signing up!
        </li>
        <li className="curated-post-item">
          💬 Join a <strong>private community</strong> of top comic creators and fans!
        </li>
        <li className="curated-post-item">
          🚨 Only for a few days! <strong>Register now</strong> and claim your perks!
        </li>
      </ul>
      <div className="register-now-button">
        <a href="/register" className="bold-register-button">
          👉 Click Here to Register & Claim Rewards!
        </a>
      </div>
    </div>
  );
};

export default CuratedSidebar;
