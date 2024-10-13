import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function EditProduct() {
  const navigate = useNavigate();
  
  const formCancel = () => {
    navigate(-1);
  }

  return (
    <Button onClick={formCancel}>
      Cancel
    </Button>
  );
}

export default EditProduct;
