import React from "react";
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
import Trending from "./trending/Trending";
import Topics from "./curated/Topics";

const Landing = () => {
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
        <Topics/>
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
