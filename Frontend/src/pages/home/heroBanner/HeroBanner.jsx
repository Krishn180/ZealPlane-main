// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import Img from "../../../components/lazyLoadImage/Img";
// import useFetch from "../../../hooks/useFetch";
// import { MdThumbUp, MdShare } from "react-icons/md";
// import { Modal } from "antd";
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   WhatsappShareButton,
//   RedditShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   LinkedinIcon,
//   WhatsappIcon,
//   RedditIcon,
// } from "react-share";
// import "./style.scss";
// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/pagination";
// import Anonimous from "../../../../public/anonymous-profile-silhouette-b714qekh29tu1anb.png";

// // TruncatedDescription Component
// const TruncatedDescription = ({ description, maxLength = 130 }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleReadMore = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className="description">
//       {isExpanded ? description : `${description.substring(0, maxLength)}..`}
//       {description.length > maxLength && (
//         <span className="readMore" onClick={toggleReadMore}>
//           {isExpanded ? " ." : " ..."}
//         </span>
//       )}
//     </div>
//   );
// };

// const HeroBanner = ({ selectedPosterUrl }) => {
//   const [datas, setDatas] = useState([]);
//   const [isShareModalVisible, setIsShareModalVisible] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const navigate = useNavigate(); // Hook for navigation
//   const { url } = useSelector((state) => state.home);
//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

//   // Shuffle the array to show projects randomly
//   const shuffleArray = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get(`${apiBaseUrl}/projects`);
//         console.log("response projects are:", res.data);

