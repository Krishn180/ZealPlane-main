import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateNews.scss";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "./CreateNews.scss";

const CreateNews = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Function to detect links and make them clickable
  const detectUrls = (text) => {
    return text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" style="color:blue; text-decoration:underline;">$1</a>'
    );
  };

  const handleContentChange = (value) => {
    setContent(detectUrls(value));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const cleanedContent = content
      .replace(/<\/?p>/g, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/background-color:[^;]+;/gi, ""); // remove background-color styles

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to post news.");
      return;
    }

    const newsData = {
      title,
      content: cleanedContent,
      author,
      coverImage,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    await axios.post(`${apiBaseUrl}/news`, newsData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Token added
      },
    });

    alert("News added successfully!");
  } catch (err) {
    console.error("Error adding news:", err);
    alert("Failed to add news");
  }
};


  return (
    <div className="create-news-container">
      <h2>Add News</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {/* ReactQuill Editor for description/content */}
        <ReactQuill
          value={content}
          theme="snow"
          onChange={handleContentChange}
          required
          placeholder="Write your news content here..."
          className="quill"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              [{ color: [] }, { background: [] }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "bullet",
            "link",
            "image",
            "color",
            "background",
          ]}
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Publish News</button>
      </form>
    </div>
  );
};

export default CreateNews;
