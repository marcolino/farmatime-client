import { useRef } from 'react';
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
  const containerRef = useRef(null);

  const handleReset = (event) => {
    if (event.target?.name) {
      event.target.value = "";
      onChange(event);
    } else {
      onChange({
        target: { name: props.name, value: "" },
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-block',
        // Add left margin to push the component away from the edge
        marginLeft: '2px'
      }}
    >
      <TextField
        onChange={onChange}
        fullWidth={fullWidth}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{ 
                pt: 0.7, 
                pointerEvents: "none",
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
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
    </div>
  );
};

export default TextFieldSearch;
