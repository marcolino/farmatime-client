import React, { useState } from "react";
import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from '@mui/icons-material/Close';

const CustomTextFieldSearch = ({
  startIcon = null,
  ...props
}) => {
  props.onChange = props.onChange ?? (() => { }); // without an onChange prop this component is unuseful
  props.fullWidth = props.fullWidth ?? true;

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    props.onChange(event);
  };

  const handleReset = (event) => {
    setSearchValue("");
    event.target.value = "";
    props.onChange(event);
  };

  return (
    <TextField
      onChange={handleSearchChange}
      fullWidth={props.fullWidth} // TODO: from props
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton onClick={handleReset} size="small" >
            <CloseIcon sx={{fontSize: "1.2rem"}} />
          </IconButton>
        )
      }}
      {...props}
    />
  );
};

export default CustomTextFieldSearch;
