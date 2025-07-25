// import React from "react";
// import "./About.scss"; // Make sure the SCSS file is properly linked for styling
// import { FaSuperpowers, FaPenNib, FaUsers } from "react-icons/fa"; // Icons for each section
// import background from "./../../assets/man-stands-front-planet-with-colorfu.avif";
// import Arti from "./../../assets/arati.jpg";

// const About = () => {
//   return (
//     <div className="about-page">
//         <br/>
//       <h1>About ComicPlane</h1>
//       <p>Welcome to ComicPlane! We are a vibrant community of comic book enthusiasts, where geeks can connect, discuss, read, and purchase comics. Our mission is to create a platform where comic lovers can discover new stories, support creators, and immerse themselves in the world of comics.</p>

//       <div className="about-image">
//         <img src={background} alt="Comic Book Art" />
//       </div>

//       <p>Whether you're a long-time fan of superheroes or an avid reader of indie graphic novels, ComicPlane is the place to find new content, share your passion, and engage with others who share your love for comics. Our community is inclusive, supportive, and ready to celebrate the art of comic storytelling.</p>

//       <p>Join us on this journey to make comics more accessible, enjoyable, and engaging for everyone!</p>

//       <h2>Why ComicPlane?</h2>
//       <div className="reason-cards">
//         <div className="reason-card">
//           <FaSuperpowers className="icon" />
//           <h3>Empowering Creators</h3>
//           <p>ComicPlane provides a platform for creators to showcase their work, get noticed, and engage with a community of passionate fans.</p>
//         </div>
//         <div className="reason-card">
//           <FaPenNib className="icon" />
//           <h3>Discover New Stories</h3>
//           <p>Whether you're into superheroes or indie comics, we offer a wide range of content for comic fans to explore and enjoy.</p>
//         </div>
//         <div className="reason-card">
//           <FaUsers className="icon" />
//           <h3>Join the Community</h3>
//           <p>Connect with fellow comic geeks, discuss your favorite stories, and share your love for comics in an inclusive and supportive environment.</p>
//         </div>
//       </div>

//       <h2>Our Story</h2>
//       <p>ComicPlane was founded in May 2023 with one simple goal: to create and grow a comic book geek community that fosters creativity, connection, and collaboration. We saw a need for a platform where comic lovers and creators could come together in one place, and we set out to build a welcoming, engaging, and accessible space for all. Our team is passionate about comics and aims to be a driving force in the evolution of comic book culture, offering a platform that allows creators to showcase their talents and engage with fans.</p>

//       <div className="founders-section">
//         <img src="your-image-path/founders.jpg" alt="ComicPlane Founders" className="founder-img" />
//         <p><strong>Founded in May 2023</strong>, we are a team of comic enthusiasts and creators determined to bring people together through the power of comics!</p>
//       </div>

//       <h2>Meet Our Team</h2>
//       <p>Our team is made up of passionate comic fans and creators who work tirelessly to make ComicPlane the best place for comic lovers. We are not just administrators – we are comic readers, writers, and artists ourselves! Each member of our team brings a unique perspective to the platform, and together, we’re building a community that celebrates the art of comic storytelling.</p>

//       <div className="team-section">
//         <div className="team-member">
//           <img src="your-image-path/member1.jpg" alt="Team Member 1" className="team-avatar" />
//           <h3>Krishna Kumar</h3>
//           <p>Founder & CEO</p>
//           <span className="badge">Comic Enthusiast</span>
//         </div>
//         <div className="team-member">
//           <img src={Arti} alt="Team Member 2" className="team-avatar" />
//           <h3>Arati Prasad</h3>
//           <p>Co-Founder & Community Manager</p>
//           <span className="badge">Artist & Writer</span>
//         </div>
//       </div>

//       <h2>Join the ComicPlane Community</h2>
//       <p>Whether you're a fan, creator, or artist, ComicPlane is the place for you. Join us today, connect with other like-minded individuals, and discover a world of exciting comics and creative expression!</p>

//       <div className="cta-section">
//         <button className="join-btn">Join Now</button>
//       </div>
//     </div>
//   );
// };

// export default About;

import React from "react";
import "./About.scss";
import { FaSuperpowers, FaPenNib, FaUsers } from "react-icons/fa";
import background from "./../../assets/back.jpeg";
import Arti from "./../../assets/arati.jpg";
import krishna from "./../../assets/krishna.jpg";
import Navbar from "../../AboutCard/Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
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
          discover new stories, support creators, and immerse themselves in the
          world of comics.
          <br />
          <br />
          Whether you're a long-time fan of superheroes or an avid reader of
          indie graphic novels, ComicPlane is the place to find new content,
          share your passion, and engage with others who share your love for
          comics. Our community is inclusive, supportive, and ready to celebrate
          the art of comic storytelling.
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
          ComicPlane was founded in May 2023 with one simple goal: to create and
          grow a comic book geek community that fosters creativity, connection,
          and collaboration. We saw a need for a platform where comic lovers and
          creators could come together in one place, and we set out to build a
          welcoming, engaging, and accessible space for all. Our team is
          passionate about comics and aims to be a driving force in the
          evolution of comic book culture, offering a platform that allows
          creators to showcase their talents and engage with fans.
        </p>

        {/* <img
          src="your-image-path/founders.jpg"
          alt="Founders"
          className="founder-img"
        /> */}
      </section>
      {/* <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={krishna} alt="Krishna Kumar" className="team-avatar" />
            <div className="info">
              <h3>Krishna Kumar</h3>
              <p>Founder & CEO</p>
              <span className="badge">Comic Enthusiast</span>
            </div>
          </div>
          <div className="team-member">
            <img src={Arti} alt="Arati Prasad" className="team-avatar" />
            <div className="info">
              <h3>Arati Prasad</h3>
              <p>Co-Founder & Community Manager</p>
              <span className="badge">Artist & Writer</span>
            </div>
          </div>
        </div>
      </section> */}
      <h3 style={{ textAlign: "center", fontSize: "35px" }}> Meet Our Team</h3>{" "}
      <section className="team-section">
        <div className="team-member">
          <div className="member-image">
            <img src={krishna} alt="Rahul Sharma" />
          </div>
          <div className="member-info">
            <h2>Krishna Kumar</h2>
            <p>
              <strong>Founder & CEO</strong>
            </p>
            <br />
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
            <p>
              <strong>Founder & COO</strong>
            </p>
            <br />
            <p className="bio-text">
              {" "}
              Arati Prasad is a full-stack developer and a banker. She excels in
              modern web technologies and financial management. Her diverse
              expertise allows her to thrive in both fields.
            </p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <h2>Join the ComicPlane Community</h2>
        <p>
          Whether you're a fan, creator, or artist, ComicPlane is the place for
          you. Join us today, connect with other like-minded individuals, and
          discover a world of exciting comics and creative expression!
        </p>

        <button className="join-btn">Join ComicPlane</button>
      </section>
      <Footer />
    </div>
  );
};

export default About;
