import React, { useState, useEffect } from "react";
import { Col, Row, Upload, Avatar, Button, Modal, Spin, message } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import "./avatar.scss";
import RadarChartExample from "./radar";
import ProfileCard from "./ProfileCard";
import TabComponent from "./TabComponent/Tabs";
import { useSelector } from "react-redux";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { setUserId } from "../../store/userAction"; // Import the action to set userId
import { useDispatch } from "react-redux"; // Import useDispatch hook
import Header from "../../components/header/Header";
import { FaTimes, FaEdit } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import ProfileImageUploadModal from "./ProfileImageUploadModal/ProfileImageUploadModal";
import axiosInstance from "../../Auth/Axios";
import EnquiryModal from "./EnquiryModal/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/footer/Footer";

const AvatarComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState("postroom");
  const [isEditMode, setIsEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [level, setLevel] = useState(1);
  const [imageLink, setImageLink] = useState(null);
  const [file, setFile] = useState(null); // Add file state
  const [loading, setLoading] = useState(false); // Add loading state
  const [modalVisible, setModalVisible] = useState(false); // Add modalVisible state
  const user = useSelector((state) => state.user.user);
  const userIdRedux = useSelector((state) => state.user.userId); // Get userId from Redux store
  const userIdLocalStorage = localStorage.getItem("Id"); // Get userId from local storage
  const userId = userIdRedux || userIdLocalStorage; // Use userId from Redux if available, otherwise use local storage
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch hook
  const [profilePic, setProfilePic] = useState(null);
  const [response, setResponse] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { id } = useParams();
  const [email, setEmail] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const handleEnquiryOpen = () => setIsEnquiryModalOpen(true);
  const handleEnquiryClose = () => setIsEnquiryModalOpen(false);
  const [status, setStatus] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    console.log("User ID:", id);
  }, [id]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get the token from localStorage (if it exists)
        const token = localStorage.getItem("token");

        // Prepare the headers object. If token exists, include it in the header.
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Make the API request with or without the token
        const response = await axiosInstance.get(`users/${id}`, {
          headers: headers, // Include token in headers if it exists
        });

        // Log user details and set the state with response data
        console.log("User details fetched:", response.data.user);
        setUserDetails(response.data.user);
        setEmail(response.data.user.email);
        setMobile(response.data.contactNumber);
        setResponse(response.data);
        setProfilePic(response.data.user.profilePic);
        setStatus(response.data.status);

        console.log("status is", response.data.status);

        // Log status to check if it's updated correctly
        if (response.data.status === "visitor") {
          console.log("User is a visitor. Editing access is disabled.");
        } else {
          console.log("User is not a visitor. Editing access is enabled.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Check if `id` is available before making the API call
    if (id) {
      fetchUserDetails();
    }
  }, [id]); // Dependency on `id` means the effect will run when `id` changes

  const openModal = () => {
    // Log the userDetails to check its current state when the modal is triggered
    console.log("User Details:", response);

    if (response?.status !== "visitor") {
      // If the user is not a visitor, open the modal
      setModalVisible(true);
    } else {
      // Alert if the user is a visitor and cannot edit the profile
      alert("You are not authorized to update this profile picture.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      setImageLink(info.file.response.url); // Assuming the server responds with the URL of the uploaded file
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("profilePic", file);
    }

    try {
      // Retrieve the access token from wherever you store it (e.g., localStorage)
      const token = localStorage.getItem("token");
      // Make sure the token exists
      if (!token) {
        setLoading(false);
        alert("Access token is missing. Please log in again.");
        return;
      }

      // Submit the form data with the access token in the headers
      const response = await axios.put(
        `${apiBaseUrl}/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      setUserDetails(response.data);
      console.log("Profile data is:", response.data);
      setProfilePic(response.data.profilePic);
      setLoading(false);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
      alert("Failed to update user");
    }
  };

  // Dispatch userId to Redux store if not already set
  useEffect(() => {
    if (!userIdRedux && userIdLocalStorage) {
      dispatch(setUserId(userIdLocalStorage));
    }
  }, [dispatch, userIdRedux, userIdLocalStorage]);

  // if (!userDetails) {
  //   navigate('/login');
  //   return null;
  // }

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize(); // Check screen size on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}/followers`);
        console.log("Following data from backend:", res.data);

        const followingIds = res.data.map((user) => user._id);
        setIsFollowing(followingIds.includes(id));
      } catch (err) {
        console.error("Error checking follow status", err);
      }
    };

    if (userId && id) checkFollowStatus();
  }, [userId, id]);

