import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import HeroBanner from "./heroBanner/HeroBanner";
import AboutCard from "../../AboutCard/AboutCard";
import Ourcreator from "./OurCreator/Ourcreator";
import Section2 from "../../AboutCard/Section2";
import Navbar from "../../AboutCard/Navbar";
import LandingHeroSection from "../../AboutCard/LandingHeroSection";
import Curated from "./curated/Curated";
import SubmitForm from "../../AboutCard/SubmitForm";
import Footer from "../../components/footer/Footer";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setUserId } from "../../store/userAction";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Already logged in, no need to refresh
      navigate("/home");
      return;
    }

    const checkRefreshToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "https://api.comicplane.site/api/refresh-token",
          { refreshToken }
        );
        const { token, userId, username: directUsername, user } = response.data;
        const username = directUsername || user?.username || "Guest";

        localStorage.setItem("token", token);
        localStorage.setItem("Id", userId);
        localStorage.setItem("username", username);

        dispatch(setUserId(userId));
        navigate("/home");
      } catch (error) {
        // Token invalid or expired
        console.log("Refresh token invalid:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setLoading(false);
      }
    };

    checkRefreshToken();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {/* <HeroBanner /> */}
      <LandingHeroSection />

      {/* Inline SCSS for Responsive Curated Section */}
      <div
        style={{
          marginTop: "50px",
          position: "relative",
          zIndex: "2",

          // Responsive Styling
          "@media screen and (max-width: 850px)": {
            marginTop: "10px",
          },
          "@media screen and (max-width: 600px)": {
            marginTop: "20px",
          },
        }}
      >
        <Curated />
      </div>

      {/* <AboutCard /> */}

      <br />
      <br />
      <br />

      {/* <Section2 /> */}
      <Ourcreator />

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <AboutCard />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* <SubmitForm /> */}
      <br />
      <br />
      <br />
      {/* <OurPartners/> */}
      <Footer />
    </div>
  );
};

export default Landing;