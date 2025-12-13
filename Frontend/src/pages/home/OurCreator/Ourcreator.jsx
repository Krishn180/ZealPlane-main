import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Ourcreator.scss";
import a1 from "./man.jpg";
import a2 from "./stan.jpg";
import a3 from "./arat.jpeg";
import a4 from "./krishna.jpg";
import a5 from "./prnc.jpg";

const creators = [
  {
    name: "Aarti Prasad",
    description:
      "Arati Prasad is a full-stack developer and a banker. She excels in modern web technologies and financial management. Her diverse expertise allows her to thrive in both fields.",
    image: a3,
  },
  {
    name: "Krishna Kumar",
    description:
      "Krishna Kumar is a skilled engineer, as well as a talented artist and writer. His unique blend of technical expertise and creativity allows him to excel in both fields.",
    image: a4,
  },

  {
    name: "Prince",
    description:
      "Prince is a skilled website designer and a talented artist. He blends creativity with technical expertise to craft stunning designs. His work reflects both innovation and artistic flair.",
    image: a5,
  },
];

const MeetOurCreator = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
  };

  return (
    <div className="our-creator-section">
      {/* 🔒 Trusted Section */}
      <div className="trusted-section">
        <h2>Trusted by 10,000+ Readers Worldwide </h2>
        <p>
          <strong>10,000 readers</strong> have already joined our journey,
          exploring thought-provoking stories and engaging artwork. We proudly
          feature <strong>original content from verified publishers</strong>,
          ensuring every panel you read is authentic, inspiring, and one of a
          kind.
        </p>
        <p>
          Join a growing community that believes in creativity, trust, and the
          power of storytelling.
        </p>
      </div>

      <div className="container">
        <div className="title-box">
          <h1 className="headtag">Our Creators</h1>
        </div>
        <br />

        <br />
        <Slider {...settings}>
          {creators.map((creator, index) => (
            <div key={index} className="creator-card">
              <div className="mainbox">
                <div className="imagebox">
                  <img src={creator.image} alt={creator.name} />
                </div>
                <div className="discribox">
                  <h3>{creator.name}</h3>
                  <p>{creator.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MeetOurCreator;
