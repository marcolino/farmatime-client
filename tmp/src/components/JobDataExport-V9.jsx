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
    //jobsData.jobs[0].medicines[0].option = null; // TODO: TEST ONLY!!!

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

      const QRCodeEncryption = false; // TODO: to config
      let value;
      if (QRCodeEncryption) {
        const encrypted = await secureStorageEncrypt(payload);
        const base64Payload = base64EncodeUnicode(JSON.stringify(encrypted));

        if (base64Payload.length > maxBytes) {
          alert("Even truncated encrypted data is too large for QR code.");
          return;
        }
        value = base64Payload;
      } else {
        const payloadString = JSON.stringify(payload).replaceAll(" • ", "+");
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
