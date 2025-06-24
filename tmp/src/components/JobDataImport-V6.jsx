import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Alert } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { isObject, base64UrlDecode } from "../libs/Misc";
import config from "../config";

const storageKey = "jobs";

const JobDataImport = ({ onDataImported }) => {
  const {
    secureStorageStatus,
    secureStorageSet,
    secureDecrypt,
  } = useSecureStorage();

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleScan = async (result) => {
    if (!result || result.length === 0 || !result[0].rawValue) return;

    try {
      const raw = result[0].rawValue;
      const decodedPayload = JSON.parse(base64UrlDecode(raw));
      const { data, timestamp } = decodedPayload;

      if (Date.now() - timestamp > config.ui.jobs.qrcode.expirationMinutes * 60 * 1000) {
        throw new Error("QR code is expired");
      }

      // if (!data || typeof data !== "string") {
      //   throw new Error("Invalid encrypted payload format");
      // }

      if (secureStorageStatus !== "ready") {
        throw new Error("SecureStorage not ready");
      }

      const decrypted = await secureDecrypt(data);
      if (!isObject(decrypted)) throw new Error("Decrypted payload is invalid");

      await secureStorageSet(storageKey, decrypted);
      onDataImported(decrypted);
      setError("");
      navigate(-1);
    } catch (err) {
      console.error("QR import failed:", err);
      setError(err.message || "Failed to import data");
      navigate(-1);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" gutterBottom>
        Scan QR Code
      </Typography>
      <Scanner
        onScan={handleScan}
        onError={err => {
          console.error("Scanner error:", err);
          setError(err?.message || "Camera error");
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
};

export default React.memo(JobDataImport);
