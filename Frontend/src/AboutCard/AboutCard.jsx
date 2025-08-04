import React, { useState, useEffect } from "react";
import "./AboutCardStyle.scss";
import growth from "../assets/aghori9.jpg";
import reflecting from "../assets/dehek-eng.jpg";
import god from "../assets/gameofdeath.jpg";
import bumba from "../assets/landingimage.jpg";
import Footer from "../components/footer/Footer";

const AboutCard = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const elementPosition = document
      .querySelector(".about-left-section")
      .getBoundingClientRect().top;

    if (elementPosition <= window.innerHeight && elementPosition >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="about-header-section" id="about">
        <hr
          style={{
            border: "0.1px solid #1d325f",
            boxShadow:
              "0px 0px 50px 20px rgba(46, 9, 54, 0.3), 0px 0px 100px 40px rgba(6, 25, 51, 0.2), 0px 0px 200px 80px rgba(5, 46, 33, 0.1)",
            width: "100%",
          }}
        />

        <div className="about-comic-container">
          <div className="about-comic-content">
            <article className="about-left-section">
              <p
                className={`about-genre-text ${isVisible ? "visible" : ""}`}
                style={{ fontSize: "16px", textAlign: "center" }}
              >
                Adventure • Dark Fantasy • Martial Arts
              </p>
              <h1
                className={`about-title ${isVisible ? "visible" : ""}`}
                style={{ fontSize: "40px" }}
              >
                Immerse Yourself In
                <br />
                Our Vibrant Community
              </h1>
              <meta
                name="description"
                content="Discover and discuss dark fantasy comics, martial arts adventures, and original stories in our vibrant comic community."
              />
            </article>

            <article className="about-right-section">
              <p>
                <strong>
                  <i>Engage with our Community</i>
                </strong>{" "}
                by{" "}
                <strong>
                  <i>Rating and Reviewing</i>
                </strong>{" "}
                the latest comics,{" "}
                <strong>
                  <i>Sharing your thoughts</i>
                </strong>{" "}
                to help others discover new favorites,{" "}
                <strong>
                  <i>Participating in lively forum discussions</i>
                </strong>{" "}
                with fellow fans, and{" "}
                <strong>
                  <i>Testing your comic book knowledge</i>
                </strong>{" "}
                through exciting{" "}
                <strong>
                  <i>polls and quizzes!</i>
                </strong>
              </p>
              <p>
                Sign up today and explore exclusive indie comics, original series, and connect with a passionate fanbase that shares your love for storytelling.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-gallery-section" aria-label="Comic Showcase Gallery">
        <div className="about-gallery-card">
          <img
            src={growth}
            alt="Dark fantasy warrior character from ComicPlane universe"
            className="about-gallery-image"
          />
        </div>
        <div className="about-gallery-card">
          <img
            src={reflecting}
            alt="A reflective protagonist from ComicPlane exploring inner power"
            className="about-gallery-image"
          />
        </div>
        <div className="about-gallery-card">
          <img
            src={bumba}
            alt="Colorful comic poster featuring multiple heroes from ComicPlane"
            className="about-gallery-image"
          />
        </div>
        <div className="about-gallery-card">
          <img
            src={god}
            alt="An action-packed comic featuring a deadly tournament"
            className="about-gallery-image"
          />
        </div>
      </section>
    </>
  );
};

export default AboutCard;