//         const validProjects = res.data.filter(
//           (project) =>
//             project.thumbnailImage && project.thumbnailImages.length > 0
//         );
//         console.log("project data is", validProjects); // Removed `.data` as `validProjects` is already the filtered array
//         setDatas(shuffleArray(validProjects)); // Shuffle the projects
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const onProfileClick = (uniqueId) => {
//     if (uniqueId) {
//       navigate(`/profile/${uniqueId}`);
//     } else {
//       alert("uniqueId not available");
//     }
//   };

//   const handleShareClick = (project) => {
//     setSelectedProject(project);
//     setIsShareModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsShareModalVisible(false);
//   };

//   // Handle Like Button Click
//   const handleLikeClick = (projectId) => {
//     setDatas((prevData) =>
//       prevData.map((project) =>
//         project.projectId === projectId
//           ? {
//               ...project,
//               likes: project.isLiked ? project.likes - 1 : project.likes + 1,
//               isLiked: !project.isLiked, // Toggle like state
//             }
//           : project
//       )
//     );
//   };

//   return (
//     <>
//       <div className="heroBanner">
//         <div className="overlayImageBox">
//           <Swiper
//             className="swiper-container"
//             style={{
//               "--swiper-navigation-color": "#fff",
//               "--swiper-pagination-color": "#fff",
//             }}
//             autoplay={{ delay: 5500, disableOnInteraction: false }}
//             pagination={{ clickable: true, dynamicBullets: true }}
//             navigation={true}
//             modules={[Autoplay, Pagination, Navigation]}
//             breakpoints={{
//               640: {
//                 slidesPerView: 1,
//                 spaceBetween: 10,
//               },
//               768: {
//                 slidesPerView: 1,
//                 spaceBetween: 20,
//               },
//               1024: {
//                 slidesPerView: 1,
//                 spaceBetween: 30,
//               },
//             }}
//           >
//             {datas.map((project) => (
//               <SwiperSlide key={project.projectId}>
//                 <div className="slideContent">
// <div className="imageWrapper">
//   <img
//     src={project.thumbnailImage}
//     alt={project.name}
//     onClick={() => navigate(`/details/${project.projectId}`)} // Navigate on image click
//     style={{ cursor: "pointer" }}
//   />
// </div>

//                   {/* Title and Description in a separate div */}
//                   <div className="titleDescriptionWrapper">
//                     <div className="title">{project.name}</div>
// <TruncatedDescription
//   description={project.description}
//   maxLength={window.innerWidth <= 768 ? 25 : 90}
// />
//                   </div>

//                   {/* Static Content with User Info and Icons */}
//                   <div className="staticContent">
//                     <div className="userInfo">
//                       {console.log(
//                         "profilePic for this project:",
//                         project.profilePic
//                       )}
// <img
//   className="profilePicture"
//   src={
//     project.profilePic ? project.profilePic : Anonimous
//   }
//   alt={project.username || "Anonymous User"}
//   onClick={() => onProfileClick(project.uniqueId)}
// />
//   <span
//     className="username"
//     onClick={() => onProfileClick(project.uniqueId)}
//   >
//     {project.username || "Anonymous User"}
//   </span>
// </div>

//   <div className="icons">
//     <MdThumbUp
//       className="icon"
//       style={{
//         color: project.isLiked ? "blue" : "white",
//       }}
//       onClick={() => handleLikeClick(project.projectId)}
//     />
//     <span className="likeCount">
//       {project.likes} {project.likes === 1 ? "Like" : "Likes"}
//     </span>
//     <MdShare
//       className="icon"
//       onClick={() => handleShareClick(project)}
//     />
//   </div>
// </div>
//           </div>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   </div>
// </div>

//       {/* Share Modal */}
//       {selectedProject && (
{
  /* <Modal
  title={<div className="modalTitle">Share {selectedProject.name}</div>}
  visible={isShareModalVisible}
  onCancel={handleCancel}
  footer={null}
  className="shareModal" // Add this class for styling
>
  <div className="shareOptions">
    <FacebookShareButton
      url={`${window.location.origin}/details/${selectedProject.projectId}`}
    >
      <FacebookIcon size={32} round />
    </FacebookShareButton>
    <TwitterShareButton
      url={`${window.location.origin}/details/${selectedProject.projectId}`}
    >
      <TwitterIcon size={32} round />
    </TwitterShareButton>
    <LinkedinShareButton
      url={`${window.location.origin}/details/${selectedProject.projectId}`}
    >
      <LinkedinIcon size={32} round />
    </LinkedinShareButton>
    <WhatsappShareButton
      url={`${window.location.origin}/details/${selectedProject.projectId}`}
    >
      <WhatsappIcon size={32} round />
    </WhatsappShareButton>
    <RedditShareButton
      url={`${window.location.origin}/details/${selectedProject.projectId}`}
    >
      <RedditIcon size={32} round />
    </RedditShareButton>
  </div>
</Modal> */
}
//       )}
//     </>
//   );
// };

// export default HeroBanner;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import Img from "../../../components/lazyLoadImage/Img";
// import useFetch from "../../../hooks/useFetch";
// import { MdThumbUp, MdShare } from "react-icons/md";
// import { Modal } from "antd";
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   WhatsappShareButton,
//   RedditShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   LinkedinIcon,
//   WhatsappIcon,
//   RedditIcon,
// } from "react-share";
// import "./style.scss";
// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/pagination";
// import Anonimous from "../../../../public/anonymous-profile-silhouette-b714qekh29tu1anb.png";

// // TruncatedDescription Component
// const TruncatedDescription = ({ description, maxLength = 130 }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleReadMore = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className="description">
//       {isExpanded ? description : `${description.substring(0, maxLength)}..`}
//       {description.length > maxLength && (
//         <span className="readMore" onClick={toggleReadMore}>
//           {isExpanded ? " ." : " ..."}
//         </span>
//       )}
//     </div>
//   );
// };

// const HeroBanner = ({ selectedPosterUrl }) => {
//   const [datas, setDatas] = useState([]);
//   const [isShareModalVisible, setIsShareModalVisible] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const navigate = useNavigate(); // Hook for navigation
//   const { url } = useSelector((state) => state.home);
//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

//   // Shuffle the array to show projects randomly
//   const shuffleArray = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get(`${apiBaseUrl}/projects`);
//         console.log("response projects are:", res.data);

//         const validProjects = res.data.filter(
//           (project) =>
//             project.thumbnailImage && project.thumbnailImages.length > 0
//         );
//         console.log("project data is", validProjects); // Removed `.data` as `validProjects` is already the filtered array
//         setDatas(shuffleArray(validProjects)); // Shuffle the projects
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const onProfileClick = (uniqueId) => {
//     if (uniqueId) {
//       navigate(`/profile/${uniqueId}`);
//     } else {
//       alert("uniqueId not available");
//     }
//   };

//   const handleShareClick = (project) => {
//     setSelectedProject(project);
//     setIsShareModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsShareModalVisible(false);
//   };

//   // Handle Like Button Click
//   const handleLikeClick = (projectId) => {
//     setDatas((prevData) =>
//       prevData.map((project) =>
//         project.projectId === projectId
//           ? {
//               ...project,
//               likes: project.isLiked ? project.likes - 1 : project.likes + 1,
//               isLiked: !project.isLiked, // Toggle like state
//             }
//           : project
//       )
//     );
//   };

//   return (
//     <>
//       <div className="heroBanner">
//         <div className="overlayImageBox">
//           <Swiper
//             className="swiper-container"
//             style={{
//               "--swiper-navigation-color": "#fff",
//               "--swiper-pagination-color": "#fff",
//             }}
//             autoplay={{ delay: 5500, disableOnInteraction: false }}
//             pagination={{ clickable: true, dynamicBullets: true }}
//             navigation={true}
//             modules={[Autoplay, Pagination, Navigation]}
//             centeredSlides={true} // Center active slide
//             slidesPerView={"auto"} // Dynamically adjust slide width
//             spaceBetween={30} // Space between slides
//             breakpoints={{
//               640: {
//                 slidesPerView: 1,
//                 spaceBetween: 10,
//               },
//               768: {
//                 slidesPerView: 1.5, // Adjust number of slides visible
//                 spaceBetween: 20,
//               },
//               1024: {
//                 slidesPerView: 2.5, // Adjust number of slides visible
//                 spaceBetween: 30,
//               },
//             }}
//           >
//             {datas.map((project) => (
//               <SwiperSlide key={project.projectId}>
//                 <div className="slideContent">
//                   <div className="imageWrapper">
//                     <img
//                       src={project.thumbnailImage}
//                       alt={project.name}
//                       onClick={() => navigate(`/details/${project.projectId}`)} // Navigate on image click
//                       style={{ cursor: "pointer" }}
//                     />
//                   </div>

//                   {/* Title and Description in a separate div */}
//                   <div className="titleDescriptionWrapper">
//                     <div className="title">{project.name}</div>
//                     <TruncatedDescription
//                       description={project.description}
//                       maxLength={window.innerWidth <= 768 ? 25 : 90}
//                     />
//                   </div>

//                   {/* Static Content with User Info and Icons */}
//                   <div className="staticContent">
//                     <div className="userInfo">
//                       {console.log(
//                         "profilePic for this project:",
//                         project.profilePic
//                       )}
//                       <img
//                         className="profilePicture"
//                         src={
//                           project.profilePic ? project.profilePic : Anonimous
//                         }
//                         alt={project.username || "Anonymous User"}
//                         onClick={() => onProfileClick(project.uniqueId)}
//                       />
//                       <span
//                         className="username"
//                         onClick={() => onProfileClick(project.uniqueId)}
//                       >
//                         {project.username || "Anonymous User"}
//                       </span>
//                     </div>

//                     <div className="icons">
//                       <MdThumbUp
//                         className="icon"
//                         style={{
//                           color: project.isLiked ? "blue" : "white",
//                         }}
//                         onClick={() => handleLikeClick(project.projectId)}
//                       />
//                       <span className="likeCount">
//                         {project.likes} {project.likes === 1 ? "Like" : "Likes"}
//                       </span>
//                       <MdShare
//                         className="icon"
//                         onClick={() => handleShareClick(project)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>

//       {/* Share Modal */}
//       {selectedProject && (
//         <Modal
//           title={<div className="modalTitle">Share {selectedProject.name}</div>}
//           visible={isShareModalVisible}
//           onCancel={handleCancel}
//           footer={null}
//           className="shareModal" // Add this class for styling
//         >
//           <div className="shareOptions">
//             <FacebookShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <FacebookIcon size={32} round />
//             </FacebookShareButton>
//             <TwitterShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <TwitterIcon size={32} round />
//             </TwitterShareButton>
//             <LinkedinShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <LinkedinIcon size={32} round />
//             </LinkedinShareButton>
//             <WhatsappShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <WhatsappIcon size={32} round />
//             </WhatsappShareButton>
//             <RedditShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <RedditIcon size={32} round />
//             </RedditShareButton>
//           </div>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default HeroBanner;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Autoplay,
  Pagination,
  Navigation,
} from "swiper/modules";
import Img from "../../../components/lazyLoadImage/Img";
import useFetch from "../../../hooks/useFetch";
import { MdThumbUp, MdShare } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { Modal } from "antd";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  RedditIcon,
} from "react-share";
import { useRef } from "react";

