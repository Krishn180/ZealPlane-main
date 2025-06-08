import React, { useState, useEffect } from "react";
import "./AboutCardStyle.css";
import growth from "../assets/aghori9.jpg";
import reflecting from "../assets/dehek-eng.jpg";
import god from "../assets/gameofdeath.jpg";
import bumba from "../assets/landingimage.jpg";
import Footer from "../components/footer/Footer";

const AboutCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const elementPosition = document
      .querySelector(".left-banka")
      .getBoundingClientRect().top;

    // Check if the element is in the viewport
    if (elementPosition <= window.innerHeight && elementPosition >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up the event listener
    };
  }, []);

  return (
    <>
      <div className="head-top" id="about">
        <hr
          style={{
            border: "0.1px solid #1d325f", // Thin border color
            boxShadow:
              "0px 0px 50px 20px rgba(46, 9, 54, 0.3), 0px 0px 100px 40px rgba(6, 25, 51, 0.2), 0px 0px 200px 80px rgba(5, 46, 33, 0.1)",
            width: "100%", // Full-width horizontal line
          }}
        />

        <div className="backa-comic-design">
          <div className="backa-comic-main">
            <div className="left-banka">
              <p
                className={`adventure-text ${isVisible ? "visible" : ""}`}
                style={{ fontSize: "16px", textAlign: "center" }}
              >
                ADVENTURE: DARK FANTASY: MARTIAL ARTS;
              </p>
              <h1
                className={`demon-slayer-title ${isVisible ? "visible" : ""}`}
                style={{ fontSize: "40px" }}
              >
                Immerse Yourself In
                <br />
                Our Vibrant Community
              </h1>
            </div>
            <div className="right-banka adventure-text">
              <p>
                <b>
                  <i>Engage with our Community</i>
                </b>{" "}
                by{" "}
                <b>
                  <i>Rating and Reviewing</i>
                </b>{" "}
                the latest comics,{" "}
                <b>
                  <i>Sharing your thoughts</i>
                </b>{" "}
                to help others Discover new Favorites,{" "}
                <b>
                  <i>Participating in lively forum discussions</i>
                </b>{" "}
                with fellow fans, and{" "}
                <b>
                  <i>testing your comic book knowledge</i>
                </b>{" "}
                through exciting
                <b>
                  <i>polls and quizzes!</i>
                </b>
              </p>
            </div>
          </div>

          {/* <div className="backa-image">
            <img src={bumba} alt="" />
          </div> */}
        </div>

        {/* <h1 className={`demon-slayer-title ${isVisible ? "visible" : ""}`}>
          Many Great Features
        </h1> */}
      </div>

      <div className="cardBox">
        <div className="card1">
          <img src={growth} alt="About feature" className="featureImage" />
        </div>
        <div className="card1">
          <img src={reflecting} alt="About feature" className="featureImage" />
        </div>
        <div className="card1">
          <img src={bumba} alt="About feature" className="featureImage" />
        </div>
        <div className="card1">
          <img src={god} alt="About feature" className="featureImage" />
        </div>
      </div>
    </>
  );
};

export default AboutCard;
