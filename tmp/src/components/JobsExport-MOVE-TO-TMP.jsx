import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Typography, Alert } from "@mui/material";
import QRCode from "qrcode";
import { JobContext } from '../providers/JobContext';
//import { useSecureStorage } from "../hooks/useSecureStorage";
import { maxRowsWithinLimit, isObject } from "../libs/Misc";
//import { AuthContext } from "../providers/AuthContext";
import config from "../config";

const JobsExport = () => {
  // const {
  //   secureStorageStatus,
  //   secureStorageGet,
  //   secureStorageEncrypt
  // } = useSecureStorage();
  //const { auth } = useContext(AuthContext);
  const canvasRef = useRef();
  const [qrValue, setQrValue] = useState("");
  const [warning, setWarning] = useState("");
  // TODO: use job from context, like in JobFlow
  //const [jobsData, setJobsData] = useState(null);
  const { jobs, currentJobId } = useContext(JobContext);

  const maxBytes = 2500;

  // useEffect(() => {
  //   if (secureStorageStatus.status === "ready") {
  //     secureStorageGet(auth?.user?.id ?? "0"/*config.ui.jobs.storageKey*/).then(data => setJobsData(data));
  //   }
  // }, [secureStorageStatus, secureStorageGet, auth?.user?.id]);

  useEffect(() => {
    if (jobs/*jobsData*/ !== null) {
      handleExport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs/*Data*/]);

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
      alert('Failed to generate QR code: ' + err.message); // TODO ...
    }
  };

  const handleExport = async () => {
    if (!isObject(jobs)) {
      throw new Error("Invalid user data format"); // TODO: is it ok to throw here?
    }

    const maxItems = maxRowsWithinLimit(jobs, maxBytes);
    const JobsDataToExport = (maxItems < jobs.length)
      ? { currentJobId, jobs: jobs.slice(0, maxItems) }
      : { currentJobId, jobs };

    if (maxItems < jobs.length) {
      setWarning(`Warning: Data truncated to first ${maxItems} items to fit QR code size limit.`);
    } else {
      setWarning("");
    }

    try {
      const payload = {
        data: JobsDataToExport,
        timestamp: Date.now(),
      };
      const payloadString = JSON.stringify(payload);
      setQrValue(payloadString);
    } catch (err) {
      alert("Failed to prepare export data: " + err.message); // TODO ...
    }
  };

  // const base64EncodeUnicode = (str) => {  
  //   return btoa(
  //     encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
  //       (match, p1) => String.fromCharCode('0x' + p1)
  //     )
  //   );
  // }
  
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
