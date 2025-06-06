import { useState, useRef, useEffect } from 'react';
import {
  IconButton,
  Box,
  Paper,
  Typography,
  //Tooltip,
  Fade,
  styled,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const HelpPages = {
  "MedicineName": {
    title: "Medicine Name",
    content: (
      <div>
        <p>
          Enter the name of the medicine, its active ingredient, or its ATC code.
        </p>
        <p>
          You can use the autocomplete feature to help you find the correct medicine.
        </p>
        <ul>
          <li>Point 1 ...</li>
          <li>Point 2 ...</li>
        </ul>
      </div>
    ),
  },
  "DateSince": {
    title: "Date of first request",
    content: (
      <div>
        <p>
          Enter the date when the first request to the doctor should be made.
        </p>
      </div>
    ),
  },
};

const FloatingIconButton = styled(IconButton)(({ theme, offset }) => ({
  position: 'absolute',
  top: offset?.top ?? 'auto',
  bottom: offset?.bottom ?? 'auto',
  left: offset?.left ?? 'auto',
  right: offset?.right ?? 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(0.75),
  zIndex: 1,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[4],
  },
}));

const HelpPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  padding: theme.spacing(2),
  maxWidth: 'min(400px, 90vw)',
  zIndex: theme.zIndex.tooltip,
  boxShadow: theme.shadows[6],
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid'
  }
}));

const ContextualHelp = ({
  title = 'Help',
  content,
  icon = <InfoIcon fontSize="small" />,
  placement = 'right',
  helpPagesKey = null,
  iconOffset = { top: '-8px', right: '-8px' },
  iconSize = 'small',
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [paperPlacement, setPaperPlacement] = useState(placement);
  const iconRef = useRef(null);
  const paperRef = useRef(null);
  const theme = useTheme();
  
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open && iconRef.current) {
      const calculatePosition = () => {
        const iconRect = iconRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Default to right placement
        let newPlacement = placement;
        let top = iconRect.top;
        let left = iconRect.right + 8;

        // Check if right placement would go off screen
        if (left + 400 > viewportWidth) {
          newPlacement = 'left';
          left = iconRect.left - 400 - 8;
        }

        // Check vertical position
        if (top + 200 > viewportHeight) {
          top = viewportHeight - 250;
        } else if (top < 50) {
          top = 50;
        }

        setPosition({ top, left });
        setPaperPlacement(newPlacement);
      };

      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [open, placement]);

  const getArrowStyles = (placement) => {
    switch (placement) {
      case 'left':
        return {
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '8px 0 8px 8px',
          borderColor: `transparent transparent transparent ${theme.palette.background.paper}`
        };
      case 'top':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '8px 8px 0 8px',
          borderColor: `${theme.palette.background.paper} transparent transparent transparent`
        };
      case 'bottom':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 8px 8px 8px',
          borderColor: `transparent transparent ${theme.palette.background.paper} transparent`
        };
      default: // right
        return {
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '8px 8px 8px 0',
          borderColor: `transparent ${theme.palette.background.paper} transparent transparent`
        };
    }
  };

  return (
    <>
      <FloatingIconButton
        ref={iconRef}
        onClick={handleToggle}
        color="primary"
        aria-label="contextual help"
        offset={iconOffset}
        size={iconSize}
      >
        {helpPagesKey ? (HelpPages[helpPagesKey].icon ?? icon) : icon}
      </FloatingIconButton>

      {open && (
        <Fade in={open}>
          <HelpPaper
            ref={paperRef}
            elevation={3}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            sx={{
              '&::before': getArrowStyles(paperPlacement)
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold"
                sx={{
                  bgcolor: 'primary.main',
                  flexGrow: 1,
                  padding: '4px 8px',
                  marginRight: 1,
                  borderRadius: '4px',
                  color: 'primary.contrastText'
                }}>
                {helpPagesKey ? HelpPages[helpPagesKey].title : title}
              </Typography>
              <IconButton
                size="small"
                onClick={handleToggle}
                aria-label="close help"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" component="div">
              {helpPagesKey ? HelpPages[helpPagesKey].content : content}
            </Typography>
          </HelpPaper>
        </Fade>
      )}
    </>
  );
};

export default ContextualHelp;
