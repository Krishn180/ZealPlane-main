import React from "react";
import "./CongratsModal.scss";

const CongratsModal = ({ onClose }) => {
  return (
    <div className="congrats-overlay">
      <div className="congrats-modal">
        <h2>🎉 Congratulations!</h2>
        <p>You’ve officially joined <span className="brand">ZealPlane</span>!</p>
        <p className="sub-text">Here are your first badges for being an early explorer 🚀</p>

        <div className="badges">
          <div className="badge">🥇 Pioneer</div>
          <div className="badge">📚 Comic Enthusiast</div>
          <div className="badge">🌟 Early Supporter</div>
        </div>

        <p className="encouragement">
          Keep collecting badges as you read, post, and engage with the community!
        </p>

        <button className="login-btn" onClick={onClose}>
          🚀 Login & Start Exploring
        </button>
      </div>
    </div>
  );
};

export default CongratsModal;
