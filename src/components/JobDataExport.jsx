import { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, Typography, Alert } from "@mui/material";
import QRCode from "react-qr-code";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { maxRowsWithinLimit } from "../libs/Misc";

const JobDataExport = ({ userData }) => { // TODO: we do not use data from parameters, we get it fresh from secureStorageGet
  const {
    secureStorageStatus,
    secureStorageSet,
    secureStorageGet,
  } = useSecureStorage();

  const [qrValue, setQrValue] = useState("");
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState("");
  const [truncatedData, setTruncatedData] = useState(null);
  const [maxBytes, setMaxBytes] = useState(2331); // default QR capacity Level M
  //const [jobData, setJobData] = useState({});
  const [jobsData, setJobsData] = useState([]);

  useEffect(() => {
    if (secureStorageStatus === "ready") {
      secureStorageGet("job").then(data => setJobsData([data]));
      // secureStorageGet("jobs").then(data => setJobsData(data)); // TODO: use this when we will have jobs
    }
  }, [secureStorageStatus, secureStorageGet]);
  
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
    if (!Array.isArray(jobsData)) {
      alert("Invalid user data format");
      return;
    }

    // Calculate max rows that fit in QR capacity
    const maxItems = maxRowsWithinLimit(jobsData, null, maxBytes);

    if (maxItems < jobsData.length) {
      setWarning(
        `Warning: Data truncated to first ${maxItems} items to fit QR code size limit.`
      );
    } else {
      setWarning("");
    }

    const JobsDataToExport = jobsData.slice(0, maxItems);
    console.log("JobsDataToExport:", JobsDataToExport);
    
    try {
      // Encrypt data and prepare QR payload
      // Assuming secureStorageSet encrypts internally; else encrypt here
      // For QR, we need the encrypted string or JSON payload

      // Here, we store encrypted data temporarily in secureStorage and retrieve it for QR
      // Or encrypt inline if you have encryption function exposed

      // For demo, we stringify directly (replace with encryption if needed)
      const payload = JSON.stringify({
        data: JobsDataToExport,
        timestamp: Date.now(),
      });

      // Check if payload fits QR (extra check)
      // You can implement checkQrCapacity here if you expose it from SecureStorage
      if (payload.length > maxBytes) {
        alert(
          "Even truncated data is too large for QR code."
        );
        return;
      }

      setQrValue(payload);
      console.log("QRCODE EXPORT:", payload);
      setTruncatedData(JobsDataToExport);
      setOpen(true);
    } catch (err) {
      alert("Failed to prepare export data: " + err.message);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleExport} disabled={secureStorageStatus !== "ready"}>
        Export Medical Data
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogContent style={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Scan QR Code to Import Data
          </Typography>
          {warning && <Alert severity="warning">{warning}</Alert>}
          {qrValue && (
            <div style={{ marginTop: 16, display: "inline-block", background: "transparent", padding: 1 }}>
              <QRCode
                value={qrValue}
                //size={256}
                size={360}
                //level="M"
                level="L" // "L" = Low (max capacity), "M" = Medium (default), "Q", "H" = High (max redundancy)
              />
            </div>
          )}
          <Typography variant="caption" display="block" mt={2} color="textSecondary"> {/* TODO: 2 minutes to config */}
            QR code expires in 20 minutes.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default JobDataExport;
