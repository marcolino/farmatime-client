import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Alert } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { JobContext } from '../providers/JobContext';
import { isObject } from "../libs/Misc";
import config from "../config";

const JobsImport = ({ onDataImported }) => {
 
  const { setJobs } = useContext(JobContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleScan = async (result) => {
    if (!result || result.length === 0 || !result[0].rawValue) return;

    try {
      const scannedData = result[0].rawValue;
      const value = JSON.parse(scannedData);
      if (!isObject(value.data)) {
        throw new Error("Invalid decrypted QR code format");
      }

      if (Date.now() - value.timestamp > (60 * config.ui.jobs.qrcode.expirationMinutes * 1000)) {
        throw new Error("QR code is expired");
      }

      setJobs(value.data);

      onDataImported(value.data);
      setError("");
      navigate(-1);
    } catch (err) {
      console.error("Import error:", err);
      setError(err.message || "Failed to import data");
      //navigate(-1);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" gutterBottom>
        Scan QR Code
      </Typography>
      <Scanner
        onScan={handleScan}
        onError={error => {
          console.error("SCANNER ERROR:", error);
          setError(error?.message || "Camera error");
          //navigate(-1);
          {/* TODO: on error, we must someway go back after showing the error, or reload the page, because scanner will not try again */}
        }}
        constraints={{ facingMode: "environment" }}
        styles={{
          container: { width: "100%", maxHeight: "400px", padding: "16px 0" },
          video: { width: "100%", height: "100%" }
        }}
      />
      {error && <Alert severity="error" style={{ marginTop: 16 }}>{error}</Alert>}
    </Container>
  );
};

export default React.memo(JobsImport);
