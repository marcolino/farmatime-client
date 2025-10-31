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
  //type = "text",
  ...props
}) => {
  const resolvedVariant = props.variant ?? variant;
  const resolvedFullWidth = props.fullWidth ?? fullWidth;
  const resolvedSize = props.size ?? size;
  const resolvedMargin = props.margin ?? margin;
  const resolvedPlaceholder = props.placeholder ?? placeholder;

  return (
    <TextField
      variant={resolvedVariant}
      fullWidth={resolvedFullWidth}
      size={resolvedSize}
      margin={resolvedMargin}
      placeholder={resolvedPlaceholder}
      slotProps={{
        input: {
          startAdornment: startIcon && (
            <InputAdornment
              position="start"
              sx={{ pt: props.label ? 0.6 : 0.1, pointerEvents: "none"}}
            >
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment
              position="end"
              sx={{ pt: props.label ? 0.6 : 0.1, pointerEvents: "auto" }}
            >
              {endIcon}
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
};

export default StyledTextField;
