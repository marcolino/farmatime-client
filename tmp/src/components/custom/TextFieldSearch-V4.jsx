import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";

const TextFieldSearch = ({
  startIcon = null,
  onChange = () => {},
  fullWidth = true,
  ...props
}) => {
  const handleReset = (event) => {
    onChange({
      target: { name: props.name, value: "" },
    });
  };

  const iconSize = 24; // adjust to your icon size

  return (
    <Box sx={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
      {/* Absolute-positioned start icon */}
      {startIcon && (
        <Box
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none", // click passes through
          }}
        >
          {startIcon}
        </Box>
      )}

      <TextField
        {...props}
        onChange={onChange}
        fullWidth={fullWidth}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleReset} size="small" tabIndex={-1}>
              <CloseIcon sx={{ fontSize: "1.3rem" }} />
            </IconButton>
          ),
        }}
        sx={{
          "& .MuiInputBase-input": {
            paddingLeft: startIcon ? `${iconSize + 12}px` : undefined,
          },
        }}
      />
    </Box>
  );
};

export default TextFieldSearch;
