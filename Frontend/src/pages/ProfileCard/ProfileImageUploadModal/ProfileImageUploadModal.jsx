import React, { useState } from "react";
import {
  Modal,
  Upload,
  Button,
  Spin,
  Progress,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./ProfileImageUploadModal.scss";

const { Text } = Typography;

const ProfileImageUploadModal = ({
  modalVisible,
  closeModal,
  handleFileChange,
  handleFormSubmit,
  loading,
  profilePic,
  setFile,
}) => {
  const [uploading, setUploading] = useState(false); // Track upload state
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [previewImage, setPreviewImage] = useState(profilePic); // Handle live preview
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Ensure a new key for file input when user changes the image
  const [isUploaded, setIsUploaded] = useState(false); // Track if image is uploaded

  const MAX_FILE_SIZE_MB = 5; // Maximum file size allowed (5 MB)

  const simulateUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);
    setIsUploaded(false); // Reset the uploaded state

    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          setUploading(false);
          setIsUploaded(true); // Mark as uploaded
          return 100;
        }
        return prevProgress + 20;
      });
    }, 500);

    // Simulate successful upload
    setTimeout(() => {
      handleFileChange({
        file: {
          status: "done",
          response: { url: URL.createObjectURL(file) },
        },
      });
      closeModal(); // Close the modal after upload is successful
      setIsUploaded(true);
    }, 3000);
  };

  const handleFileSelect = (file) => {
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      message.error(`File must be smaller than ${MAX_FILE_SIZE_MB} MB!`);
      return false;
    }

    setPreviewImage(URL.createObjectURL(file)); // Set preview
    setFile(file); // Update the file in the parent component
    return true;
  };

  const handleDeleteImage = () => {
    setPreviewImage(null);
    setFile(null);
  };

  const handleChangeClick = () => {
    // Reset the key of the file input to trigger a re-render of the file input field
    setFileInputKey(Date.now());
    document.querySelector(`#fileInput-${fileInputKey}`).click(); // Trigger file input click
  };

  return (
    <Modal
      title="Upload Your Profile Picture"
      visible={modalVisible}
      onCancel={closeModal}
      footer={[
        <Button key="cancel" onClick={closeModal}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleFormSubmit}
          loading={loading}
          disabled={!previewImage}
        >
          {isUploaded ? "OK" : loading ? <Spin /> : "Submit"}
        </Button>,
      ]}
    >
      <div className="upload-container">
        {/* Image Preview */}
        {previewImage ? (
          <div className="image-preview-container">
            <img
              src={previewImage}
              alt="Selected Profile"
              className="image-preview"
              style={{
                maxWidth: "70%",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            />
            <div className="image-preview-actions">
              <Button
                icon={<EditOutlined />}
                className="edit-btn"
                onClick={handleChangeClick}
                onTouchStart={handleChangeClick} // Add support for touch events
              >
                Change
              </Button>
              <Button
                icon={<DeleteOutlined />}
                className="delete-btn"
                danger
                onClick={handleDeleteImage}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          // Upload Component
          <Upload.Dragger
            showUploadList={false}
            beforeUpload={handleFileSelect}
            customRequest={({ file }) => simulateUpload(file)}
            className="upload-dragger"
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Drag & Drop an image here or click to upload
            </p>
            <p className="ant-upload-hint">
              Supports only image files up to 5 MB
            </p>
          </Upload.Dragger>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          id={`fileInput-${fileInputKey}`}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleFileSelect(file);
            }
          }}
        />

        {/* Uploading Progress Bar */}
        {uploading && (
          <div className="progress-container">
            <Text>Uploading...</Text>
            <Progress percent={uploadProgress} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProfileImageUploadModal;
