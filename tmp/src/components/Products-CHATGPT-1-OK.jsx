import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
//import React, { useState, useEffect, useCallback, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Paper, Typography, Box, Grid, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Search } from "@mui/icons-material";
import { AuthContext } from "../providers/AuthProvider";
import { apiCall } from "../libs/Network";
//import { debounce } from "../libs/Misc";
import { TextFieldSearch, Button } from "./custom";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import config from "../config";

const Products = () => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Function to fetch products from the API
  const fetchProducts = async (code, description) => {
    try {
      setIsSearching(true);
      const filter = { mdaCode: code };
      const result = await apiCall("get", "/product/getProducts", { filter });
      // const response = await axios.get("/products/get", {
      //   params: { code, description },
      // });
      console.log("result.products:", result.products);
      setProducts(result.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced fetch function
  const debouncedFetchProducts = debounce((code, description) => {
    if (code || description) {
      fetchProducts(code, description);
    } else {
      setProducts([]); // Reset products list when filters are empty
    }
  }, 800);

  // Effect to call the debounced fetch function when filters change
  useEffect(() => {
    debouncedFetchProducts(code, description);
    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedFetchProducts.cancel();
      console.log("UNMOUNTED PRODUCTS COMPONENT");
    };
  }, [code, description]);

  // Handlers for input changes
  const handleCodeChange = (e) => setCode(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Handler to reset filters and product list
  const handleReset = () => {
    setCode("");
    setDescription("");
    setProducts([]);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Product Code"
          value={code}
          onChange={handleCodeChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={handleDescriptionChange}
          style={{ marginRight: "10px" }}
        />
        <button onClick={() => fetchProducts(code, description)}>Search</button>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      <div>
        {isSearching ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                <strong>Code:</strong> {product.mdaCode} <br />
                <strong>Description:</strong> {product.imageName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Products;
