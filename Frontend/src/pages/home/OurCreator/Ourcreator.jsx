import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Ourcreator.scss";
import a1 from "./man.jpg";
import a2 from "./stan.jpg";
import a3 from "./arati.jpg";
import a4 from "./krishna.jpg";
import a5 from "./prince.jpeg";

const creators = [
  {
    name: "Krishna Kumar",
    description:
      "Krishna Kumar is a skilled engineer, as well as a talented artist and writer. His unique blend of technical expertise and creativity allows him to excel in both fields.",
    image: a4,
  },
  {
    name: "Aarti Prasad",
    description:
      "Arati Prasad is a full-stack developer and a banker. She excels in modern web technologies and financial management. Her diverse expertise allows her to thrive in both fields.",
    image: a3,
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
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
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
  );
};

export default MeetOurCreator;
