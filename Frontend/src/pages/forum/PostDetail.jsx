// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "./postdetail.scss";
// import Header from "./Component/Header";
// import PostInfo from "./Component/Posts/PostInfo";
// import PostInteractions from "./Component/Posts/PostInteract";
// import CommentsSection from "./Component/Posts/CommentsSection";
// import Sidebar from "./Component/Sidebar";
// import Spinner from "../../components/spinner/Spinner";
// import axiosInstance from "../../Auth/Axios";
// import { jwtDecode } from "jwt-decode";
// import PostList from "./Component/PostList";

// const PostDetail = () => {
//   const { slug } = useParams();
// const id = slug.split("-").pop(); // Extract the ID from the slug
//   const navigate = useNavigate(); // Initialize navigate for redirection
//   const [post, setPost] = useState(null); // State to store the post data
//   const [comments, setComments] = useState([]); // State to store comments
//   const [userVote, setUserVote] = useState(null); // Track if user upvoted or downvoted
//   const [status, setStatus] = useState(null);
//   const [hasVoted, setHasVoted] = useState(null);
//   const token = localStorage.getItem("token");
//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

//   const getCurrentUserId = () => {
//     const token = localStorage.getItem("token");
//     try {
//       const decodedToken = jwtDecode(token);

//       // Assuming the uniqueId is stored in the token as "uniqueId"
//       const currentUserId = decodedToken.uniqueId;
//       return currentUserId;
//     } catch (error) {
//       return null;
//     }
//   };

//   const currentUserId = getCurrentUserId();
//   console.log("Current User ID:", currentUserId);

//   // Define fetchUserVote outside useEffect
//   const fetchUserVote = async () => {
//     try {
//       const res = await axiosInstance.get(`${apiBaseUrl}/posts/${id}/vote`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("User has interacted:", res.data.hasVoted);
//       setHasVoted(res.data.hasVoted);

//       if (res.data.hasVoted) {
//         setUserVote(res.data.voteValue > 0 ? "upvote" : "downvote");
//       }
//     } catch (error) {
//       console.error("Error fetching user vote:", error);
//     }
//   };

//  useEffect(() => {
//   const fetchPost = async () => {
//     try {
//       const config = token
//         ? {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         : {}; // No headers if no token

//       const response = await axios.get(`${apiBaseUrl}/posts/${id}`, config);

//       console.log("post is", response.data);

//       setPost({
//         ...response.data.post,
//         votes: response.data.post.votes || [],
//       });
//       setStatus(response.data.status);
//       setComments(response.data.post.comments || []);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//       toast.error("Failed to fetch post details!");
//     }
//   };

//   fetchPost();

//   if (token) {
//     fetchUserVote(); // Only fetch vote if token exists
//   }
// }, [id, token]);

//   const handleVote = async (voteType) => {
//     try {
//       const voteValue = voteType === "upvote" ? 1 : -1;

//       console.log("voteType:", voteType);
//       console.log("voteValue:", voteValue);

//       // Check if the user has already voted
//       const checkUserVoteResponse = await axios.get(
//         `${apiBaseUrl}/posts/${id}/vote`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const { hasVoted, voteValue: userVoteValue } = checkUserVoteResponse.data;

//       console.log("Has user voted:", hasVoted);
//       console.log("User's current vote value:", userVoteValue);

//       // Update the UI based on the current state
//       if (hasVoted && userVoteValue === voteValue) {
//         // User is toggling off their vote
//         setUserVote(null); // Clear the user's vote state
//         setPost((prevPost) => ({
//           ...prevPost,
//           votes: prevPost.votes.filter(
//             (vote) => vote.uniqueId !== currentUserId
//           ),
//           votesCount: prevPost.votesCount - 1, // Decrement count
//         }));
//       } else {
//         // User is either voting for the first time or changing their vote
//         setUserVote(voteType); // Update vote state
//         setPost((prevPost) => {
//           const updatedVotes = prevPost.votes || [];
//           const existingVoteIndex = updatedVotes.findIndex(
//             (vote) => vote.uniqueId === currentUserId
//           );

//           if (existingVoteIndex >= 0) {
//             // Update existing vote
//             updatedVotes[existingVoteIndex].value = voteValue;
//           } else {
//             // Add a new vote
//             updatedVotes.push({ uniqueId: currentUserId, value: voteValue });
//           }

//           return {
//             ...prevPost,
//             votes: updatedVotes,
//             votesCount:
//               prevPost.votesCount +
//               (hasVoted ? voteValue - userVoteValue : voteValue), // Adjust count
//           };
//         });
//       }

//       // Sync with backend (Update vote on the server)
//       const res = await axios.put(
//         `${apiBaseUrl}/posts/votes/${id}`,
//         { voteType: voteValue },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("Response from backend:", res.data);

//       toast.success("Vote updated successfully!");
//     } catch (error) {
//       console.error("Error voting on post:", error);
//       toast.error("An error occurred while voting.");
//     }
//   };

//   const handleEditPost = async (updatedData) => {
//     try {
//       const response = await axiosInstance.put(
//         `${apiBaseUrl}/posts/${post._id}`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success("Post updated successfully!");
//       setPost(response.data.updatedPost);
//     } catch (error) {
//       console.error("Error updating post:", error);
//       toast.error("Failed to update the post!");
//     }
//   };

//   const handleDeletePost = async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this post?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await axiosInstance.delete(`${apiBaseUrl}/posts/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Post deleted successfully!");
//       navigate("/forum");
//     } catch (error) {
//       console.error("Error deleting post:", error);
//       toast.error("Failed to delete the post!");
//     }
//   };

