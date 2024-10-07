import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../libs/Network";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

const ProductTable = () => {
  console.log("*** ProductTable rendered");
  const navigate = useNavigate();
  
  const onEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  useEffect(() => {
    console.log("*** ProductTable mounted");
    let isMounted = true;
    const fetchProducts = async () => {
      const result = await apiCall("get", "/product/getAllProducts");
      if (result.err) {
        console.log("ERROR:", result.message);
      }
    };
  
    fetchProducts();

    return () => {
      console.log("*** ProductTable  unmounted");
      isMounted = false;
    };
  }, []);

  return (
    <>
      <IconButton onClick={() => onEdit(123)}>
        <Edit />
      </IconButton>                        
    </>
  );
};

export default ProductTable;
