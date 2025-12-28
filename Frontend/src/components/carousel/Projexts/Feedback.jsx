import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Feedback.scss";
import avatar from "../../../assets/avatar.png";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "../../../Auth/Axios";
import { jwtDecode } from "jwt-decode";

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const username = localStorage.getItem("username");
  const { projectId } = useParams();
  const token = localStorage.getItem("token");
  const uniqueId = token ? jwtDecode(token)?.uniqueId : null;
  const maxWords = 100;

  const textAreaRef = useRef(null);

  // Default Hinglish comments
  const defaultComments = [
    { text: "Loved the art", color: "#ff4d4d" },
    { text: "Interesting concept", color: "#ffcc00" },
    { text: "Waiting for next part", color: "#00bfff" },
    { text: "This deserves more attention", color: "#ff7f27" },
    { text: "Felt something while reading this", color: "#28a745" }
  ];

  const handleDefaultCommentClick = (commentText) => {
    setFeedbackText(commentText);
  };

  // Fetch existing comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axiosInstance.get(`/projects/id/${projectId}`, {
          headers,
        });
        setFeedbackList(response.data.project.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [projectId, token]);

  useEffect(() => {
    if (editingCommentId !== null) {
      textAreaRef.current?.focus();
    }
  }, [editingCommentId]);

  // Fetch notifications and log in console
  const fetchNotifications = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axiosInstance.get(`${apiBaseUrl}/notification`, { headers });
      console.log("Notifications fetched:", res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wordCount = feedbackText.trim().split(/\s+/).length;
    if (wordCount > maxWords) {
      alert(
        `Your feedback cannot exceed ${maxWords} words. Current count: ${wordCount}`
      );
      return;
    }

    const newFeedback = { username, commentText: feedbackText };

    try {
      await axiosInstance.post(`/projects/${projectId}`, newFeedback, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axiosInstance.get(`/projects/id/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbackList(response.data.project.comments || []);
      setFeedbackText("");
      alert("Your feedback has been submitted!");

      // 🔔 Fetch notifications in console after adding feedback
      fetchNotifications();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleEdit = (comment) => {
    if (comment.uniqueId !== uniqueId) {
      alert("You can only edit your own comments.");
      return;
    }
    setEditingCommentId(comment._id);
    setFeedbackText(comment.commentText);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseUrl}/projects/${projectId}/comments/${editingCommentId}`,
        { commentText: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedList = feedbackList.map((comment) =>
        comment._id === editingCommentId ? response.data.comment : comment
      );

      setFeedbackList(updatedList);
      setFeedbackText("");
      setEditingCommentId(null);
      alert("Your comment has been successfully updated!");

      // 🔔 Fetch notifications in console after update
      fetchNotifications();
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const handleDelete = async (commentId, commentUsername) => {
    const decodedToken = jwtDecode(token);
    const decodedUsername = decodedToken.username;

    if (commentUsername !== decodedUsername) {
      alert("You can only delete your own comments.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`${apiBaseUrl}/projects/${projectId}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbackList(
        feedbackList.filter((comment) => comment._id !== commentId)
      );
      alert("Your comment has been successfully deleted!");

      // 🔔 Fetch notifications in console after deletion
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="feedback">
      <h3 className="feedback-title">
        {editingCommentId ? "Edit Feedback" : "Leave Feedback"}
      </h3>

      <form
        className="feedback-form"
        onSubmit={editingCommentId ? handleUpdate : handleSubmit}
      >
        <div className="default-comments">
          {defaultComments.map((comment, index) => (
            <button
              key={index}
              type="button"
              className="default-comment-btn"
              style={{
                border: `2px solid ${comment.color}`,
                color: comment.color,
                backgroundColor: "transparent"
              }}
              onClick={() => handleDefaultCommentClick(comment.text)}
            >
              {comment.text}
            </button>
          ))}
        </div>

        <textarea
          ref={textAreaRef}
          className="feedback-input"
          placeholder="Write your feedback here..."
          rows="4"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        ></textarea>

        <button type="submit" className="feedback-button">
          {editingCommentId ? "Update" : "Submit"}
        </button>
      </form>

      <div className="feedback-list">
        <h3 className="feedback-list-title">Recent Feedback</h3>
        {feedbackList.length === 0 ? (
          <p>No feedback yet. Be the first to leave a comment!</p>
        ) : (
          feedbackList.map((feedback) => (
            <div className="feedback-item" key={feedback._id}>
              <div className="feedback-info">
                <img
                  src={feedback.profilePic || avatar}
                  alt="Profile"
                  className="feedback-avatar"
                />
                <div>
                  <div className="feedback-user">
                    {feedback.username || "Anonymous"}
                  </div>
                  <div className="feedback-time">
                    {formatDistanceToNow(new Date(feedback.date || Date.now()))}{" "}
                    ago
                  </div>
                </div>
              </div>
              <div className="feedback-text">{feedback.commentText}</div>
              <div className="feedback-actions">
                {feedback.uniqueId === uniqueId && (
                  <>
                    <button
                      onClick={() => handleEdit(feedback)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(feedback._id, feedback.username)
                      }
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;