//   if (!post) return <Spinner />;

//   const votesCount = post.votes ? post.votes.length : 0;

//   return (
//     <div className="post">
//       <Header />

//       <div className="post-detail-container">
//         <div className="sidebar-component">
//           <Sidebar />
//         </div>
//         <div className="post-content">
//           <div className="empty">
//             <br />
//           </div>
//           <PostInfo
//             post={post}
//             status={status}
//             onEdit={handleEditPost}
//             onDelete={handleDeletePost}
//           />

//           <PostInteractions
//             post={post}
//             userVote={userVote}
//             handleVote={handleVote}
//             commentCount={comments.length}
//             votesCount={votesCount}
//             hasVoted={hasVoted}
//           />

//           <CommentsSection
//             comments={comments}
//             setComments={setComments}
//             postId={id}
//           />
//           <PostList votesCount={votesCount} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./postdetail.scss";
import Header from "./Component/Header";
import PostInfo from "./Component/Posts/PostInfo";
import PostInteractions from "./Component/Posts/PostInteract";
import CommentsSection from "./Component/Posts/CommentsSection";
import Sidebar from "./Component/Sidebar";
import Spinner from "../../components/spinner/Spinner";
import axiosInstance from "../../Auth/Axios";
import { jwtDecode } from "jwt-decode";
import PostList from "./Component/PostList";
import CuratedSidebar from "./Component/right-sidebar/right-sidebar"; // ✅ ADD THIS
import ForumSkeleton from "./ForumSkeleton";

const PostDetail = () => {
  const { slug } = useParams();
  const id = slug.split("-").pop(); // Extract the ID from the slug
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [status, setStatus] = useState(null);
  const [hasVoted, setHasVoted] = useState(null);
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const getCurrentUserId = () => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.uniqueId;
    } catch (error) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const fetchUserVote = async () => {
    try {
      const res = await axiosInstance.get(`${apiBaseUrl}/posts/${id}/vote`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasVoted(res.data.hasVoted);
      if (res.data.hasVoted) {
        setUserVote(res.data.voteValue > 0 ? "upvote" : "downvote");
      }
    } catch (error) {
      console.error("Error fetching user vote:", error);
    }
  };

  useEffect(() => {
    // 🚨 Redirect if user is not logged in
    if (!token) {
      toast.warning("Please login to continue!");
      navigate("/login");
      return; // stop further execution
    }

    const fetchPost = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiBaseUrl}/posts/${id}`, config);

        setPost({
          ...response.data.post,
          votes: response.data.post.votes || [],
        });
        setStatus(response.data.status);
        setComments(response.data.post.comments || []);
      } catch (error) {
        toast.error("Failed to fetch post details!");
      }
    };

    fetchPost();
    fetchUserVote();
  }, [id, token, navigate]);

  const handleVote = async (voteType) => {
    try {
      const voteValue = voteType === "upvote" ? 1 : -1;
      const checkUserVoteResponse = await axios.get(
        `${apiBaseUrl}/posts/${id}/vote`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { hasVoted, voteValue: userVoteValue } = checkUserVoteResponse.data;

      if (hasVoted && userVoteValue === voteValue) {
        setUserVote(null);
        setPost((prev) => ({
          ...prev,
          votes: prev.votes.filter((vote) => vote.uniqueId !== currentUserId),
          votesCount: prev.votesCount - 1,
        }));
      } else {
        setUserVote(voteType);
        setPost((prev) => {
          const updatedVotes = [...prev.votes];
          const index = updatedVotes.findIndex(
            (vote) => vote.uniqueId === currentUserId
          );

          if (index >= 0) {
            updatedVotes[index].value = voteValue;
          } else {
            updatedVotes.push({ uniqueId: currentUserId, value: voteValue });
          }

          return {
            ...prev,
            votes: updatedVotes,
            votesCount:
              prev.votesCount +
              (hasVoted ? voteValue - userVoteValue : voteValue),
          };
        });
      }

      await axios.put(
        `${apiBaseUrl}/posts/votes/${id}`,
        { voteType: voteValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Vote updated successfully!");
    } catch (error) {
      toast.error("An error occurred while voting.");
    }
  };

  const handleEditPost = async (updatedData) => {
    try {
      const response = await axiosInstance.put(
        `${apiBaseUrl}/posts/${post._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post updated successfully!");
      setPost(response.data.updatedPost);
    } catch (error) {
      toast.error("Failed to update the post!");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(`${apiBaseUrl}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully!");
      navigate("/forum");
    } catch (error) {
      toast.error("Failed to delete the post!");
    }
  };

  if (!post) return <ForumSkeleton />;

  const votesCount = post.votes ? post.votes.length : 0;

  return (
    <div className="post">
      <Header />
      <div className="post-detail-container">
        <div className="sidebar-component">
          <Sidebar />
        </div>

        <div className="post-content">
          <div className="empty">
            <br />
          </div>
          <PostInfo
            post={post}
            status={status}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
          <PostInteractions
            post={post}
            userVote={userVote}
            handleVote={handleVote}
            commentCount={comments.length}
            votesCount={votesCount}
            hasVoted={hasVoted}
          />
          <CommentsSection
            comments={comments}
            setComments={setComments}
            postId={id}
          />
          <PostList votesCount={votesCount} />
        </div>

        {/* ✅ Curated Sidebar */}
        <div className="curated-sidebar">
          <CuratedSidebar />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
