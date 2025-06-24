import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Dialog, DialogContent, Typography, Alert } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { isObject } from "../libs/Misc";
import config from "../config";

const storageKey = "jobs"; // TODO: to config

const JobDataImport = ({ onDataImported }) => {
  const {
    secureStorageStatus,
    secureStorageSet,
    //secureStorageGet,
  } = useSecureStorage();

  const navigate = useNavigate();

  //const [open, setOpen] = useState(true);
  const [error, setError] = useState("");

  const handleScan = async (result) => {
    // The 'result' from @yudiel/react-qr-scanner's onScan is an array of detected barcodes.
    // We expect the first one to contain the data.
    console.log("RAW scanned data from QR:", result);
    
    if (!result || result.length === 0 || !result[0].rawValue) return;
    
    try {
      const scannedData = result[0].rawValue; // Access the raw value from the first detected barcode
      //console.log("QRCODE IMPORT:", typeof scannedData, scannedData);

      const decodedData = base64DecodeUnicode(scannedData);

      const payload = JSON.parse(decodedData);

      if (!isObject(payload.data)) {
        throw new Error("Invalid data format in QR code");
      }

      if (Date.now() - payload.timestamp > (60 * config.ui.jobs.qrcode.expirationMinutes * 1000)) {
        throw new Error("QR code is expired");
      }

      if (secureStorageStatus !== "ready") {
        throw new Error("SecureStorage not ready");
      }

      // Store decrypted data securely
      await secureStorageSet(storageKey, payload.data);
      onDataImported(payload.data);
      setError("");
      navigate(-1);
    } catch (err) {
      console.error("JSON parsing error:", err);
      setError(err.message || "Failed to import data");
      navigate(-1);
    }
  };

  const base64DecodeUnicode = (str) => {
    return decodeURIComponent(
      atob(str).split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
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
          navigate(-1);
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
}

export default React.memo(JobDataImport);
