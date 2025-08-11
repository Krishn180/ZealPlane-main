import React, { useState, useCallback } from "react";
import {
  Modal,
  Upload,
  Button,
  Spin,
  Progress,
  Typography,
  message,
  Slider,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ScissorOutlined,
} from "@ant-design/icons";
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage"; // helper function to crop

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(profilePic);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isUploaded, setIsUploaded] = useState(false);

  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const MAX_FILE_SIZE_MB = 5;

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const simulateUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);
    setIsUploaded(false);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + 20;
      });
    }, 500);

    setTimeout(() => {
      handleFileChange({
        file: {
          status: "done",
          response: { url: URL.createObjectURL(file) },
        },
      });
      closeModal();
      setIsUploaded(true);
    }, 3000);
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      message.error(`File must be smaller than ${MAX_FILE_SIZE_MB} MB!`);
      return false;
    }

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setFile(file);
    setCropping(true); // Start crop mode
    return true;
  };

  const handleDeleteImage = () => {
    setPreviewImage(null);
    setFile(null);
  };

  const handleChangeClick = () => {
    setFileInputKey(Date.now());
    document.querySelector(`#fileInput-${fileInputKey}`).click();
  };

  const finishCropping = async () => {
    try {
      const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels);
      setPreviewImage(croppedImage);
      setCropping(false);
    } catch (e) {
      console.error(e);
      message.error("Failed to crop image");
    }
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
        {cropping ? (
          <>
            <div className="crop-container" style={{ position: "relative", width: "100%", height: 300 }}>
              <Cropper
                image={previewImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <Text>Zoom:</Text>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(value) => setZoom(value)}
              />
            </div>
            <Button
              icon={<ScissorOutlined />}
              type="primary"
              onClick={finishCropping}
              style={{ marginTop: 10 }}
            >
              Apply Crop
            </Button>
          </>
        ) : previewImage ? (
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
                onClick={() => setCropping(true)}
              >
                Edit
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
