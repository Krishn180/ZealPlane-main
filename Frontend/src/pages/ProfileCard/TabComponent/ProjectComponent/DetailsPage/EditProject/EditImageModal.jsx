import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const EditImageUpdate = ({
  imageModalOpen,
  handleImageClose,
  projectId,
  apiBaseUrl,
  onProjectUpdate,
  previousImages = [],
}) => {
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [comicFile, setComicFile] = useState(null);
  const [comicImages, setComicImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const comicFileInputRef = useRef();

  const token = localStorage.getItem("token");

  // 🔹 Preview setup for normal images
  useEffect(() => {
    if (thumbnailImage) {
      const objectUrl = URL.createObjectURL(thumbnailImage);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [thumbnailImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setThumbnailImage(file || null);

    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemovePreview = () => {
    setThumbnailImage(null);
    setImagePreview(null);
    setConfirmDialogOpen(false);
  };

  /* -------------------------
     🖼️ Upload Project Image
  -------------------------- */
  const handleUpdateImage = async () => {
    if (!thumbnailImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to upload images.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("thumbnailImage", thumbnailImage);

      const response = await axios.post(
        `${apiBaseUrl}/projects/id/${projectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Image uploaded successfully!");
        console.log(response.data.comicPages); 
        onProjectUpdate();
        handleImageClose();
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     📘 Upload Comic (PDF)
  -------------------------- */
 const handleComicUpload = async (e) => {
  const file = e?.target?.files?.[0] || comicFile;
  if (!file) return toast.error("No file selected!");
  if (!projectId) return toast.error("Missing Project ID!");
  if (!token) return toast.error("You must be logged in.");

  setComicFile(file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);
  formData.append("type", "comic"); // ✅ NEW: tell backend this is a comic upload

  try {
    setLoading(true);
    console.log("📤 Uploading comic:", file.name);

    const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Response:", response.data);
    const { success, urls, field } = response.data;

    if (!success || !urls) {
      toast.error("Upload failed or invalid backend response.");
      return;
    }

    // ✅ Show the new pages immediately in UI
    setComicImages((prev) => [...prev, ...urls]);

    toast.success(
      field === "comicPages"
        ? "Comic uploaded and processed successfully!"
        : "Image uploaded successfully!"
    );

    // ✅ No need for manual PUT — backend already updates the DB

    // Optionally refresh the project data after upload
    onProjectUpdate?.();
  } catch (err) {
    console.error("❌ Comic upload error:", err);
    if (err.response?.status === 403)
      toast.error("Forbidden: You don't have permission.");
    else toast.error("Comic upload failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal open={imageModalOpen} onClose={handleImageClose}>
      <Box sx={modalStyles}>
        {/* Close Icon */}
        <AiOutlineClose
          onClick={handleImageClose}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 10,
            right: 10,
            color: "white",
            backgroundColor: "#343536",
            borderRadius: "50%",
            padding: "5px",
            cursor: "pointer",
            fontSize: "24px",
          }}
        />

        <Typography variant="h6" sx={{ color: "#d7dadc", mb: 2 }}>
          Add Project Image / Comic
        </Typography>

        {/* Previous images */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {previousImages.length > 0 ? (
            previousImages.map((image, index) => (
              <Grid item xs={4} key={index}>
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#818384" }}>
              No previous images available.
            </Typography>
          )}
        </Grid>

        {/* Preview */}
        {imagePreview && (
          <Box sx={{ mb: 2, position: "relative" }}>
            <Typography variant="body2" sx={{ color: "#818384" }}>
              Selected File Preview:
            </Typography>
            {thumbnailImage?.type.startsWith("image/") ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <Typography sx={{ color: "#818384" }}>
                {thumbnailImage.name}
              </Typography>
            )}

            <Tooltip title="Remove Preview">
              <AiOutlineClose
                onClick={() => setConfirmDialogOpen(true)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "#ff4500",
                  backgroundColor: "#1a1a1b",
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  fontSize: "24px",
                }}
              />
            </Tooltip>
          </Box>
        )}

        {/* Comic PDF Input (hidden) */}
        <input
          type="file"
          accept=".pdf"
          ref={comicFileInputRef}
          onChange={handleComicUpload}
          style={{ display: "none" }}
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpdateImage}
            disabled={loading || !thumbnailImage}
            sx={{
              bgcolor: "#ff4500",
              color: "#fff",
              "&:hover": { bgcolor: "#cc3700" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Upload Image"
            )}
          </Button>

          <Button
            variant="contained"
            onClick={() => comicFileInputRef.current.click()}
            disabled={loading}
            sx={{
              bgcolor: "#007bff",
              color: "#fff",
              "&:hover": { bgcolor: "#0056b3" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Upload Comic (PDF)"
            )}
          </Button>
        </Box>

        {/* Display comic images */}
        {comicImages.length > 0 && (
          <Box sx={{ mt: 3, width: "100%" }}>
            <Typography variant="body2" sx={{ color: "#818384", mb: 1 }}>
              Comic Pages:
            </Typography>
            <Grid container spacing={2}>
              {comicImages.map((url, index) => (
                <Grid item xs={4} key={index}>
                  <img
                    src={url}
                    alt={`Page ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #333",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Confirm Removal Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove the selected preview?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleRemovePreview} color="error">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

/* -------------------------
   🎨 Styles
-------------------------- */
const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: window.innerWidth <= 768 ? 360 : 400,
  bgcolor: "#1a1a1b",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  color: "#d7dadc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  maxHeight: "80vh",
  overflowY: "auto",
};

export default EditImageUpdate;
