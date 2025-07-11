import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Typography,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  FormHelperText,
   Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import ContentWrapper from "../../../../../components/contentWrapper/ContentWrapper";
import Img from "../../../../../components/lazyLoadImage/Img";
import { MdClose } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProjectModal = ({ open, onClose, onSubmit }) => {
  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;
  let profilePic = ""; // Default value if token or profilePic is unavailable
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decode = jwtDecode(token);
      profilePic = decode?.profilePic || ""; // Fallback to empty string if profilePic is missing
      console.log("Decoded token is:", profilePic);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  } else {
    console.log("No token available");
  }

  const MAX_TAGS = 5; // Maximum allowed tags

 const [formData, setFormData] = useState({
  name: "",
  description: "",
  thumbnailImage: "",
  tags: [],
  subtags: [],  // instead of subtag: ""           // ✅ Added
  publisher: "",          // ✅ Added
  profilePic: profilePic || "",
  username: localStorage.getItem("username"),
  id: Date.now(),
});


  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    if (typeof e === "string") {
      // Handling ReactQuill input
      setFormData((prevFormData) => ({
        ...prevFormData,
        description: e,
      }));
    } else if (e.target) {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      thumbnailImage: e.target.files[0],
    }));
  };

  const handleProfilePicChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      profilePic: e.target.files[0],
    }));
  };

  const handleTagAdd = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      if (formData.tags.length < MAX_TAGS) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          tags: [...prevFormData.tags, tagInput],
        }));
        setTagInput("");
      } else {
        console.warn(`You can only add up to ${MAX_TAGS} tags.`);
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: prevFormData.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.name) formErrors.name = "Project Name is required.";
    if (!formData.description)
      formErrors.description = "Project Description is required.";
    if (!formData.thumbnailImage)
      formErrors.thumbnailImage = "Thumbnail Image is required.";
    if (formData.tags.length === 0)
      formErrors.tags = "At least one tag is required.";
    return formErrors;
  };

  const handleSubmit = async () => {
    setErrors({});
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
     setFormData({
  name: "",
  description: "",
  thumbnailImage: "",
  tags: [],
  subtags: [], // ✅ correct             // ✅ Reset
  publisher: "",          // ✅ Reset
  profilePic: profilePic || "",
  username: localStorage.getItem("username"),
  id: Date.now(),
});

      onClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "#2f2f2f", // Dark background color
          color: "#fff", // White text color
          borderRadius: 8,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          borderBottom: "1px solid #444", // Dark border for separation
        }}
      >
        {formData.profilePic && (
          <Img
            src={formData.profilePic}
            className="profile-pic"
            alt="Profile Pic"
            style={{
              width: "100px",
              height: "100px",
              margin: "5px",
              borderRadius: "50%",
            }}
          />
        )}
        Add Comic Project
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "#fff" }} // White icon color
        >
          <MdClose size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", color: "#fff" }}>
        <TextField
          autoFocus
          margin="dense"
          id="projectName"
          name="name"
          placeholder="Project Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
          sx={{
            marginBottom: 2,
            input: { color: "#fff" }, // White text color for input
            "& .MuiFormHelperText-root": {
              color: "#e57373", // Red helper text color
            },
          }}
        />
        {/* <TextField
          margin="dense"
          id="projectDescription"
          name="description"
          placeholder="Project Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          error={!!errors.description}
          helperText={errors.description}
          sx={{
            marginBottom: 2,
            "& .MuiInputBase-root": {
              color: "#fff", // White text color for both input and textarea
            },
            "& .MuiFormHelperText-root": {
              color: "#e57373", // Red helper text color
            },
          }}
        /> */}
        <Typography variant="body1" sx={{ color: "#818384", mt: 2 }}>
          Description
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <ReactQuill
            margin="dense"
            id="projectDescription"
            value={formData.description}
            onChange={(value) => {
              const cleanValue = value.replace(/style="[^"]*"/g, ""); // Remove inline styles
              setFormData((prevFormData) => ({
                ...prevFormData,
                description: cleanValue,
              }));
            }}
            theme="snow"
            formats={[
              "bold",
              "italic",
              "underline",
              "list",
              "bullet",
              "link",
              "image",
            ]}
            // placeholder="Enter project description..."
            style={{ backgroundColor: "#272729", color: "white" }} // Black background & White text
          />
          {errors.description && (
            <FormHelperText sx={{ color: "#e57373" }}>
              {errors.description}
            </FormHelperText>
          )}
        </FormControl>
  {/* Tag Selector */}
{/* Tag Selector */}
{/* Tag Selector */}
<FormControl fullWidth sx={{ marginBottom: 2 }}>
  <InputLabel sx={{ color: "#aaa" }}>Tags</InputLabel>
  <Select
    value={formData.tags[0] || ""}
    onChange={(e) =>
      setFormData((prevFormData) => ({
        ...prevFormData,
        tags: [e.target.value],
      }))
    }
    MenuProps={{
      disableScrollLock: true,
      PaperProps: {
        style: {
          maxHeight: 200,
          overflowY: "auto", // Adds scroll
          backgroundColor: "#2a2a2a",
          color: "#fff",
        },
      },
    }}
    sx={{
      color: "#fff",
      backgroundColor: "#272729",
      "& .MuiSvgIcon-root": { color: "#fff" },
    }}
  >
    {[
      "Graphic Novel", "Comic Book", "Manga", "Webtoon", "One-Shot",
      "Zine", "Anthology", "Motion Comic", "Strip", "Mini Comic",
      "Light Novel", "Illustrated Novel", "Indie", "Digital Comic"
    ].map((tag) => (
      <MenuItem key={tag} value={tag}>
        {tag}
      </MenuItem>
    ))}
  </Select>
