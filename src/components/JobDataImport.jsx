import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, Typography, Alert } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner"; // CORRECTED import
import { useSecureStorage } from "../hooks/useSecureStorage";

const JobDataImport = ({ onDataImported }) => {
  const {
    secureStorageStatus,
    secureStorageSet,
    secureStorageGet,
  } = useSecureStorage();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (result) => {
    // The 'result' from @yudiel/react-qr-scanner's onScan is an array of detected barcodes.
    // We expect the first one to contain the data.
    if (!result || result.length === 0 || !result[0].rawValue) return;
    
    const scannedData = result[0].rawValue; // Access the raw value from the first detected barcode
    console.log("QRCODE IMPORT:", typeof scannedData, scannedData);

    try {
      const payload = JSON.parse(scannedData);
      //const payload = scannedData;

      if (!payload.data || !Array.isArray(payload.data)) {
        throw new Error("Invalid data format in QR code");
      }

      if (Date.now() - payload.timestamp > (60 * 20) * 1000) { // TODO: to config
        throw new Error("QR code expired");
      }

      if (secureStorageStatus !== "ready") {
        throw new Error("SecureStorage not ready");
      }

      // Store decrypted data securely
      await secureStorageSet("medicalData", payload.data);
      onDataImported(payload.data);
      setOpen(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to import data");
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} disabled={secureStorageStatus !== "ready"}>
        Import Medical Data
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogContent style={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Scan QR Code
          </Typography>
          
          {/* Updated QR Scanner Component */}
          {open && (
            <Scanner
              onScan={handleScan} // Use onScan for this library
              onError={(error) => setError(error?.message || "Camera error")}
              constraints={{ facingMode: "environment" }}
              styles={{
                container: { width: "100%", maxHeight: "400px", padding: "16px 0" },
                video: { width: "100%", height: "100%" }
              }}
            />
          )}
          
          {error && <Alert severity="error" style={{ marginTop: 16 }}>{error}</Alert>}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default JobDataImport;
