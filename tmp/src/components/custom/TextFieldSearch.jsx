import React, { useState } from "react";
import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from '@mui/icons-material/Close';

const CustomTextFieldSearch = ({
  startIcon = null,
  ...props
}) => {
  props.onChange = props.onChange ?? (() => { });
  props.fullWidth = props.fullWidth ?? true;

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    props.onChange(event);
  };

  const handleReset_ORIG = (event) => {
    setSearchValue("");
    event.target.value = "";
    props.onChange(event);
  };

  const handleReset = (event) => {
    setSearchValue("");
    if (event.target.name) { // standard case, where name and value are present (regular variable as value)
      event.target.value = "";
      props.onChange(event);
    } else { // manually create a synthetic event with the desired name and value
      const syntheticEvent = { // special case, where name is not present (object variable with prop as value)
        target: {
          name: props.name, // use the correct name from props
          value: "", // reset value
        },
      };
      props.onChange(syntheticEvent);
    }
  };
  

  return (
    <TextField
      onChange={handleSearchChange}
      fullWidth={props.fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{pt: 0.7}}>
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton onClick={handleReset} size="small">
            <CloseIcon sx={{fontSize: "1.3rem"}} />
          </IconButton>
        )
      }}
      {...props}
    />
  );
};

export default CustomTextFieldSearch;
