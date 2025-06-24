import { useState, useEffect } from "react";
import { Container, Typography, Alert } from "@mui/material";
import QRCode from "react-qr-code";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { maxRowsWithinLimit, isObject } from "../libs/Misc";
import config from "../config";

const JobDataExport = () => {
  const {
    secureStorageStatus,
    secureStorageGet,
    secureStorageEncrypt
  } = useSecureStorage();
  const [qrValue, setQrValue] = useState("");
  const [warning, setWarning] = useState("");
  const [jobsData, setJobsData] = useState(null);
  const maxBytes = 2500;

  useEffect(() => {
    if (secureStorageStatus === "ready") {
      secureStorageGet(config.ui.jobs.storageKey).then(data => setJobsData(data));
    }
  }, [secureStorageStatus, secureStorageGet]);

  useEffect(() => {
    if (jobsData !== null) {
      handleExport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsData]);

  // Optimize data structure for QR code
  const optimizeDataForQR = (data) => {
    const optimized = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // Remove or minimize fields that can be reconstructed or aren't critical
    if (optimized.jobs) {
      optimized.jobs.forEach(job => {
        // Remove large optional fields
        if (job.emailTemplate && Object.keys(job.emailTemplate).length === 0) {
          delete job.emailTemplate;
        }
        
        // Optimize medicines array
        if (job.medicines) {
          job.medicines.forEach(medicine => {
            // Remove null/undefined values
            Object.keys(medicine).forEach(key => {
              if (medicine[key] === null || medicine[key] === undefined) {
                delete medicine[key];
              }
            });
          });
        }
        
        // Remove empty objects and arrays
        Object.keys(job).forEach(key => {
          if (Array.isArray(job[key]) && job[key].length === 0) {
            delete job[key];
          } else if (typeof job[key] === 'object' && job[key] !== null && Object.keys(job[key]).length === 0) {
            delete job[key];
          }
        });
      });
    }
    
    return optimized;
  };

  const handleExport = async () => {
    if (secureStorageStatus !== "ready") {
      alert("SecureStorage not ready");
      return;
    }
    if (!isObject(jobsData)) {
      alert("Invalid user data format");
      return;
    }


    jobsData.jobs[0].emailTemplate = {}; // TODO: TEST ONLY!!!
    jobsData.jobs[0].medicines[0].option = null; // TODO: TEST ONLY!!!
    
    // First optimize the data structure
    const optimizedData = optimizeDataForQR(jobsData);
    
    // Then apply size-based truncation if needed
    const maxItems = maxRowsWithinLimit(optimizedData.jobs, maxBytes);
    const JobsDataToExport = (maxItems < optimizedData.jobs.length)
      ? { ...optimizedData, jobs: optimizedData.jobs.slice(0, maxItems) }
      : optimizedData;

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

      const encrypted = await secureStorageEncrypt(payload);
      const base64Payload = base64EncodeUnicode(JSON.stringify(encrypted));
      
      console.log(`Payload size: ${base64Payload.length} bytes`); // Debug info

      if (base64Payload.length > maxBytes) {
        alert(`Encrypted data is ${base64Payload.length} bytes, exceeds ${maxBytes} byte limit for QR code.`);
        return;
      }

      setQrValue(base64Payload);
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
          <QRCode
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
};

export default JobDataExport;
