import React, { useState, useEffect, useRef } from "react";
import { Button, Dialog, DialogContent, Typography, Alert } from "@mui/material";
import QrScanner from "qr-scanner"; // npm install qr-scanner
import { useSecureStorage } from "../hooks/useSecureStorage";

const storageKey = "jobs"; // TODO: to config

const JobDataImport = ({ onDataImported }) => {
  const {
    secureStorageStatus,
    secureStorageSet,
  } = useSecureStorage();

  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!open || !videoRef.current) return;

    // Initialize the scanner
    scannerRef.current = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!result) return;
        console.log("RAW scanned data from QR:", result);

        try {
          // If you used base64 encoding with encodeURIComponent on export, decode here:
          // const decoded = decodeURIComponent(atob(result));
          // const payload = JSON.parse(decoded);

          // Otherwise, parse directly:
          const payload = JSON.parse(result);

          if (!payload.data || !Array.isArray(payload.data)) {
            throw new Error("Invalid data format in QR code");
          }

          if (Date.now() - payload.timestamp > 20 * 60 * 1000) { // 20 minutes expiry
            throw new Error("QR code expired");
          }

          if (secureStorageStatus !== "ready") {
            throw new Error("SecureStorage not ready");
          }

          await secureStorageSet(storageKey, payload.data);
          onDataImported(payload.data);
          setError("");
          setOpen(false);
        } catch (err) {
          console.error("Import error:", err);
          setError(err.message || "Failed to import data");
        }
      },
      {
        // Optional: highlight scan region, etc.
        highlightScanRegion: true,
        // You can specify preferred camera here:
        // preferredCamera: 'environment',
      }
    );

    // Start the scanner
    scannerRef.current.start().catch(err => {
      console.error("Failed to start scanner:", err);
      setError("Failed to start camera: " + err.message);
    });

    return () => {
      // Cleanup on unmount or dialog close
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [open, secureStorageStatus, secureStorageSet, onDataImported]);

  return (
    <>
      {/* Optional: A button to open the dialog */}
      {/* <Button variant="contained" onClick={() => setOpen(true)} disabled={secureStorageStatus !== "ready"}>
        Import Medical Data
      </Button> */}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogContent style={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Scan QR Code
          </Typography>

          <video
            ref={videoRef}
            style={{ width: "100%", maxHeight: 400, borderRadius: 8, backgroundColor: "#000" }}
            muted
            playsInline
          />

          {error && <Alert severity="error" style={{ marginTop: 16 }}>ALERT: {error}</Alert>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(JobDataImport);
