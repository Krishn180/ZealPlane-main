import React, { useState } from "react";
import "./EnquiryModal.scss";

const EnquiryModal = ({ isOpen, onClose, onSubmit, comicTitle }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, message });
    alert("Your enquiry has been sent!");
    setName("");
    setEmail("");
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="enquiry-modal-overlay">
      <div className="enquiry-modal">
        <button className="enquiry-close" onClick={onClose}>
          ✖
        </button>
        <h2 className="enquiry-title">
          Enquire about <span>{comicTitle}</span>
        </h2>
        <form onSubmit={handleSubmit} className="enquiry-form">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            required
          ></textarea>
          <button type="submit" className="enquiry-submit">
            Send Enquiry
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
