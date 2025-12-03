import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box } from '@mui/material';

const MonetizationOnBarredIcon = ({ sx = {}, ...iconProps }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block', ...sx }}>
      <MonetizationOnIcon {...iconProps} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '4px',
            height: '90%',
            backgroundColor: iconProps.color ? `${iconProps.color}.main` : 'black',
            transform: 'rotate(45deg)',
            top: '-3%',
            left: '45%',
            transformOrigin: 'center',
          },
        }}
      />
    </Box>
  );
};

export default MonetizationOnBarredIcon;
