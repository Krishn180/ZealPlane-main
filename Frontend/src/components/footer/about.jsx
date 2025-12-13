import React from "react";
import "./About.scss";
import { FaSuperpowers, FaPenNib, FaUsers } from "react-icons/fa";
import background from "./../../assets/back.jpeg";
import Arti from "./../../assets/arat.jpeg";
import krishna from "./../../assets/krishna.jpg";
import Jayshree from "./../../assets/Jaishree.jpeg";
import Prince from "./../../assets/Prince.jpg";
import Navbar from "../../AboutCard/Navbar";
import Footer from "./Footer";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const team = [
    {
      name: "Krishna Kumar",
      role: "Founder & CEO",
      bio: "Krishna Kumar is a skilled engineer, as well as a talented artist and writer. His unique blend of technical expertise and creativity allows him to excel in both fields.",
      image: krishna,
    },
    {
      name: "Arati Prasad",
      role: "Founder & COO",
      bio: "Arati Prasad is a full-stack developer and a banker. She excels in modern web technologies and financial management. Her diverse expertise allows her to thrive in both fields.",
      image: Arti,
    },
    {
      name: "Jayshree",
      role: "Social Media Marketing Manager",
      bio: "Jayshree is the voice of ComicPlane on social media. She manages our online presence, builds engaging campaigns, and connects with fans across platforms to grow our vibrant community.",
      image: Jayshree,
    },
    {
      name: "Prince",
      role: "Content Delivery Manager",
      bio: "Prince ensures that ComicPlane’s content reaches readers seamlessly. He manages localization, oversees content delivery, and actively engages with users to enhance their overall experience on the platform.",
      image: Prince,
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 7000,
    responsive: [
      {
        breakpoint: 1024, // tablets & below
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="hero-banner">
          <img src={background} alt="Comic Book Art" className="banner-image" />
          <div className="hero-content">
            <h1>Welcome to ComicPlane</h1>
            <p>
              Dive into the multiverse of imagination—where stories come alive,
              and every panel speaks louder than words.
            </p>
            {/* <button className="hero-btn">Explore Comics</button> */}
          </div>
        </div>
        <section className="about-section">
          {/* <h2 style={{ fontStyle: "italic" }}> What is ComicPlane?</h2> */}
          <p style={{ textAlign: "start" }}>
            {/* ComicPlane is a vibrant community where creators and fans unite.
          Whether you're into action-packed superheroes or deep indie drama, we
          bring stories to life in bold, expressive panels. */}
            Welcome to ComicPlane! We are a vibrant community of comic book
            enthusiasts, where geeks can connect, discuss, read, and purchase
            comics. Our mission is to create a platform where comic lovers can
            discover new stories, support creators, and immerse themselves in
            the world of comics.
            <br />
            <br />
            Whether you're a long-time fan of superheroes or an avid reader of
            indie graphic novels, ComicPlane is the place to find new content,
            share your passion, and engage with others who share your love for
            comics. Our community is inclusive, supportive, and ready to
            celebrate the art of comic storytelling.
          </p>
        </section>
        <section className="features-section">
          <h2 style={{ color: "#ff5f57" }}>Why ComicPlane?</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <FaSuperpowers className="feature-icon" />
              <h3>Empowering Creators</h3>
              <p>
                Showcase your talent and get discovered by thousands of fans and
                creators.
              </p>
            </div>
            <div className="feature-card">
              <FaPenNib className="feature-icon" />
              <h3>Discover Stories</h3>
              <p>
                Access a wide range of comics across genres—from fantasy to
                thrillers.
              </p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Engaged Community</h3>
              <p>
                Join like-minded readers and creators in an active, inclusive
                space.
              </p>
            </div>
          </div>
        </section>
        <section className="story-section">
          <h2>Our Story</h2>
          <p>
            ComicPlane was founded in May 2023 with one simple goal: to create
            and grow a comic book geek community that fosters creativity,
            connection, and collaboration. We saw a need for a platform where
            comic lovers and creators could come together in one place, and we
            set out to build a welcoming, engaging, and accessible space for
            all. Our team is passionate about comics and aims to be a driving
            force in the evolution of comic book culture, offering a platform
            that allows creators to showcase their talents and engage with fans.
          </p>

          {/* <img
          src="your-image-path/founders.jpg"
          alt="Founders"
          className="founder-img"
        /> */}
        </section>
        <h3 className="team-heading">Meet Our Team</h3>
        <section className="team-section">
          <Slider {...sliderSettings}>
            {team.map((member, i) => (
              <div key={i} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h2>{member.name}</h2>
                  <p className="role">
                    <strong>{member.role}</strong>
                  </p>
                  <p className="bio-text">{member.bio}</p>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        {/* <section className="team-section">
        <div className="team-member">
          <div className="member-image">
            <img src={krishna} alt="Krishna Kumar" />
          </div>
          <div className="member-info">
            <h2>Krishna Kumar</h2>
            <p className="role">
              <strong>Founder & CEO</strong>
            </p>
            <p className="bio-text">
              Krishna Kumar is a skilled engineer, as well as a talented artist
              and writer. His unique blend of technical expertise and creativity
              allows him to excel in both fields.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="member-image">
            <img src={Arti} alt="Arati Prasad" />
          </div>
          <div className="member-info">
            <h2>Arati Prasad</h2>
            <p className="role">
              <strong>Founder & COO</strong>
            </p>
            <p className="bio-text">
              Arati Prasad is a full-stack developer and a banker. She excels in
              modern web technologies and financial management. Her diverse
              expertise allows her to thrive in both fields.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="member-image">
            <img src={Jayshree} alt="Jayshree" />
          </div>
          <div className="member-info">
            <h2>Jayshree</h2>
            <p className="role">
              <strong>Social Media Marketing Manager</strong>
            </p>
            <p className="bio-text">
              Jayshree is the voice of ComicPlane on social media. She manages
              our online presence, builds engaging campaigns, and connects with
              fans across platforms to grow our vibrant community.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="member-image">
            <img src={Prince} alt="Prince" />
          </div>
          <div className="member-info">
            <h2>Prince</h2>
            <p className="role">
              <strong>Content Delivery Manager</strong>
            </p>
            <p className="bio-text">
              Prince ensures that ComicPlane’s content reaches readers
              seamlessly. He manages localization, oversees content delivery,
              and actively engages with users to enhance their overall
              experience on the platform.
            </p>
          </div>
        </div>
      </section> */}

        <section className="cta-section">
          <h2>Join the ComicPlane Community</h2>
          <p>
            Whether you're a fan, creator, or artist, ComicPlane is the place
            for you. Join us today, connect with other like-minded individuals,
            and discover a world of exciting comics and creative expression!
          </p>

          {/* <button className="join-btn">Join ComicPlane</button> */}
        </section>
        <Footer />
      </div>
    </>
  );
};

export default About;