import "./style.scss";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import Anonimous from "../../../../public/anonymous-profile-silhouette-b714qekh29tu1anb.png";
import HeroBannerSkeleton from "./HeroBannerSkeleton";

const TruncatedDescription = ({ description, maxLength = 100 }) => {
  return (
    <div className="description">
      <span
        dangerouslySetInnerHTML={{
          __html:
            description.length > maxLength
              ? `${description.substring(0, maxLength)}..`
              : description,
        }}
      />
    </div>
  );
};

const HeroBanner = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [editorsPick, setEditorsPick] = useState([]);
  const [mostRecent, setMostRecent] = useState([]);
  const [mostTalked, setMostTalked] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const swiperWrappedRef = useRef(null);

  /* ===================== FETCH HERO BANNER DATA ===================== */
  useEffect(() => {
  const fetchHeroBanner = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/projects/hero-banner`);

      console.log("🔥 Hero Banner API Response:", res.data); // <-- log the response

      setEditorsPick(res.data.editorsPick || []);
      setMostRecent(res.data.mostRecent || []);
      setMostTalked(res.data.mostTalked || []);
    } catch (error) {
      console.error("Error fetching hero banner projects:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchHeroBanner();
}, []);

  /* ===================== HANDLERS ===================== */
  const onProfileClick = (uniqueId) => {
    if (uniqueId) {
      navigate(`/profile/${uniqueId}`);
    }
  };

  const handleShareClick = (project) => {
    setSelectedProject(project);
    setIsShareModalVisible(true);
  };

  const handleCancel = () => {
    setIsShareModalVisible(false);
  };

  const handleLikeClick = (projectId, setter) => {
    setter((prev) =>
      prev.map((project) =>
        project.projectId === projectId
          ? {
              ...project,
              likes: project.isLiked ? project.likes - 1 : project.likes + 1,
              isLiked: !project.isLiked,
            }
          : project
      )
    );
  };

  /* ===================== REUSABLE SWIPER ===================== */
  const renderHeroRow = (title, projects, setter) => {
    if (!projects || projects.length === 0) return null;

    return (
      <div className="hero-row">
        <h2 className="hero-row-title">{title}</h2>

        <Swiper
          className="theater-swiper"
          grabCursor
          centeredSlides
          navigation={{
            nextEl: ".custom-swiper-button-next",
            prevEl: ".custom-swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          }}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={800}
          modules={[Pagination, Navigation, Autoplay]}
          onSwiper={(swiper) => {
            swiperWrappedRef.current = swiper.wrapperEl;
          }}
        >
          {projects.map((project) => (
            <SwiperSlide key={project.projectId}>
              <div className="slide-wrapper-top">
                <div
                  className="slide-bg"
                  style={{
                    backgroundImage: `url(${project.thumbnailImage})`,
                  }}
                  onClick={() =>
                    navigate(`/details/${project.projectId}`)
                  }
                />

                <img
                  src={project.thumbnailImage}
                  alt={project.name}
                  className="slide-img"
                  onClick={() =>
                    navigate(`/details/${project.projectId}`)
                  }
                />

                <div className="content-slider">
                  <h1
                    className="title-slider"
                    onClick={() =>
                      navigate(`/details/${project.projectId}`)
                    }
                  >
                    {project.name}
                  </h1>

                  <div
                    className="description-slider"
                    onClick={() =>
                      navigate(`/details/${project.projectId}`)
                    }
                  >
                    <TruncatedDescription
                      description={project.description}
                    />
                  </div>

                  <div className="avtar-username">
                    <div className="avtar-photo">
                      <img
                        src={project.profilePic || Anonimous}
                        className="avatar"
                        onClick={() =>
                          onProfileClick(project.uniqueId)
                        }
                      />
                      <span
                        onClick={() =>
                          onProfileClick(project.uniqueId)
                        }
                      >
                        {project.username || "Anonymous User"}
                      </span>
                    </div>

                    <div className="icon-group">
                      <FaHeart
                        className="heart-icon"
                        style={{
                          color: project.isLiked ? "red" : "white",
                        }}
                        onClick={() =>
                          handleLikeClick(project.projectId, setter)
                        }
                      />
                      <span>{project.likes}</span>

                      <MdShare
                        onClick={() =>
                          handleShareClick(project)
                        }
                      />

                      <button
                        className="read"
                        onClick={() =>
                          navigate(`/details/${project.projectId}`)
                        }
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="swiper-slider-container">
      {loading ? (
        <HeroBannerSkeleton />
      ) : (
        <>
          {renderHeroRow("Editor's Pick", editorsPick, setEditorsPick)}
          {renderHeroRow("Most Recent", mostRecent, setMostRecent)}
          {renderHeroRow("Most Discussed", mostTalked, setMostTalked)}

          <div className="custom-swiper-button-prev">&#8592;</div>
          <div className="custom-swiper-button-next">&#8594;</div>

          {selectedProject && (
            <Modal
              title={
                <div className="modalTitle">
                  Share {selectedProject.name}
                </div>
              }
              open={isShareModalVisible}
              onCancel={handleCancel}
              footer={null}
              className="shareModal"
            >
              <div className="shareOptions">
                <FacebookShareButton
                  url={`${window.location.origin}/details/${selectedProject.projectId}`}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>

                <TwitterShareButton
                  url={`${window.location.origin}/details/${selectedProject.projectId}`}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>

                <LinkedinShareButton
                  url={`${window.location.origin}/details/${selectedProject.projectId}`}
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>

                <WhatsappShareButton
                  url={`${window.location.origin}/details/${selectedProject.projectId}`}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>

                <RedditShareButton
                  url={`${window.location.origin}/details/${selectedProject.projectId}`}
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default HeroBanner;
