import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const StyledTextField = ({
  startIcon = null,
  endIcon = null,
  variant = "outlined",
  fullWidth = true,
  size = "small",
  margin = "dense",
  placeholder = "",
  type = "text",
  ...props
}) => {
  props.variant = props.variant ?? variant;
  props.fullWidth = props.fullWidth ?? fullWidth;
  props.size = props.size ?? size;
  props.margin = props.margin ?? margin;
  props.placeholder = props.placeholder ?? placeholder;
  props.type = props.type ?? type;
  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{pt: props.label ? 0.6 : 0.1}}>
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end" sx={{pt: props.label ? 0.6 : 0.1}}>
            {endIcon}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default StyledTextField;
