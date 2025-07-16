import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Typography, Alert } from "@mui/material";
import QRCode from "qrcode";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { maxRowsWithinLimit, isObject } from "../libs/Misc";
import { AuthContext } from "../providers/AuthContext";
import config from "../config";

const JobsExport = () => {
  const {
    secureStorageStatus,
    secureStorageGet,
    secureStorageEncrypt
  } = useSecureStorage();
  const { auth } = useContext(AuthContext);
  const canvasRef = useRef();
  const [qrValue, setQrValue] = useState("");
  const [warning, setWarning] = useState("");
  const [jobsData, setJobsData] = useState(null);
  const maxBytes = 2500;

  useEffect(() => {
    if (secureStorageStatus.status === "ready") {
      secureStorageGet(auth?.user?.id ?? "0"/*config.ui.jobs.storageKey*/).then(data => setJobsData(data));
    }
  }, [secureStorageStatus, secureStorageGet, auth?.user?.id]);

  useEffect(() => {
    if (jobsData !== null) {
      handleExport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsData]);

  // Generate QR code when qrValue changes
  useEffect(() => {
    if (qrValue && canvasRef.current) {
      generateQRCode(qrValue);
    }
  }, [qrValue]);

  const generateQRCode = async (value) => {
    try {
      await QRCode.toCanvas(canvasRef.current, value, {
        errorCorrectionLevel: config.ui.jobs.qrcode.level,
        margin: 1,
        scale: 4,
        width: config.ui.jobs.qrcode.size || 256
      });
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      alert('Failed to generate QR code: ' + err.message);
    }
  };

  const handleExport = async () => {
    if (secureStorageStatus.status !== "ready") {
      throw new Error(secureStorageStatus.error); // TODO: is it ok to throw here?
    }
    if (!isObject(jobsData)) {
      throw new Error("Invalid user data format"); // TODO: is it ok to throw here?
    }

    const maxItems = maxRowsWithinLimit(jobsData.jobs, maxBytes);
    const JobsDataToExport = (maxItems < jobsData.jobs.length)
      ? { ...jobsData, jobs: jobsData.jobs.slice(0, maxItems) }
      : jobsData;

    if (maxItems < jobsData.jobs.length) {
      setWarning(`Warning: Data truncated to first ${maxItems} items to fit QR code size limit.`);
    } else {
      setWarning("");
    }

    try {
      const payload = {
        data: JobsDataToExport,
        timestamp: Date.now(),
      };

      let value;
      //const QRCodeEncryption = false; // TODO: to config
      //if (QRCodeEncryption) {
      if (config.ui.jobs.qrcode.ecryption) {
        const encrypted = await secureStorageEncrypt(payload);
        const base64Payload = base64EncodeUnicode(JSON.stringify(encrypted));

        if (base64Payload.length > maxBytes) {
          alert("Even truncated encrypted data is too large for QR code.");
          return;
        }
        value = base64Payload;
      } else {
        // Remove the problematic replaceAll - let qrcode.js handle UTF-8 properly
        const payloadString = JSON.stringify(payload);
        value = payloadString;
      }
      setQrValue(value);
    } catch (err) {
      alert("Failed to prepare export data: " + err.message);
    }
  };

  const base64EncodeUnicode = (str) => {  
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode('0x' + p1)
      )
    );
  }
  
  return (
    <Container maxWidth="xs">
      <Typography variant="h6" gutterBottom>
        Scan QR Code to Import Data
      </Typography>
      {warning && <Alert severity="warning">{warning}</Alert>}
      {qrValue && (
        <div style={{ marginTop: 16, display: "inline-block", background: "transparent", padding: 1 }}>
          <canvas 
            ref={canvasRef}
            style={{ display: 'block' }}
          />
        </div>
      )}
      <Typography variant="caption" display="block" mt={2} color="textSecondary">
        {`QR code expires in ${config.ui.jobs.qrcode.expirationMinutes} minutes.`}
      </Typography>
    </Container>
  );
};

export default React.memo(JobsExport);
