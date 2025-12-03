import {
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useMediaQueryContext } from "../../providers/MediaQueryContext";

export function SectionHeader({
  bottomIndicator,
  ...props
}) {
  const { isMobile } = useMediaQueryContext();

  // // Calculate fixed heights
  // const headerHeight = isMobile ? 100 : 120; // Fixed total height
  // const contentHeight = isMobile ? 60 : 80; // Height for main content
  // const indicatorAreaHeight = isMobile ? 40 : 40; // Reserved space for indicator

  return (
    <Box sx={{ 
      position: 'relative', 
      mb: isMobile ? 2 : 4,
      height: isMobile ? '100px' : '120px',
    }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: 'primary.main',
          color: 'info.contrastText',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          sx={{
            fontSize: isMobile ? "1.4em!important" : "2.4em!important",
            fontWeight: 'bold',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            height: '100%',
          }}
        >
          {props.children}
        </Typography>
      </Paper>
      
      {/* Indicator overlay positioned at bottom */}
      {bottomIndicator && (
        <Box
          sx={{
            position: 'absolute',
            bottom: isMobile ? 4 : 6,
            right: isMobile ? 8 : 12,
            left: isMobile ? 8 : 12,
            display: 'flex',
            justifyContent: 'flex-end',
            pointerEvents: 'none', // Allow clicks to pass through
          }}
        >
          <Box sx={{ pointerEvents: 'auto' }}> {/* Re-enable for indicator */}
            {bottomIndicator}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SectionHeader;
