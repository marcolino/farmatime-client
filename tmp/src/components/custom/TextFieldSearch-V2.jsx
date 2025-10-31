import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";

const TextFieldSearch = ({
  startIcon = null,
  onChange = () => {},
  fullWidth = true,
  ...props
}) => {
  const handleReset = (event) => {
    if (event.target?.name) {
      event.target.value = "";
      onChange(event);
    } else {
      // synthetic event for custom object/value case
      onChange({
        target: { name: props.name, value: "" },
      });
    }
  };

  // Adjust padding if startIcon exists to prevent caret overlapping
  const inputPaddingLeft = startIcon ? "36px" : undefined;

  return (
    <TextField
      onChange={onChange}
      fullWidth={fullWidth}
      sx={{
        "& .MuiInputBase-input": {
          paddingLeft: inputPaddingLeft,
        },
      }}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment
            position="start"
            sx={{
              pt: 0.7,
              pointerEvents: "none", // decorative icon ignores clicks
            }}
            tabIndex={-1} // skip in tab order
          >
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton
            onClick={handleReset}
            size="small"
            tabIndex={-1} // skip in tab order
          >
            <CloseIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>
        ),
      }}
      {...props}
    />
  );
};

export default TextFieldSearch;
