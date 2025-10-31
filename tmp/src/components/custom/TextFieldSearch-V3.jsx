import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

const TextFieldSearch = ({
  startIcon = null,
  onChange = () => {},
  fullWidth = true,
  ...props
}) => {
  const handleReset = (event) => {
    onChange({ target: { name: props.name, value: "" } });
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block", width: fullWidth ? "100%" : "auto" }}>
      {startIcon && (
        <Box
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          {startIcon}
        </Box>
      )}

      <TextField
        onChange={onChange}
        fullWidth={fullWidth}
        {...props}
        sx={{
          paddingLeft: startIcon ? "36px" : undefined, // offset text to avoid icon
          "& .MuiInputBase-input": {
            paddingLeft: startIcon ? "36px" : undefined,
          },
        }}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleReset} size="small" tabIndex={-1}>
              <CloseIcon sx={{ fontSize: "1.3rem" }} />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export default TextFieldSearch;
