import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { FaRegCommentAlt, FaRegShareSquare, FaArrowUp } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import linkifyHtml from "linkify-html";
import { toast } from "react-toastify";
import "./postList.scss";

const PostList = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleShare = (postId) => {
    console.log(`Shared post with ID: ${postId}`);
  };

  const handleUpvote = async (postId, isUpvoted) => {
    try {
      if (!token) {
        toast.error("You are not authorized to perform this action. Please log in.");
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentUserId = decodedToken.uniqueId;

      await axios.put(
        `${apiBaseUrl}/posts/votes/${postId}`,
        { voteType: isUpvoted ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                votes: isUpvoted
                  ? post.votes.filter((vote) => vote !== currentUserId)
                  : [...post.votes, currentUserId],
                upvoted: !isUpvoted,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling vote:", error);
    }
  };

  return (
    <div className="post-list">
      {posts.map((post) => {
        const isUpvoted = post.upvoted || false;
        const voteCount = post.votes.length || 0;

        return (
          <Link to={`/post/${post._id}`} key={post._id} className="post-link">
            <div className="post">
              <div className="post-header">
                {post.profilePic && (
                  <img src={post.profilePic} alt="Profile" className="profile-pic" />
                )}
                <div className="post-title-container">
                  <h3 className="post-title">{post.title || "No title available"}</h3>
                  <span className="post-author">Posted by / {post.author || "Anonymous"}</span>
                  <span className="post-timestamp">
                    {post.timestamp
                      ? new Date(post.timestamp).toLocaleString()
                      : "Unknown time"}
                  </span>
                </div>
              </div>

              {post.image && (
                <div className="post-image-container">
                  <img src={post.image} alt="Post" className="post-image" />
                </div>
              )}

              <PostBody body={linkifyHtml(post.body)} />

              <div className="post-meta">
                <div
                  className="post-upvote"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpvote(post._id, isUpvoted);
                  }}
                >
                  {isUpvoted ? (
                    <FaArrowUp className="upvote-icon active" />
                  ) : (
                    <BiUpvote className="upvote-icon" />
                  )}
                  <span className="vote-count">{voteCount}</span>
                </div>
                <span className="post-comments">
                  <FaRegCommentAlt />{" "}
                  {Array.isArray(post.comments) ? post.comments.length : 0} Comments
                </span>
                <span
                  className="post-share"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare(post._id);
                  }}
                >
                  <FaRegShareSquare /> Share
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const PostBody = ({ body }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const formatParagraphs = (text, truncate = false) => {
    if (!text) return "No content available";

    const paragraphs = text.split(/<\/?p>/g).filter(p => p.trim() !== "");

    return paragraphs
      .map((para) => {
        const words = para.trim().split(/\s+/);
        if (truncate && words.length > 50) {
          return `<p>${words.slice(0, 50).join(" ")}...</p>`;
        }
        return `<p>${para.trim()}</p>`;
      })
      .join("");
  };

  const shouldTruncate = body && body.split(/\s+/).length > 100;

  return (
    <div className="post-body-container">
      <p
        className="post-body"
        dangerouslySetInnerHTML={{
          __html: isExpanded
            ? formatParagraphs(body, false)
            : formatParagraphs(body, true),
        }}
        style={{ whiteSpace: "pre-wrap" }}
      ></p>
      {shouldTruncate && (
        <button
          onClick={toggleContent}
          className={isExpanded ? "read-less-button" : "read-more-button"}
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default PostList;
