import { useState, useEffect } from "react";
import { Container, Typography, Alert } from "@mui/material";
import QRCode from "react-qr-code";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { maxRowsWithinLimit } from "../libs/Misc";
import { isObject } from "../libs/Misc";
import config from "../config";

const JobDataExport = () => {
  const {
    secureStorageStatus,
    secureStorageGet,
  } = useSecureStorage();

  const [qrValue, setQrValue] = useState("");
  const [warning, setWarning] = useState("");
  //const [truncatedData, setTruncatedData] = useState(null);
  const maxBytes = 2331; // default QR capacity Level L (get this value from a function)
  const [jobsData, setJobsData] = useState(null);

  useEffect(() => {
    if (secureStorageStatus === "ready") {
      secureStorageGet(config.ui.jobs.storageKey).then(data => setJobsData(data));
    }
  }, [secureStorageStatus, secureStorageGet]);
  
  useEffect(() => {
    if (jobsData !== null) {
      handleExport();
    }
  }, [jobsData]);

  // // Wait for SecureStorage ready and get maxBytes from instance
  // useEffect(() => {
  //   if (secureStorageStatus === "ready") {
  //     // Access SecureStorage instance to get QR capacity
  //     const instance = secureStorageGet.__proto__.constructor?.name === "SecureStorage"
  //       ? secureStorageGet.__proto__
  //       : null;
  //     // Alternatively, create a temporary instance to get capacity
  //     // But here we rely on default maxBytes
  //     setMaxBytes(2331);
  //   }
  // }, [secureStorageStatus]);

  const handleExport = async () => {
    if (secureStorageStatus !== "ready") {
      alert("SecureStorage not ready");
      return;
    }
    if (!isObject(jobsData)) {
      alert("Invalid user data format");
      return;
    }

    // Calculate max rows that fit in QR capacity
    const maxItems = maxRowsWithinLimit(jobsData.jobs, maxBytes);

    let JobsDataToExport;
    if (maxItems < jobsData.jobs.length) {
      JobsDataToExport = jobsData.slice(0, maxItems);
      setWarning(
        `Warning: Data truncated to first ${maxItems} items to fit QR code size limit.`
      );
    } else {
      JobsDataToExport = jobsData;
      setWarning("");
    }

    //const JobsDataToExport = jobsData;
    
    try {
      const payload = JSON.stringify({
        data: JobsDataToExport,
        timestamp: Date.now(),
      });

      // Check if payload fits QR (extra check)
      // You can implement checkQrCapacity here if you expose it from SecureStorage
      if (payload.length > maxBytes) {
        alert( // TODO: snackbar, or setWarning
          "Even truncated data is too large for QR code."
        );
        return;
      }

      const base64Payload = base64EncodeUnicode(payload);
      setQrValue(base64Payload);
      //console.log("QRCODE EXPORT:", payload);
      //setTruncatedData(JobsDataToExport);
    } catch (err) {
      alert("Failed to prepare export data: " + err.message);// TODO: snackbar, or setWarning
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
    <Container  maxWidth="xs">
        <Typography variant="h6" gutterBottom>
          Scan QR Code to Import Data
        </Typography>
        {warning && <Alert severity="warning">{warning}</Alert>}
        {qrValue && (
          <div style={{ marginTop: 16, display: "inline-block", background: "transparent", padding: 1 }}>
            <QRCode // TODO: to config...
              value={qrValue}
              size={config.ui.jobs.qrcode.size}
              level={config.ui.jobs.qrcode.level}
            />
          </div>
        )}
        <Typography variant="caption" display="block" mt={2} color="textSecondary">
          {`QR code expires in ${config.ui.jobs.qrcode.expirationMinutes} minutes.`}
      </Typography>
    </Container>
  );
}

export default JobDataExport;
