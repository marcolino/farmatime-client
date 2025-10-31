import { useRef, useEffect } from 'react';
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
  const inputRef = useRef(null);
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

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (containerRef.current && 
          !containerRef.current.contains(e.target) &&
          inputRef.current &&
          document.activeElement === inputRef.current) {
        // If click is outside AND input has focus, blur it
        inputRef.current.blur();
      }
    };

    /**
     * To avoid Chrome's bug to give input focus to InputAdornments:
     * when users click outside this component, don't do ANY of your default focus behaviors
     */
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Prevent any focus behavior when clicking outside
        e.preventDefault();
        
        // Force clear any selections
        window.getSelection()?.removeAllRanges();
        
        // Ensure nothing is focused
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <TextField
        inputRef={inputRef}
        onChange={onChange}
        fullWidth={fullWidth}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment
              position="start"
              sx={{ 
                pt: 0.7, 
                pointerEvents: "none",
                // Additional protection
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
              tabIndex={-1}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              onClick={handleReset}
              size="small"
              tabIndex={-1}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <CloseIcon sx={{ fontSize: "1.3rem", pointerEvents: "none" }} />
            </IconButton>
          ),
          // Additional input protection
          sx: {
            '& .MuiInputBase-input': {
              userSelect: 'text',
              WebkitUserSelect: 'text',
            }
          }
        }}
        // Prevent focus from being stolen
        onFocus={(e) => {
          // Only allow focus if the click was actually on the input
          const isDirectClick = e.target === inputRef.current;
          if (!isDirectClick) {
            e.target.blur();
          }
        }}
        {...props}
      />
    </div>
  );
};

export default TextFieldSearch;
