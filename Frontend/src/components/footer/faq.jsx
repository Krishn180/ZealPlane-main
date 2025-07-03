import React from "react";
import "./FAQ.scss"; // Make sure you create this SCSS file
import Navbar from "../../AboutCard/Navbar";

const FAQ = () => {
  return (
    <>
      <Navbar />
      <div className="faq-page">
        <h1>Frequently Asked Questions</h1>

        <div className="faq-item">
          <h3>What is Zealplane?</h3>
          <p>
            Zealplane is a leading platform that empowers creators, innovators,
            and communities to collaborate, share, and grow.
          </p>
        </div>

        <div className="faq-item">
          <h3>Is Zealplane free to use?</h3>
          <p>
            Yes, Zealplane offers a free version with access to core features.
            Premium plans are available for enhanced functionality.
          </p>
        </div>

        <div className="faq-item">
          <h3>How do I join the community?</h3>
          <p>
            You can join Zealplane by signing up with your email or connecting
            through your social media account.
          </p>
        </div>

        <div className="faq-item">
          <h3>Can I upload my own content?</h3>
          <p>
            Absolutely! Zealplane is designed to allow creators to share their
            projects, artwork, and ideas with the world.
          </p>
        </div>

        <div className="faq-item">
          <h3>How do I contact support?</h3>
          <p>
            You can reach out to our support team through the contact form
            available on our website or email us directly at
            support@zealplane.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default FAQ;
