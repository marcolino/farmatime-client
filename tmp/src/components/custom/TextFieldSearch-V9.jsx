import { useRef } from 'react';
import TextField from "./TextField";
import IconButton from "@mui/material/IconButton";
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

  const handleLeftClickGuard = (e) => {
    // Only prevent the buggy behavior for left-clicks outside the input
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-block'
      }}
    >
      {/* Tiny invisible guard for left-clicks only */}
      <div
        style={{
          position: 'absolute',
          left: '-3px',
          top: '2px',
          bottom: '2px',
          width: '3px',
          zIndex: 1,
          backgroundColor: 'transparent',
        }}
        onClick={handleLeftClickGuard}
        onMouseDown={handleLeftClickGuard}
      />
      
      <TextField
        onChange={onChange}
        fullWidth={fullWidth}
        startIcon={startIcon}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={handleReset}
              size="small"
              tabIndex={-1}
            >
              <CloseIcon sx={{ fontSize: "1.3rem" }} />
            </IconButton>
          ),
        }}
        {...props}
      />
    </div>
  );
};

export default TextFieldSearch;
