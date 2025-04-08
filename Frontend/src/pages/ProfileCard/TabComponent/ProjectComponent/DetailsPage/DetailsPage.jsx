import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconButton,
  Modal,
  Box,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Pagination, Navigation, Thumbs } from "swiper/modules";
import Img from "../../../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../../../components/contentWrapper/ContentWrapper";
import {
  FaHeart,
  FaThumbsUp,
  FaPlus,
  FaShare,
  FaFlag,
  FaArrowRight,
  FaPencilAlt,
  FaTimes,
  FaHome,
  FaFolder,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import PosterFallback from "../../../../../assets/no-poster.png";
import "./style.scss";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../../../../../assets/avatar.png";
import Header from "../../../../../components/header/Header";
import Feedback from "../../../../../components/carousel/Projexts/Feedback";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { MdShare, MdThumbUp } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import UpdateProjectModal from "./EditProject/EditProject";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../../../Auth/Axios";
import Spinner from "../../../../../components/spinner/Spinner";
import EditImageModal from "./EditProject/EditImageModal";
import { Link } from "react-router-dom";
import ReportModal from "./Report/Report";
import { FaEye } from "react-icons/fa";
import linkifyHtml from "linkify-html";

const DetailsPage = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [previousImages, setPreviousImage] = useState([]);
  const user = useSelector((state) => state.user.user);
  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;
  const [userName, setUserName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  // States for the modal
  const [open, setOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // State for Thumbs
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const usernameLocalStorage = localStorage.getItem("username"); // Get userId from local storage
  console.log("username getting from localstorage is:", userIdLocalStorage);
  const token = localStorage.getItem("token");
  const [isOwner, setIsOwner] = useState(false);
  // const decoded = jwtDecode(token);
  const [status, setStatus] = useState("");
  const [Datas, setDatas] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [view, setView] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const hasFetched = useRef(false);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setThumbnailImage(file);
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Get the user's IP address
        const ipResponse = await axios.get(
          "https://api64.ipify.org?format=json"
        );
        const userIp = ipResponse.data.ip;

        // Prepare headers
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch project details only once
        if (!projectData || projectData.id !== projectId) {
          const response = await axiosInstance.get(
            `${apiBaseUrl}/projects/id/${projectId}`,
            {
              headers,
              params: { userId, userIp }, // Send userId and userIp as query parameters
            }
          );

          console.log("Project details are", response.data);

          // Set state variables
          setProjectData(response.data.project);
          setLiked(response.data.project.likes);
          setLikesCount(response.data.project.likes || 0);
          setPreviousImage(response.data.project.thumbnailImages);
          console.log("Previous images are", previousImages);
          setStatus(response.data.status);
          setProfilePic(response.data.project.profilePic);
          setUserName(response.data.project.username);
          setView(response.data.project.views); // Use updated views from backend
          console.log("Status is", status);
          console.log("Views are", response.data.totalViews);
          console.log("View Status:", response.data.viewStatus);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId, token]); // Only re-run when projectId or token changes

  const onProjectUpdate = async () => {
    try {
      // Instead of making another request, update only changed fields if available
      const response = await axiosInstance.get(
        `${apiBaseUrl}/projects/id/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Updated project details:", response.data.project);
      setProjectData(response.data.project);
    } catch (error) {
      console.error("Error refreshing project data:", error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // If token is available, include it in the Authorization header
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axiosInstance.get(`/users/${userId}`, {
          headers,
        });

        // Assuming the response contains the user details
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId, token]);

  const handleOpen = () => setOpen(true);
  const handleImageOpen = () => setImageModalOpen(true);
  const handleClose = () => setOpen(false);
  const handleImageClose = () => setImageModalOpen(false);

  const handleLikeClick = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      // If token is not present, redirect to login
      if (!token) {
        toast.error(
          "You are not authorized to perform this action. Please log in again."
        );
        navigate("/login");
        return;
      }

      // Optimistically update the UI before the API call
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));

      // Send a request to like/unlike the project
      const response = await axiosInstance.post(
        `/projects/${projectId}/like`,
        {} // No body required
      );

      console.log("Liked by:", response.data);

      // Show a success toast
      toast.success("Project liked successfully!");

      // Optionally, if the API returns the updated likes count, you can use that
      if (response.data && response.data.likes !== undefined) {
        setLikesCount(response.data.likes);
      }
    } catch (error) {
      console.error("There was an error liking the item:", error);

      // If the error is related to authentication (401), redirect to login
      if (error.response && error.response.status === 401) {
        toast.error("Authentication expired, please login again.");
        localStorage.removeItem("token"); // Remove the expired token
        navigate("/login"); // Navigate to login page
      } else {
        // Rollback UI update if there was an error
        setLiked((prevLiked) => !prevLiked);
        setLikesCount((prevCount) => (liked ? prevCount + 1 : prevCount - 1));

        // Show a generic error toast
        toast.error("There was an error liking the project.");
      }
    }
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

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication expired, please login again.");
      navigate("/login");
      return;
    }

    setLoading(true); // Set loading to true when upload starts

    // Call the update function (make sure it returns a promise)
    await handleUpdateProject();

    setLoading(false); // Set loading to false when upload completes
    setSnackbarOpen(true); // Show snackbar notification
    handleClose(); // Close the modal after upload
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openViewer = (images, startIndex) => {
    const viewerUrl = `/viewer?images=${encodeURIComponent(
      JSON.stringify(images)
    )}&start=${startIndex}`;
    window.open(viewerUrl, "_blank");
  };

  const handleDeleteClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication expired, please login again.");
      navigate("/login");
      return;
    }

    setDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false); // Close the dialog
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication expired, please login again.");
      navigate("/login");
      return;
    }

    try {
      // Make API call to delete project
      await axiosInstance.delete(`/projects/id/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers if required
      });
      navigate(`/profile/${userId}`);
      toast.success("Project deleted successfully!");
      onDelete(projectId); // Notify parent to update the project list
      setDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete the project. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <ToastContainer />
      {projectData ? (
        <ContentWrapper>
          <div className="detailsBanner">
            <ToastContainer />
            <div className="title">
              <h1>{projectData.name}</h1>
            </div>
            <ul className="menuItems">
              <li className="menuItem">
                <img src={profilePic} alt="" className="avatarImage" />
                {userName && <span style={{ color: "white" }}>{userName}</span>}
                {/* <span className="badge">Top Rated</span> */}
              </li>
              <li className="menuItem iconBox">
                <FaShare className="icon" title="Share" />
              </li>
              <li className="menuItem iconBox">
                <FaFlag
                  className="icon"
                  title="Report"
                  onClick={() => setIsReportModalOpen(true)} // Open modal
                  style={{ cursor: "pointer" }}
                />
              </li>
              <li className="menuItem iconBox">
                <FaArrowRight className="icon" title="Go to" />
              </li>
              {status !== "visitor" && (
                <>
                  <li className="menuItem iconBox" onClick={handleOpen}>
                    <FaPencilAlt className="icon" title="Edit" />
                  </li>
                  <li className="menuItem iconBox">
                    {/* Delete Icon */}
                    <FaTrash
                      className="icon"
                      title="Delete Project"
                      onClick={handleDeleteClick} // Open the confirmation dialog
                      style={{ cursor: "pointer" }}
                    />

                    {/* Confirmation Dialog */}
                    <Dialog
                      open={deleteDialogOpen}
                      onClose={handleCloseDialog}
                      aria-labelledby="delete-dialog-title"
                      aria-describedby="delete-dialog-description"
                    >
                      <DialogTitle id="delete-dialog-title">
                        Confirm Delete
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                          Are you sure you want to delete this project? This
                          action cannot be undone.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConfirmDelete}
                          color="error"
                          autoFocus
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </li>
                </>
              )}
            </ul>

            <div className="content1">
              <div className="left1">
                <div className="swiper-container">
                  <div className="swiper-main-wrapper">
                    <Swiper
                      style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                      }}
                      lazy={true}
                      pagination={{
                        el: ".custom-pagination", // ✅ Use custom selector
                        clickable: true,
                      }}
                      thumbs={{ swiper: thumbsSwiper }}
                      navigation={{
                        nextEl: ".custom-next", // ✅ Use custom selectors
                        prevEl: ".custom-prev",
                      }}
                      modules={[Pagination, Navigation, Thumbs]}
                      className="mySwiper"
                    >
                      {projectData.thumbnailImages &&
                      projectData.thumbnailImages.length > 0 ? (
                        projectData.thumbnailImages.map((image, index) => (
                          <SwiperSlide
                            key={index}
                            onClick={() =>
                              openViewer(projectData.thumbnailImages, index)
                            }
                          >
                            <Img
                              className="thumbImg"
                              src={image || PosterFallback}
                              alt={`Thumbnail ${index + 1}`}
                            />
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <Img
                            className="thumbImg"
                            src={PosterFallback}
                            alt="Thumbnail"
                          />
                        </SwiperSlide>
                      )}
                    </Swiper>

                    <div className="swiper-nav-buttons">
                      <div className="swiper-button-prev custom-prev"></div>
                      <div className="swiper-button-next custom-next"></div>
                    </div>

                    {/* ✅ Custom Pagination (Now inside `.swiper-main-wrapper`) */}
                    <div className="swiper-pagination custom-pagination"></div>
                  </div>

                  <div className="swiper-thumbs-wrapper">
                    {/* Thumbnail Swiper */}
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[Navigation, Thumbs]}
                      className="mySwiper-thumbs"
                    >
                      {projectData.thumbnailImages &&
                      projectData.thumbnailImages.length > 0 ? (
                        projectData.thumbnailImages.map((image, index) => (
                          <SwiperSlide key={index}>
                            <Img
                              className="thumbImg"
                              src={image || PosterFallback}
                              alt={`Thumbnail ${index + 1}`}
                            />
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <Img
                            className="thumbImg"
                            src={projectData.thumbnailImages || PosterFallback}
                            alt="Thumbnail"
                          />
                        </SwiperSlide>
                      )}
                    </Swiper>
                    {status !== "visitor" && (
                      <div
                        className="plus-icon"
                        style={{
                          position: "absolute",
                          right: "10px", // Adjust as needed
                          padding: "10px",
                          marginTop: "-60px",
                          borderRadius: "10%",
                        }}
                      >
                        <FaPlus
                          title="Add Image"
                          className="plus-icon-inner"
                          style={{ fontSize: "21px" }}
                          onClick={handleImageOpen}
                          onTouchStart={handleImageOpen}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="description-container">
                  <div
                    className="description1"
                    style={{ color: "#fff" }}
                    dangerouslySetInnerHTML={{
                      __html: linkifyHtml(projectData.description),
                    }}
                  />

                  <div className="tags-views-container">
                    <div className="tags">
                      {projectData.tags && projectData.tags.length > 0 ? (
                        projectData.tags.map((tag, index) => (
                          <span key={index} className="tag-item">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span>No tags available</span>
                      )}
                    </div>
                    <div className="views">
                      <FaEye style={{ marginRight: "8px", color: "#7f8c8d" }} />{" "}
                      {view} views
                    </div>
                  </div>
                </div>
              </div>

              <div className="right1">
                <div className="project-container row-layout">
                  {Datas.map((project, index) => (
                    <div key={project.projectId} className="project-item">
                      <Link
                        to={`/details/${project.projectId}`}
                        className="project-link"
                      >
                        <img
                          src={project.thumbnailImage}
                          alt={project.name}
                          className="project-image"
                        />
                        <div className="project-content">
                          <h4>{project.name}</h4>
                          {/* <p>{project.projectDescription}</p> */}
                          <div className="avatarContainer2">
                            <div className="profileIcon2">
                              <img src={project.profilePic} alt="Profile" />
                              <span>{project.username}</span>
                            </div>
                          </div>

                          <div className="iconsContainer2">
                            <div className="icons2">
                              <MdShare className="icon" />
                              <MdThumbUp className="icon" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <br />

            <h4
              style={{
                color: "white",
                marginBottom: "30px",
                marginTop: "50px",
              }}
            >
              Like My Project?
            </h4>
            <div className="User-Profile">
              <div className="avatar-container">
                <img src={profilePic} alt="" className="avatarImage" />
              </div>
              <div className="user-details">
                <h3 className="username">{userName}</h3>
                {/* <p className="user-description">
                  Web Developer | Graphic Designer | ZealPlane
                </p> */}
                {/* <br /> */}
                <div className="user-actions">
                  <div className="like-info">
                    {likesCount > 0 ? (
                      <p>
                        {likesCount} {likesCount === 1 ? "like" : "likes"}
                      </p>
                    ) : (
                      <p>Be the first to like the project</p>
                    )}
                  </div>
                  <IconButton className="likeButton" onClick={handleLikeClick}>
                    <FaThumbsUp style={{ color: liked ? "blue" : "orange" }} />
                  </IconButton>
                  <IconButton className="messageButton">
                    <FaPlus style={{ color: "orange" }} />
                  </IconButton>
                  <IconButton
                    className="messageButton"
                    onClick={() => Enquiry()}
                  >
                    <FaShare style={{ color: "orange" }} />
                  </IconButton>
                </div>
              </div>
            </div>
            <br />
            <Feedback />
          </div>
        </ContentWrapper>
      ) : (
        <p>
          <Spinner />
        </p>
      )}
      <UpdateProjectModal
        open={open}
        handleClose={handleClose}
        projectId={projectId}
        apiBaseUrl={apiBaseUrl}
        onProjectUpdate={onProjectUpdate}
      />
      <EditImageModal
        imageModalOpen={imageModalOpen}
        handleImageClose={handleImageClose}
        projectId={projectId}
        apiBaseUrl={apiBaseUrl}
        onProjectUpdate={onProjectUpdate}
        previousImages={previousImages}
      />
      <ReportModal
        projectId={projectId}
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)} // Close modal
      />
    </div>
  );
};

export default DetailsPage;
