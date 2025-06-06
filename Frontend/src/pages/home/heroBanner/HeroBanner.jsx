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

// // TruncatedDescription Component
// const TruncatedDescription = ({ description, maxLength = 100 }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleReadMore = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className="description">
//       <span
//         dangerouslySetInnerHTML={{
//           __html: isExpanded
//             ? description
//             : `${description.substring(0, maxLength)}..`,
//         }}
//       />
//       {description.length > maxLength && (
//         <span className="readMore" onClick={toggleReadMore}>
//           {isExpanded ? "" : ""}
//         </span>
//       )}
//     </div>
//   );
// };

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

const HeroBanner = ({ selectedPosterUrl }) => {
  const [datas, setDatas] = useState([]);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const { url } = useSelector((state) => state.home);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const swiperRef = useRef(null);

  // Shuffle the array to show projects randomly
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        console.log("response projects are:", res.data);

        const validProjects = res.data.filter(
          (project) =>
            project.thumbnailImage && project.thumbnailImages.length > 0
        );
        console.log("project data is", validProjects); // Removed `.data` as `validProjects` is already the filtered array
        setDatas(shuffleArray(validProjects)); // Shuffle the projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const onProfileClick = (uniqueId) => {
    if (uniqueId) {
      navigate(`/profile/${uniqueId}`);
    } else {
      alert("uniqueId not available");
    }
  };

  const handleShareClick = (project) => {
    setSelectedProject(project);
    setIsShareModalVisible(true);
  };

  const handleCancel = () => {
    setIsShareModalVisible(false);
  };

  // Handle Like Button Click
  const handleLikeClick = (projectId) => {
    setDatas((prevData) =>
      prevData.map((project) =>
        project.projectId === projectId
          ? {
              ...project,
              likes: project.isLiked ? project.likes - 1 : project.likes + 1,
              isLiked: !project.isLiked, // Toggle like state
            }
          : project
      )
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "95vh",
        position: "relative",
      }}
    >
      <div
        className="swiper-button-prev"
        style={{ position: "absolute", left: "20px", zIndex: 10 }}
      ></div>
      <div
        className="swiper-button-next"
        style={{ position: "absolute", right: "20px", zIndex: 10 }}
      ></div>

      <Swiper
        key={datas.length}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={window.innerWidth <= 1124 ? 1 : 3}
        spaceBetween={window.innerWidth <= 768 ? 10 : -40}
        coverflowEffect={{
          rotate: 15,
          stretch: 80,
          depth: 300,
          modifier: 1,
          slideShadows: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 5,
          bulletActiveClass: "active-pagination",
        }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={1000}
        observer={true} // ✅ Observe changes
        observeParents={true} // ✅ Observe parent changes
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        style={{ width: "90%", position: "relative" }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onMouseEnter={() => {
          if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.stop();
          }
        }}
        onMouseLeave={() => {
          if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.start();
          }
        }}
      >
        {datas.map((project) => (
          <SwiperSlide key={project.projectId} className="swiper-slide-custom">
            <div className="slide-container">
              {/* Image */}
              <img
                src={project.thumbnailImage}
                alt={project.name}
                onClick={() => navigate(`/details/${project.projectId}`)}
                className="slide-image"
              />

              {/* Overlay */}
              <div
                className="slide-overlay"
                onClick={() => navigate(`/details/${project.projectId}`)}
              >
                <h3>{project.name}</h3>
                <TruncatedDescription description={project.description} />

                {/* Profile & Username */}
                <div className="profile-info">
                  <img
                    src={project.profilePic ? project.profilePic : Anonimous}
                    alt={project.username || "Anonymous User"}
                    className="profile-pic"
                    onClick={() => onProfileClick(project.uniqueId)}
                  />
                  <span
                    className="username"
                    onClick={() => onProfileClick(project.uniqueId)}
                  >
                    {project.username || "Anonymous User"}
                  </span>
                </div>
              </div>
              {/* Like & Share Icons */}
              <div className="icons">
                <div
                  className="icon-wrapper like"
                  onClick={() => handleLikeClick(project.projectId)}
                >
                  <FaHeart
                    className="heart-icon"
                    style={{ color: project.isLiked ? "red" : "white" }}
                  />
                </div>
                <span className="likeCount" style={{ marginTop: "7px" }}>
                  {project.likes} {project.likes === 1 ? "" : ""}
                </span>
                <div
                  className="icon-wrapper share"
                  onClick={() => handleShareClick(project)}
                >
                  <MdShare />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>
        {`

        .swiper{
        height:630px;
        margin-top:50px;
        }
        .swiper-slide{
      background:transparent;
        }
      


          .swiper-slide-custom {
            display: flex;
            justify-content: center;
            transition: transform 0.5s ease, opacity 0.5s ease;
          }

           
     
          .slide-container {
            position: relative;
            {/* width: 700px; */}
            height: 650px;
            border-radius: 10px;
            {/* overflow: hidden; */}
            transition: transform 0.5s ease, filter 0.5s ease;
          }

          . slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .slide-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 210px;
            background: linear-gradient(to top, rgba(0, 0, 0, 1.9), transparent);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 15px;
            color: #fff;
            text-align: start;
          }

          .slide-overlay h3 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            padding: 0;
              margin-bottom: 10px;
          }

          .slide-overlay p {
            
            {/* margin-bottom: 10px; */}
          }

          /* Profile Info */
          .profile-info {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            margin-bottom:10px;
          }

          .profile-info img{
          width:32px;
          }

          .profile-pic img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
          }

          .username {
            font-size: 16px;
            font-weight: bold;
          }

          /* Like & Share Icons */
          /* Like & Share Icons */
.icons {
  position: absolute;
  bottom: 20px;
  right: 5px;
  display: flex;
  gap: 10px;
}

/* Icon Wrapper for Better Hover Effect */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;  
  height: 38px;
  border-radius: 50%;
  transition: background 0.3s ease-in-out;
  cursor: pointer;
}



/* Hover Effect */
.icon-wrapper.like:hover .heart-icon {
  color: red !important;  /* Ensure color changes */
  transform: scale(1.1); /* Slight zoom effect for better UX */
  
}

/* Optional: Change background on hover */
.icon-wrapper.like:hover {
  background: rgba(255, 0, 0, 0.3);
  border-radius: 50%;
}



/* Share Icon */
.icon-wrapper.share:hover {
  background: rgba(0, 0, 255, 0.3);
  color: blue;
}

/* Icon Size */
.icons svg {
  font-size: 23px;
}
.swiper-pagination {
  bottom: 10px !important;
}

.swiper-pagination-bullet {
  background: white !important;
  width: 7px;
  height: 7px;
  opacity: 0.7;
}

.swiper-pagination-bullet-active {
  background: blue !important;
  opacity: 1 !important;
}

          .swiper-slide-prev .slide-container {
            transform: scale(0.9);
            filter: brightness(0.6);
          }

          .swiper-slide-next .slide-container {
            transform: scale(0.9);
            filter: brightness(0.6);
          }

          .swiper-slide-prev-prev .slide-container {
            transform: scale(0.9);
            filter: brightness(0.6);
          }

          .swiper-slide-next-next .slide-container {
            transform: scale(0.7);
            filter: brightness(0.6);
          }

        `}
      </style>

      {/* Share Modal */}
      {selectedProject && (
        <Modal
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
        </Modal>
      )}
    </div>
  );
};
export default HeroBanner;
