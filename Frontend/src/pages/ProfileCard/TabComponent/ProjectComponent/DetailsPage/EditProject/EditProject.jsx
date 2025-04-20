// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Box,
//   Button,
//   Typography,
//   CircularProgress,
//   TextField,
//   Chip,
//   IconButton,
// } from "@mui/material";
// import { FaPlus, FaTimes, FaCamera } from "react-icons/fa";
// import axiosInstance from "../../../../../../Auth/Axios";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const UpdateProjectModal = ({
//   open,
//   handleClose,
//   projectId,
//   apiBaseUrl,
//   onProjectUpdate,
// }) => {
//   const [thumbnailImage, setThumbnailImage] = useState(null);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState([]);
//   const [newTag, setNewTag] = useState("");
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem("token");

//   // Draggable modal state
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [dragging, setDragging] = useState(false);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     if (open && projectId) {
//       fetchProjectData();
//     }
//   }, [open, projectId]);

// const fetchProjectData = async () => {
//   try {
//     const { data } = await axiosInstance.get(
//       `${apiBaseUrl}/projects/id/${projectId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     setName(data.name || "");
//     setDescription(data.description || "");
//     setTags(data.tags || []);
//   } catch (error) {
//     console.error("Error fetching project data:", error);
//     toast.error("Failed to load project details.");
//   }
// };

//   const handleMouseDown = (event) => {
//     setDragging(true);
//     setOffset({
//       x: event.clientX - position.x,
//       y: event.clientY - position.y,
//     });
//   };

//   const handleMouseMove = (event) => {
//     if (!dragging) return;
//     setPosition({
//       x: event.clientX - offset.x,
//       y: event.clientY - offset.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
//           width: 550,
//           bgcolor: "#1a1a1b",
//           borderRadius: "8px",
//           boxShadow: 24,
//           p: 4,
//           color: "#d7dadc",
//           cursor: dragging ? "grabbing" : "grab",
//         }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       >
//         {/* Close Button */}
//         <IconButton
//           onClick={handleClose}
//           sx={{ position: "absolute", top: 8, right: 8, color: "#d7dadc" }}
//         >
//           <FaTimes />
//         </IconButton>

//         <Typography variant="h6" sx={{ color: "#d7dadc", mb: 2 }}>
//           Update Project
//         </Typography>

//         <Typography variant="body1" sx={{ color: "#818384", mt: 2 }}>
//           Name
//         </Typography>
//         <TextField
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           fullWidth
//           margin="normal"
//           sx={{
//             bgcolor: "#272729",
//             input: { color: "white" },
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": { borderColor: "#343536" },
//               "&:hover fieldset": { borderColor: "#818384" },
//             },
//           }}
//         />

//         <Typography variant="body1" sx={{ color: "#818384", mt: 2 }}>
//           Description
//         </Typography>
//         <ReactQuill
//           theme="snow"
//           value={description}
//           onChange={setDescription}
//           modules={{
//             toolbar: [
//               ["bold", "italic", "underline"],
//               [{ list: "ordered" }, { list: "bullet" }],
//             ],
//             clipboard: { matchVisual: false },
//           }}
//           formats={["bold", "italic", "underline", "list", "bullet"]}
//           style={{ backgroundColor: "#272729", color: "white" }}
//         />

//         <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
//           {tags.map((tag) => (
//             <Chip
//               key={tag}
//               label={tag}
//               onDelete={() => setTags(tags.filter((t) => t !== tag))}
//               sx={{ bgcolor: "#ff4500", color: "#fff" }}
//             />
//           ))}
//         </Box>

//         <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
//           <TextField
//             label="Add Tag"
//             value={newTag}
//             onChange={(e) => setNewTag(e.target.value)}
//             fullWidth
//             sx={{
//               bgcolor: "#272729",
//               input: { color: "#d7dadc" },
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "#343536" },
//                 "&:hover fieldset": { borderColor: "#818384" },
//               },
//             }}
//           />
//           <IconButton
//             onClick={() => setTags([...tags, newTag.trim()])}
//             sx={{ color: "#ff4500" }}
//           >
//             <FaPlus />
//           </IconButton>
//         </Box>

