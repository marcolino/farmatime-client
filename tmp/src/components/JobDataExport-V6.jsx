import { useState, useEffect } from "react";
import { Container, Typography, Alert } from "@mui/material";
import QRCode from "react-qr-code";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { /*maxRowsWithinLimit, */isObject, base64UrlEncode, bestFitQrPayload } from "../libs/Misc";
import config from "../config";

const JobDataExport = () => {
  const {
    secureStorageStatus,
    secureStorageGet,
    secureEncrypt,
  } = useSecureStorage();

  const [qrValue, setQrValue] = useState("");
  const [warning, setWarning] = useState("");
  const maxBytes = 5000 // Better readability (configurable)
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

  const handleExport = async () => {
    if (secureStorageStatus !== "ready") {
      alert("SecureStorage not ready");
      return;
    }

    if (!isObject(jobsData)) {
      alert("Invalid user data format");
      return;
    }

    const bestFit = await bestFitQrPayload(jobsData.jobs, maxBytes, secureEncrypt);
    const { payloadObject, truncatedCount, success, reason } = bestFit;

    if (!success) {
      setWarning(reason);
      return;
    }

    if (truncatedCount > 0) {
      setWarning(`Warning: Data truncated to first ${jobsData.jobs.length - truncatedCount} items.`);
    } else {
      setWarning("");
    }

    const base64Encoded = base64UrlEncode(JSON.stringify(payloadObject));
    setQrValue(base64Encoded);
  };

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