</FormControl>


{/* Subtag Selector */}
<FormControl fullWidth sx={{ marginBottom: 2 }}>
  <InputLabel sx={{ color: "#aaa" }}>Subtag / Genre</InputLabel>
  <Select
    value={formData.subtags[0] || ""} // Only one value allowed
    onChange={(e) =>
      setFormData((prevFormData) => ({
        ...prevFormData,
        subtags: [e.target.value],  // Replace array with selected genre
      }))
    }
    MenuProps={{
  disableScrollLock: true, // Prevent body scroll lock
  PaperProps: {
    style: {
      maxHeight: 200,
      backgroundColor: "#2a2a2a",
      color: "#fff",
      zIndex: 1302 // slightly less than modal so it doesn’t over-shadow
    },
  },
}}

    sx={{
      color: "#fff",
      backgroundColor: "#272729",
      "& .MuiSvgIcon-root": { color: "#fff" },
    }}
  >
    {[
      "Action",
      "Adventure",
      "Horror",
      "Drama",
      "Fantasy",
      "Sci-Fi",
      "Comedy",
      "Mystery",
      "Historical",
      "Romance",
      "Slice of Life",
      "Thriller",
      "Fanmade",
      "Psychological",
      "Post-Apocalyptic",
      "Crime"
    ].map((genre) => (
      <MenuItem key={genre} value={genre}>
        {genre}
      </MenuItem>
    ))}
  </Select>
</FormControl>


{/* Publisher Input */}
<TextField
  margin="dense"
  name="publisher"
  placeholder="Publisher Name"
  type="text"
  fullWidth
  value={formData.publisher || ""}
  onChange={handleChange}
  sx={{
    marginBottom: 2,
    input: { color: "#fff" },
    "& .MuiFormHelperText-root": {
      color: "#aaa",
    },
  }}
/>

        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: 16 }}
        />
        {errors.thumbnailImage && (
          <p style={{ color: "#e57373" }}>{errors.thumbnailImage}</p>
        )}
        <ContentWrapper>
          <div>
            {formData.thumbnailImage && (
              <Img
                src={URL.createObjectURL(formData.thumbnailImage)}
                className="Thumbnail-Picture"
                alt="Thumbnail"
                style={{
                  width: "100px", // Set the desired width
                  height: "100px", // Maintain aspect ratio
                  margin: "5px",
                  borderRadius: "8px", // Optional: Add rounded corners
                  objectFit: "cover", // Ensure the image fits nicely
                }}
              />
            )}
          </div>
        </ContentWrapper>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#333", // Dark background for actions section
          color: "#fff",
          padding: "10px",
        }}
      >
        <Button onClick={onClose} sx={{ color: "#fff" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#e57373", // Light red color for submit button
            "&:hover": {
              backgroundColor: "#c74343", // Darker red for hover effect
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal;