//         {/* File Upload with Camera Icon */}
//         <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
//           <input
//             type="file"
//             id="thumbnail-upload"
//             style={{ display: "none" }}
//             onChange={(e) => setThumbnailImage(e.target.files[0])}
//           />
//           <label htmlFor="thumbnail-upload">
//             <IconButton component="span" sx={{ color: "#ff4500" }}>
//               <FaCamera />
//             </IconButton>
//           </label>
//           <Typography sx={{ color: "#818384" }}>
//             {thumbnailImage ? thumbnailImage.name : "Upload Thumbnail"}
//           </Typography>
//         </Box>

//         <Button
//           variant="contained"
//           sx={{
//             bgcolor: "#ff4500",
//             color: "#fff",
//             "&:hover": { bgcolor: "#cc3700" },
//             mt: 2,
//           }}
//         >
//           {loading ? (
//             <CircularProgress size={24} sx={{ color: "#fff" }} />
//           ) : (
//             "Update Project"
//           )}
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default UpdateProjectModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Chip,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import axiosInstance from "../../../../../../Auth/Axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdateProjectModal = ({ open, handleClose, projectId, apiBaseUrl }) => {
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const token = localStorage.getItem("token");
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch project data when modal opens
  useEffect(() => {
    if (open && projectId) {
      fetchProjectData();
    }
  }, [open, projectId]);

  const fetchProjectData = async () => {
    setProjectLoading(true);
    try {
      const response = await axiosInstance.get(
        `${apiBaseUrl}/projects/id/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const project = response.data;
      console.log('project data is', project);

      setName(project.project.name || "");
      console.log('project name is', name);
      
      setDescription(project.project.description || "");
      setTags(project.project.tags || []);
    } catch (error) {
      toast.error("Failed to load project data");
    } finally {
      setProjectLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `${apiBaseUrl}/projects/id/${projectId}`,
        {
          name,
          description,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (thumbnailImage) {
        const formData = new FormData();
        formData.append("projectId", projectId);
        formData.append("thumbnailImage", thumbnailImage);

        await axiosInstance.post(
          `${apiBaseUrl}/projects/id/${projectId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Project updated successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1a1a1b",
          borderRadius: "8px",
          boxShadow: 24,
          p: isMobile ? 2 : 4,
          width: isMobile ? "90%" : "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          color: "#fff",
          border: "1px solid gray",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
        >
          <FaTimes />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Update Project
        </Typography>

        {projectLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              sx={{
                bgcolor: "#272729",
                input: { color: "white" },
                label: { color: "white" },
              }}
            />

            <Typography sx={{ mt: 2, mb: 1 }}>Description</Typography>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              style={{ backgroundColor: "#272729", color: "#fff", marginBottom: "20px" }}
            />

            <Typography sx={{ mt: 2, mb: 1 }}>Tags</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {tags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  onDelete={() => {
                    const newTags = [...tags];
                    newTags.splice(idx, 1);
                    setTags(newTags);
                  }}
                  sx={{ bgcolor: "#ff4500", color: "white" }}
                />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <TextField
                label="New Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                fullWidth
                sx={{
                  bgcolor: "#272729",
                  input: { color: "white" },
                  label: { color: "white" },
                }}
              />
              <IconButton
                onClick={() => {
                  if (newTag.trim()) {
                    setTags([...tags, newTag.trim()]);
                    setNewTag("");
                  }
                }}
                sx={{ color: "#fff" }}
              >
                <FaPlus />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <input
                type="file"
                id="thumbnail-upload"
                style={{ display: "none" }}
                onChange={(e) => setThumbnailImage(e.target.files[0])}
              />
              <label htmlFor="thumbnail-upload">
                <IconButton component="span">
                  <FiCamera style={{ color: "white" }} />
                </IconButton>
              </label>
              <Typography sx={{ ml: 2 }}>
                {thumbnailImage ? thumbnailImage.name : "Upload New Thumbnail"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleUpdateProject}
              disabled={loading}
              sx={{ bgcolor: "#ff4500", color: "#fff" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update Project"}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UpdateProjectModal;


