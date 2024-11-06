import React, { useState, useEffect } from "react";
//import axios from "axios";
import debounce from "lodash.debounce";
//import React, { useState, useEffect, useCallback, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Paper, Typography, Box, Grid, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Search } from "@mui/icons-material";
import { AuthContext } from "../providers/AuthProvider";
import { apiCall } from "../libs/Network";
import { TextFieldSearch, Button } from "./custom";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import config from "../config";

const Products = () => {
  const [filters, setFilters] = useState({
    code: "",
    description: "",
    category: "",
    priceMin: "",
    priceMax: "",
    stockStatus: "",
  });
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Function to fetch products from the API
  const fetchProducts = async (filters) => {
    try {
      setIsSearching(true);
      const result = await apiCall("get", "/product/getProducts", filters/*{ mdaCode: code }*/);
      console.log("result.products:", result.products);
      setProducts(result.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced fetch function
  const debouncedFetchProducts = debounce((filters) => {
    const hasFilters = Object.values(filters).some((value) => value !== "");
    if (hasFilters) {
      fetchProducts(filters);
    } else {
      setProducts([]); // Reset products list when filters are empty
    }
  }, 800);

  // Effect to call the debounced fetch function when filters change
  useEffect(() => {
    debouncedFetchProducts(filters);
    // Cleanup function to cancel debounce on unmount
    return () => {
      //debouncedFetchProducts.cancel();
    };
  }, [filters]);

  // Handler for input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handler to reset filters and product list
  const handleReset = () => {
    setFilters({
      code: "",
      description: "",
      category: "",
      priceMin: "",
      priceMax: "",
      stockStatus: "",
    });
    setProducts([]);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="code"
          placeholder="Product Code"
          value={filters.code}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={filters.description}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={handleFilterChange}
        />
        <select
          name="stockStatus"
          value={filters.stockStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Stock Statuses</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
        <button onClick={() => fetchProducts(filters)}>Search</button>
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
