import React from "react";
import { BiUpvote } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { FaArrowUp } from "react-icons/fa";
import "./PostInteraction.scss";

const PostInteractions = ({
  post,
  userVote,
  handleVote,
  commentCount,
  votesCount,
}) => {
  // Function to handle share or copy link
  const handleShare = () => {
    const postUrl = window.location.href; // Get the current page URL
    // Ask the user to copy the URL
    const copyToClipboard = window.confirm(
      "Do you want to copy the link to this post?"
    );

    if (copyToClipboard) {
      // Copy the URL to the clipboard
      navigator.clipboard
        .writeText(postUrl)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
          alert("Failed to copy the link.");
        });
    }
  };

  return (
    <div className="post-votes">
      <button
        className={`vote-button upvote ${
          userVote === "upvote" ? "active" : ""
        }`}
        onClick={() => handleVote("upvote")}
      >
        {userVote === "upvote" ? <FaArrowUp /> : <BiUpvote />}
      </button>

      <span className="vote-count">{votesCount}</span>

      <button className="vote-button comment">
        <FaRegCommentAlt />
        <span className="comment-count">{commentCount}</span>
      </button>

      <button className="vote-button share" onClick={handleShare}>
        <RiShareForwardLine />
      </button>
    </div>
  );
};

export default PostInteractions;
