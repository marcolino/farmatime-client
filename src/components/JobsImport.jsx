import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Alert } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
//import { useSecureStorage } from "../hooks/useSecureStorage";
import { JobContext } from '../providers/JobContext';
import { isObject } from "../libs/Misc";
import { AuthContext } from "../providers/AuthContext";
import config from "../config";

const JobsImport = ({ onDataImported }) => {
  // const {
  //   secureStorageStatus,
  //   secureStorageSet,
  //   secureStorageDecrypt,
  // } = useSecureStorage();
  //const { auth } = useContext(AuthContext);
  const { jobs, setJobs, currentJobId } = useContext(JobContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleScan = async (result) => {
    if (!result || result.length === 0 || !result[0].rawValue) return;

    try {
      const scannedData = result[0].rawValue;

      //const decrypted = JSON.parse(scannedData);

      // const QRCodeEncryption = false; // TODO: to config
      let value;
      // if (QRCodeEncryption) {
      //   const decodedStr = base64DecodeUnicode(scannedData);
      //   const encryptedPayload = JSON.parse(decodedStr);

      //   if (secureStorageStatus.status !== "ready") {
      //     throw new Error("SecureStorage not ready");
      //   }

      //   const decrypted = await secureStorageDecrypt(encryptedPayload);
      //   value = decrypted;
      // } else {
        value = JSON.parse(scannedData);
      // }

      if (!isObject(value.data)) {
        throw new Error("Invalid decrypted QR code format");
      }

      if (Date.now() - value.timestamp > (60 * config.ui.jobs.qrcode.expirationMinutes * 1000)) {
        throw new Error("QR code is expired");
      }

      //await secureStorageSet(auth?.user?.id ?? "0"/*config.ui.jobs.storageKey*/, value.data);
      setJobs(value.data); // TODO: ???

      onDataImported(value.data);
      setError("");
      navigate(-1);
    } catch (err) {
      console.error("Import error:", err);
      setError(err.message || "Failed to import data");
      //navigate(-1);
    }
  };

  // const base64DecodeUnicode = (str) => {
  //   try {
  //     const binaryStr = atob(str);
  //     return decodeURIComponent(
  //       binaryStr.split('').map(c =>
  //         '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  //       ).join('')
  //     );
  //   } catch (e) {
  //     console.error("Corrupted string in base64DecodeUnicode", str.slice(0, 20), e);
  //     return 
  //   }
  // };

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
          {/* TODO: on error, we must go back after showing the error, or reload the page, because scanner will not try again */}
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
