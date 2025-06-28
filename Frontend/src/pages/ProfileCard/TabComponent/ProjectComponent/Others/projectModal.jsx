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

  let profilePic = "";
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decode = jwtDecode(token);
      profilePic = decode?.profilePic || "";
      console.log("Decoded token is:", profilePic);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnailImage: "",
    tags: [],
    subtags: [],
    publisher: "",
    profilePic: profilePic || "",
    username: localStorage.getItem("username"),
    id: Date.now(),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (typeof e === "string") {
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
        subtags: [],
        publisher: "",
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
          backgroundColor: "#2f2f2f",
          color: "#fff",
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
          borderBottom: "1px solid #444",
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
          sx={{ color: "#fff" }}
        >
          <MdClose size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", color: "#fff" }}>
        <TextField
          autoFocus
          margin="dense"
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
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "red",
              },
            },
            "& .MuiFormHelperText-root": {
              color: "#e57373",
            },
          }}
        />

        <Typography variant="body1" sx={{ color: "#818384", mt: 2 }}>
          Description
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <ReactQuill
            value={formData.description}
            onChange={(value) => {
              const cleanValue = value.replace(/style="[^"]*"/g, "");
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
            style={{ backgroundColor: "#272729", color: "white" }}
          />
          {errors.description && (
            <FormHelperText sx={{ color: "#e57373" }}>
              {errors.description}
            </FormHelperText>
          )}
        </FormControl>

        {/* Tag Selector */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel sx={{ color: "#aaa" }}>Tags</InputLabel>
          <Select
            multiple
            value={formData.tags}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                tags: e.target.value,
              }))
            }
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{ backgroundColor: "#444", color: "#fff" }}
                  />
                ))}
              </div>
            )}
            sx={{
              color: "#fff",
              backgroundColor: "#272729",
              "& .MuiSvgIcon-root": { color: "#fff" },
            }}
          >
            <MenuItem value="Graphic Novel">Graphic Novel</MenuItem>
            <MenuItem value="Comic Book">Comic Book</MenuItem>
            <MenuItem value="Manga">Manga</MenuItem>
          </Select>
        </FormControl>

        {/* Subtag Selector */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel sx={{ color: "#aaa" }}>Subtag / Genre</InputLabel>
          <Select
            multiple
            value={formData.subtags}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                subtags: e.target.value,
              }))
            }
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{ backgroundColor: "#444", color: "#fff" }}
                  />
                ))}
              </div>
            )}
            sx={{
              color: "#fff",
              backgroundColor: "#272729",
              "& .MuiSvgIcon-root": { color: "#fff" },
            }}
          >
            <MenuItem value="Fanmade">Fanmade</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
            <MenuItem value="Horror">Horror</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
            <MenuItem value="Action">Action</MenuItem>
          </Select>
        </FormControl>

        {/* Publisher Input */}
        <TextField
          margin="dense"
          name="publisher"
          placeholder="Publisher Name"
          type="text"
          fullWidth
          value={formData.publisher}
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
          {formData.thumbnailImage && (
            <Img
              src={URL.createObjectURL(formData.thumbnailImage)}
              className="Thumbnail-Picture"
              alt="Thumbnail"
              style={{
                width: "100px",
                height: "100px",
                margin: "5px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
        </ContentWrapper>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#333",
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
            backgroundColor: "#e57373",
            "&:hover": {
              backgroundColor: "#c74343",
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

  let profilePic = "";
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decode = jwtDecode(token);
      profilePic = decode?.profilePic || "";
      console.log("Decoded token is:", profilePic);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnailImage: "",
    tags: [],
    subtags: [],
    publisher: "",
    profilePic: profilePic || "",
    username: localStorage.getItem("username"),
    id: Date.now(),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (typeof e === "string") {
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
        subtags: [],
        publisher: "",
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
          backgroundColor: "#2f2f2f",
          color: "#fff",
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
          borderBottom: "1px solid #444",
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
          sx={{ color: "#fff" }}
        >
          <MdClose size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", color: "#fff" }}>
        <TextField
          autoFocus
          margin="dense"
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
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "red",
              },
            },
            "& .MuiFormHelperText-root": {
              color: "#e57373",
            },
          }}
        />

        <Typography variant="body1" sx={{ color: "#818384", mt: 2 }}>
          Description
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <ReactQuill
            value={formData.description}
            onChange={(value) => {
              const cleanValue = value.replace(/style="[^"]*"/g, "");
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
            style={{ backgroundColor: "#272729", color: "white" }}
          />
          {errors.description && (
            <FormHelperText sx={{ color: "#e57373" }}>
              {errors.description}
            </FormHelperText>
          )}
        </FormControl>

        {/* Tag Selector */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel sx={{ color: "#aaa" }}>Tags</InputLabel>
          <Select
            multiple
            value={formData.tags}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                tags: e.target.value,
              }))
            }
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{ backgroundColor: "#444", color: "#fff" }}
                  />
                ))}
              </div>
            )}
            sx={{
              color: "#fff",
              backgroundColor: "#272729",
              "& .MuiSvgIcon-root": { color: "#fff" },
            }}
          >
            <MenuItem value="Graphic Novel">Graphic Novel</MenuItem>
            <MenuItem value="Comic Book">Comic Book</MenuItem>
            <MenuItem value="Manga">Manga</MenuItem>
          </Select>
        </FormControl>

        {/* Subtag Selector */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel sx={{ color: "#aaa" }}>Subtag / Genre</InputLabel>
          <Select
            multiple
            value={formData.subtags}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                subtags: e.target.value,
              }))
            }
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{ backgroundColor: "#444", color: "#fff" }}
                  />
                ))}
              </div>
            )}
            sx={{
              color: "#fff",
              backgroundColor: "#272729",
              "& .MuiSvgIcon-root": { color: "#fff" },
            }}
          >
            <MenuItem value="Fanmade">Fanmade</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
            <MenuItem value="Horror">Horror</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
            <MenuItem value="Action">Action</MenuItem>
          </Select>
        </FormControl>

        {/* Publisher Input */}
        <TextField
          margin="dense"
          name="publisher"
          placeholder="Publisher Name"
          type="text"
          fullWidth
          value={formData.publisher}
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
          {formData.thumbnailImage && (
            <Img
              src={URL.createObjectURL(formData.thumbnailImage)}
              className="Thumbnail-Picture"
              alt="Thumbnail"
              style={{
                width: "100px",
                height: "100px",
                margin: "5px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
        </ContentWrapper>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#333",
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
            backgroundColor: "#e57373",
            "&:hover": {
              backgroundColor: "#c74343",
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
