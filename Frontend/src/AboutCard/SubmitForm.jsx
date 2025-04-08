import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./SubmitFormStyle.css";

const ComicSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    publication: "",
    comicBook: "",
    genre: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        service_5hz97nv, // Replace with your EmailJS Service ID
        template_sr9cq4e, // Replace with your EmailJS Template ID
        formData,
        "X0a8lKItKEBxCggnS" // Replace with your EmailJS User ID
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          setMessage("Thank you! Your submission has been sent.");
          setFormData({
            name: "",
            email: "",
            publication: "",
            comicBook: "",
            genre: "",
          });
        },
        (error) => {
          console.error("Error sending email:", error);
          setMessage("Failed to send submission. Please try again.");
        }
      );
  };

  return (
    <div className="form-container">
      <h2>Submit Your Comic</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Publication:</label>
        <input
          type="text"
          name="publication"
          value={formData.publication}
          onChange={handleChange}
          required
        />

        <label>Comic Book Title:</label>
        <input
          type="text"
          name="comicBook"
          value={formData.comicBook}
          onChange={handleChange}
          required
        />

        <label>Genre:</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ComicSubmissionForm;
