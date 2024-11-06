import React from "react";
import { Select, MenuItem, OutlinedInput, FormControl, InputLabel } from "@mui/material";
import { alpha } from "@mui/system";
import { useTheme } from "@mui/material/styles"
import InputAdornment from "@mui/material/InputAdornment";


const StyledSelect = ({
  startIcon = null,
  endIcon = null,
  variant = "outlined",
  fullWidth = true,
  size = "small",
  margin = "dense",
  placeholder = "Search...",
  ...props
}) => {
  props.variant = props.variant ?? variant;
  props.fullWidth = props.fullWidth ?? fullWidth;
  props.size = props.size ?? size;
  props.margin = props.margin ?? margin;
  
  let optionsDisabled = [];
  if (props.optionsDisabled) { // an array (parallel to options) of booleans, to disable relative option
    optionsDisabled = props.optionsDisabled;
    delete props.optionsDisabled;
  }
  
  const theme = useTheme();

  return (
    <FormControl fullWidth={props.fullWidth} sx={{ mt: 1, mb: 0.7 }}>
      <InputLabel sx={{ mt: 0, px: 0.5, color: (props.id === document.activeElement.id) ? "primary.main" : "text.primary", backgroundColor: "background.default" }}>
        {props.label}
      </InputLabel>
      <Select
        sx={{ ...props.sx, my: props.margin === "normal" ? "8px" : props.margin === "dense" ? "5px" : 0}}
        multiple={props.multiple}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {props.multiple ? selected.map((value, index) => (
              <div style={{ margin: 2 }} key={index}>{value}{(index < selected.length - 1) ? ", " : ""}</div>
            )) : (
              <div style={{ margin: 2 }}>{selected}</div>
            )}
          </div>
        )}
        input={variant === "outlined" ?
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                {startIcon}
              </InputAdornment>
            }
            endAdornment={endIcon && (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            )}
          /> : /* TODO: support all component variants (filled|outlined|standard) */ null
        }
        {...props}
      >
        {props.options.sort((a, b) => a.priority - b.priority).map((option, index) => {
          const isSelected = props.multiple ? props.value.includes(option) : props.value === option;
          return (
            <MenuItem
              key={option}
              value={option}
              sx={{
                my: 0.5,
                backgroundColor: isSelected ? alpha(theme.palette.violet.main, 0.4) : "inherit",
                //color: isSelected ? "white" : "inherit", // custom color for selected items
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.violet.main, 0.6),
                  //color: "white", // selected item color
                },
                "&.Mui-selected:hover": {
                  backgroundColor: alpha(theme.palette.violet.main, 0.8), // stronger hover background when selected
                  //color: "white", // ensure text color remains white on hover
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.violet.main, 0.2), // hover color for both selected and non-selected items
                  //color: isSelected ? "white" : "inherit", // ensure selected items keep their white color on hover
                },
              }}
              disabled={optionsDisabled[index]}
            >
              {option}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  );
};

export default StyledSelect;
