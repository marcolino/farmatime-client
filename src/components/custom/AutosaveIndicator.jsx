import { Box, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';


const AutosaveIndicator = ({ 
  status, 
  lastSaveTime,
  errorMessage,
  onRetry,
  maxWidth = '100%'
}) => {
  const { t } = useTranslation();

  // Return empty fragment if nothing to show (but space is still reserved)
  if (status === 'idle' && !lastSaveTime) {
    return null; // Or return <></> to keep space reserved but empty
  }

 let message = '';
  let bgColor = 'text.secondary';
  let textColor = 'white';
  let indicator = null;
  let showRetry = false;

  switch (status) {
    case 'saving':
      message = t('Saving...');
      bgColor = 'transparent';
      indicator = '🟡';
      break;
    case 'saved':
      message = t('All changes saved');
      bgColor = 'transparent';
      indicator = '🟢';
      break;
    case 'error':
      message = errorMessage || t('Error saving changes');
      bgColor = 'error.main';
      indicator = '🔴';
      showRetry = true;
      break;
    default:
      if (lastSaveTime) {
        const seconds = Math.floor((Date.now() - lastSaveTime) / 1000);
        if (seconds < 60) {
          message = t('Saved just now');
        } else if (seconds === 60) {
          message = t('Saved 1 minute ago');
        } else {
          message = t('Saved {{minutes}} minutes ago', { 
            minutes: Math.floor(seconds / 60) 
          });
        }
        if (seconds > 180) {
          indicator = null;
        }
        bgColor = 'transparent';
      }
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        maxWidth: (status === 'error') ? maxWidth : null,
        boxShadow: (status === 'error') ? 2 : 0, // Add shadow for better visibility
      }}
    >
      <Box
        sx={{
          display: 'flex',
          bgcolor: bgColor,
          color: textColor,
          borderRadius: '4px',
          overflow: 'hidden',
          maxWidth: '100%',
        }}
      >
        {/* Message section */}
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            fontSize: '0.875rem',
            fontWeight: 'medium',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexShrink: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}
          >
            {status === 'error' ? message : indicator}
          </Typography>
        </Box>
        
        {/* Retry section */}
        {showRetry && onRetry && (
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              fontSize: '0.875rem',
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'error.dark',
              borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Link 
              sx={{ 
                color: 'white', 
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                lineHeight: 1.2,
                '&:hover': {
                  color: 'grey.300',
                }
              }}
              onClick={onRetry}
            >
              {t('Retry now')}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AutosaveIndicator;
