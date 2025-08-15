import React from "react";
import {
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaRedditAlien,
  FaTelegramPlane,
  FaEnvelope,
  FaCopy,
  FaShareAlt,
} from "react-icons/fa";
import "./Share.scss";

const Share = ({ url, title, onClose }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard! 📋");
    });
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: "Check this out!",
          url: url,
        })
        .catch((err) => console.log("Sharing failed", err));
    } else {
      alert("Web Share API not supported in this browser.");
    }
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <button className="share-close" onClick={onClose}>
          ✖
        </button>
        <h3 className="share-title">Share this comic</h3>
        <div className="share-container">
          <button className="share-btn copy" onClick={handleCopy} title="Copy Link">
            <FaCopy size={20} />
          </button>

          <a
            className="share-btn whatsapp"
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>

          <a
            className="share-btn twitter"
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Twitter"
          >
            <FaTwitter size={20} />
          </a>

          <a
            className="share-btn facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Facebook"
          >
            <FaFacebook size={20} />
          </a>

          <a
            className="share-btn linkedin"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            className="share-btn reddit"
            href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Reddit"
          >
            <FaRedditAlien size={20} />
          </a>

          <a
            className="share-btn telegram"
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Telegram"
          >
            <FaTelegramPlane size={20} />
          </a>

          <a
            className="share-btn email"
            href={`mailto:?subject=${encodedTitle}&body=Check this out: ${encodedUrl}`}
            title="Share via Email"
          >
            <FaEnvelope size={20} />
          </a>

          <button
            className="share-btn native"
            onClick={handleWebShare}
            title="Native Share"
          >
            <FaShareAlt size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
