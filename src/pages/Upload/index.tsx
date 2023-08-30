import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "../../shared/SnackbarProvider";
import { uploadCat, UploadResponse } from "../../shared/catService";

export const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | ArrayBuffer | null>("");
  const [backdropOpen, setBackdropOpen] = useState(false);
  const openSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setBackdropOpen(true); // Show the backdrop

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response: UploadResponse | null = await uploadCat(formData);

        if (response) {
          openSnackbar("Upload successful", "success");
          setSelectedFile(null);
          setPreviewSrc("");
          navigate("/");
        } else {
          openSnackbar("Upload failed", "error");
        }
      } catch (error) {
        openSnackbar("Upload failed", "error");
      } finally {
        setBackdropOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen mt-10">
      <h1 className="text-4xl font-bold mb-10">Upload a Cat</h1>
      <div className="w-full max-w-md">
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            className="w-full"
          >
            Select Image
          </Button>
        </label>
        {selectedFile && (
          <div className="mt-4">
            <img
              src={previewSrc as string}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        <div className="mt-4">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="w-full"
          >
            Upload
          </Button>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