const handlePayment = async () => {
  try {
    const amount = 500; // ₹5 support

    const response = await axiosInstance.post("/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    // ✅ Check for failed response before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();

    if (!data || !data.key || !data.order_id) {
      throw new Error("Invalid response from server");
    }

    const options = {
      key: data.key, // Razorpay API key from backend
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "Zealplane",
      description: "Support the Creator",
      handler: function (response) {
        alert("✅ Payment successful! Thank you for your support 💖");
        console.log("Payment Details:", response);
      },
      prefill: {
        name: userDetails?.fullName || "Anonymous",
        email: userDetails?.email || "",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment initiation failed:", error);
    alert("Something went wrong while starting the payment. Please try again.");
  }
};



  const handleSendConnectionRequest = async () => {
    try {
      const response = await axiosInstance.post(`users/toggle-follow`, {
        senderId: userId,
        receiverId: id,
      });

      // Show success message from the API response
      toast.success(response.data.msg);

      // Update the local follow status based on the response
      setIsFollowing((prev) => !prev);

      // Optionally, update user data if needed
      // For example, you can also update local user data with new follower/following info
      // Example: (Assuming response contains the target user's info)
      const { uniqueId, username, profilePic } = response.data.user;
      setTargetUser((prevUser) => ({
        ...prevUser,
        uniqueId,
        username,
        profilePic,
      }));
    } catch (error) {
      // Handle errors, show error message
      toast.error(error.response?.data?.msg || "Failed to send request");
    }
  };

  return (
    <div
      className="col"
      style={{ backgroundColor: "#1e1f23", width: "100%", color: "#d3d4d8" }}
    >
      <Header />

      <ContentWrapper>
        <div className="row">
          {/* {<FaEdit />} */}
          {isMobile ? (
            <div style={{ marginTop: "70px" }}>
              <div
                className="card mb-3"
                style={{ background: "rgba(55, 65, 122, 0.1)", color: "white" }}
              >
                {/* Camera icon at the top right of the card */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={openModal}
                >
                  {status !== "visitor" && (
                    <FiCamera
                      style={{
                        fontSize: "24px",
                        color: "white",
                        background: "transparent",
                        borderRadius: "50%",
                        padding: "4px",
                        boxShadow: "0 0 9px rgba(215, 203, 205, 0.8)",
                      }}
                    />
                  )}
                </div>
                <div className="card-body" style={{ marginRight: "10px" }}>
                  <Row justify="center" align="middle">
                    <Col>
                      {profilePic ? (
                        <Avatar
                          size={130}
                          gap={2}
                          src={imageLink || profilePic}
                          style={{
                            boxShadow: "0 0 10px rgba(255, 0, 0, 0.8)",
                            border: "2px solid rgba(255, 0, 0, 0.8)",
                            cursor: "pointer",
                          }}
                          onClick={openModal}
                        />
                      ) : (
                        <Avatar
                          size={150}
                          gap={2}
                          icon={<UserOutlined size={36} />}
                          style={{
                            boxShadow: "0 0 10px rgba(255, 0, 0, 0.8)",
                            border: "2px solid rgba(255, 0, 0, 0.8)",
                          }}
                          onClick={openModal}
                        />
                      )}

                      {/* Use the modal component here */}
                      <ProfileImageUploadModal
                        modalVisible={modalVisible}
                        closeModal={closeModal}
                        handleFileChange={handleFileChange}
                        handleFormSubmit={handleFormSubmit}
                        loading={loading}
                        profilePic={profilePic}
                        setFile={setFile}
                      />
                      <EnquiryModal
                        open={isEnquiryModalOpen}
                        onClose={handleEnquiryClose}
                        mobileNumber={mobile} // Pass WhatsApp number
                        emailAddress={email} // Pass email address
                      />
                    </Col>
                  </Row>

                  <div className="text-center text-sm-left mb-2 mb-sm-0">
                    {isEditMode ? (
                      <>
                        <input type="text" onChange={(e) => {}} />
                        <input type="text" onChange={(e) => {}} />
                        <button type="button">Save</button>
                      </>
                    ) : (
                      <>
                        {user || userDetails ? (
                          <>
                            <h5 className="pt-sm-2 pb-1 mb-0 mt-3 text-nowrap">
                              {userDetails.fullName
                                ? userDetails.fullName
                                : "Username not updated yet"}
                            </h5>
                            <p
                              className="mb-2"
                              style={{ marginBottom: "2rem" }}
                            >
                              @{user || userDetails.username}
                            </p>
                            <p
                              className="mb-0"
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#00bcd4",
                              }}
                            >
                              Level: {level}
                            </p>
                          </>
                        ) : (
                          <p>User data not available</p>
                        )}
                      </>
                    )}
                    <Row justify="center" style={{ marginTop: "20px" }}>
                      <Col>
                        <Button
                          type="button"
                          className="custom-button"
                          onClick={handleEnquiryOpen}
                        >
                          Enquiry
                        </Button>
                      </Col>
                    </Row>
                    <div className="text-muted">
                      <small style={{ color: "white" }}>Last seen status</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mb-3" style={{ marginTop: "50px" }}>
                <ProfileCard />
                <br />
                <TabComponent
                  activeTabKey={activeTabKey}
                  onTabChange={handleTabChange}
                />
              </div>
              <div
                className="card"
                style={{ background: "rgba(55, 65, 122, 0.1)", color: "white" }}
              >
                <div
                  className="card-body"
                  style={{
                    background: "rgba(55, 65, 122, 0.1)",
                    color: "white",
                  }}
                >
                  <h6 className="card-title font-weight-bold">Rewards</h6>
                  <RadarChartExample />
                </div>
              </div>
              {/* <div
                className="card"
                style={{ background: "rgba(55, 65, 122, 0.1)", color: "white" }}
              >
                <div
                  className="card-body"
                  style={{
                    background: "rgba(55, 65, 122, 0.1)",
                    color: "white",
                  }}
                ></div>
              </div> */}
            </div>
          ) : (
            <>
              <div className="col mb-3" style={{ marginTop: "50px" }}>
                <ProfileCard />
                <br />
                <TabComponent
                  activeTabKey={activeTabKey}
                  onTabChange={handleTabChange}
                />
              </div>

              <br />
              <br />
              <div
                className="col-6 col-md-3 mb-6"
                style={{ marginTop: "70px" }}
              >
                <div
                  className="card mb-3"
                  style={{
                    background: "rgba(55, 65, 122, 0.1)",
                    color: "white",
                  }}
                >
                  {/* Camera icon at the top right of the card */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                    }}
                    onClick={openModal}
                  >
                    {status !== "visitor" && (
                      <FiCamera
                        style={{
                          fontSize: "24px",
                          color: "white",
                          background: "transparent",
                          borderRadius: "50%",
                          padding: "4px",
                          boxShadow: "0 0 10px rgba(215, 203, 205, 0.8)",
                        }}
                      />
                    )}
                  </div>
                  <div className="card-body">
                    <Row justify="center" align="middle">
                      <Col>
                        {/* Avatar that triggers the modal */}
                        {profilePic ? (
                          <Avatar
                            size={130}
                            gap={2}
                            src={profilePic}
                            style={{
                              boxShadow: "0 0 10px rgba(255, 0, 0, 0.8)",
                              border: "2px solid rgba(255, 0, 0, 0.8)",
                              cursor: "pointer",
                            }}
                            onClick={openModal}
                          />
                        ) : (
                          <Avatar
                            size={150}
                            gap={2}
                            icon={<UserOutlined size={36} />}
                            style={{
                              boxShadow: "0 0 10px rgba(255, 0, 0, 0.8)",
                              border: "2px solid rgba(255, 0, 0, 0.8)",
                            }}
                            onClick={openModal}
                          />
                        )}

                        {/* Use the modal component here */}
                        <ProfileImageUploadModal
                          modalVisible={modalVisible}
                          closeModal={closeModal}
                          handleFileChange={handleFileChange}
                          handleFormSubmit={handleFormSubmit}
                          loading={loading}
                          profilePic={profilePic}
                          setFile={setFile}
                        />
                        <EnquiryModal
                          open={isEnquiryModalOpen}
                          onClose={handleEnquiryClose}
                          mobileNumber={mobile} // Pass WhatsApp number
                          emailAddress={email} // Pass email address
                        />
                      </Col>
                    </Row>
                   <div className="text-center text-sm-left mb-2 mb-sm-0">
  {isEditMode ? (
    <>
      <input type="text" onChange={(e) => {}} />
      <input type="text" onChange={(e) => {}} />
      <button type="button">Save</button>
    </>
  ) : (
    <>
      {user || userDetails ? (
        <>
          <h5 className="pt-sm-2 pb-1 mb-0 mt-3 text-nowrap">
            {userDetails?.fullName || "User name"}
          </h5>
          <p className="mb-2" style={{ marginBottom: "2rem" }}>
            @{user || userDetails.username}
          </p>
          <p
            className="mb-0"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#00bcd4",
            }}
          >
            Level: {level}
          </p>
        </>
      ) : (
        <p>User data not available</p>
      )}
    </>
  )}

  {/* Action buttons */}
  <Row justify="center" style={{ marginTop: "20px" }}>
    <Col>
      <Button
        type="button"
        className="custom-button"
        onClick={handleEnquiryOpen}
      >
        Enquiry
      </Button>
    </Col>
    <Col style={{ marginLeft: "10px" }}>
      <Button
        type="button"
        className="custom-button"
        onClick={handleSendConnectionRequest}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Col>

    {/* ✅ Support the Creator Button */}
    <Col style={{ marginLeft: "10px" }}>
      <Button
        type="button"
        className="support-button"
        onClick={handlePayment}
      >
        Support
      </Button>
    </Col>
  </Row>

  <div className="text-muted">
    <small style={{ color: "white" }}>Last seen status</small>
  </div>
</div>

                  </div>
                </div>

                <div
                  className="card"
                  style={{
                    background: "rgba(55, 65, 122, 0.1)",
                    color: "white",
                  }}
                >
                  <div
                    className="card-body"
                    style={{
                      background: "rgba(55, 65, 122, 0.1)",
                      color: "white",
                    }}
                  >
                    <h6 className="card-title font-weight-bold">Rewards</h6>
                    <RadarChartExample />
                  </div>
                </div>
                {/* 
                <div
                  className="card"
                  style={{
                    background: "rgba(55, 65, 122, 0.1)",
                    color: "white",
                  }}
                > */}
                {/* <div
                    className="card-body"
                    style={{
                      background: "rgba(55, 65, 122, 0.1)",
                      color: "white",
                    }}
                  > */}
                {/* <MyBio /> */}
                {/* </div>
                </div> */}
              </div>
            </>
          )}
        </div>
      </ContentWrapper>
      <Footer />
    </div>
  );
};

export default AvatarComponent;
