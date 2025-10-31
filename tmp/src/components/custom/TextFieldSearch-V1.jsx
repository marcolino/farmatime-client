import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from '@mui/icons-material/Close';

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

  return (
    <TextField
      onChange={onChange}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ pt: 0.7, pointerEvents: "none" }}
            tabIndex={-1}
          >
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton
            onClick={handleReset}
            size="small"
            tabIndex={-1}
          >
            <CloseIcon sx={{ fontSize: "1.3rem", pointerEvents: "none" }} />
          </IconButton>
        ),
      }}
      {...props}
    />
  );
};

export default TextFieldSearch;
