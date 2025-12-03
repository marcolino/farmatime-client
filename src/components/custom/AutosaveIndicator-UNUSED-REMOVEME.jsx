import { Box, } from "@mui/material";
//import config from "../../config";

const AutosaveIndicator = ({ message, indicator }) => {

  /* Autosave notification overlay */
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      height: '30px', // Fixed height to prevent layout shift
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      pointerEvents: 'none', // Allow clicks to pass through to underlying elements
      px: 3,
      pb: 1,
    }}
  >
    <Box
      sx={{
        bgcolor: 'error.main',
        color: 'white',
        px: 2,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.875rem',
        fontWeight: 'medium',
        maxWidth: '70%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'right',
        pointerEvents: 'auto', // re-enable pointer events for this element
      }}
    >
      {message} {indicator}
    </Box>
  </Box>
};

export default AutosaveIndicator;
