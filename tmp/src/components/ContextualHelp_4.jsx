import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Fade,
  styled
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

const FloatingIconWrapper = styled('div')({
  position: 'absolute',
  display: 'inline-block',
  zIndex: 1,
});

const HelpIconButton = styled(IconButton)(({ theme }) => ({
  bgColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(0.75),
  '&:hover': {
    bgColor: theme.palette.action.hover,
    boxShadow: theme.shadows[4],
  },
}));

const HelpPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  padding: theme.spacing(2),
  maxWidth: 400,
  width: 'max-content',
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
  iconPosition = { top: '0px', right: '0px', bottom: 'auto', left: 'auto' },
  iconSize = 'small',
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [paperPlacement, setPaperPlacement] = useState(placement);
  const iconRef = useRef(null);
  const paperRef = useRef(null);
  const portalRef = useRef(document.createElement('div'));

  useEffect(() => {
    const portalElement = portalRef.current;
    document.body.appendChild(portalElement);
    return () => {
      document.body.removeChild(portalElement);
    };
  }, []);

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open && iconRef.current) {
      const calculatePosition = () => {
        const iconRect = iconRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let newPlacement = placement;
        let top = iconRect.bottom + window.scrollY + 8;
        let left = iconRect.left + window.scrollX;

        if (placement === 'right') {
          left = iconRect.right + window.scrollX + 8;
          top = iconRect.top + window.scrollY;
        } 
        else if (placement === 'left') {
          left = iconRect.left + window.scrollX - 400 - 8;
          top = iconRect.top + window.scrollY;
        }
        else if (placement === 'top') {
          top = iconRect.top + window.scrollY - 200 - 8;
          left = iconRect.left + window.scrollX - 200 + (iconRect.width / 2);
        }
        else if (placement === 'bottom') {
          top = iconRect.bottom + window.scrollY + 8;
          left = iconRect.left + window.scrollX - 200 + (iconRect.width / 2);
        }

        // Boundary checks
        if (left + 400 > viewportWidth + window.scrollX) {
          newPlacement = 'left';
          left = iconRect.left + window.scrollX - 400 - 8;
        }
        if (left < window.scrollX) {
          newPlacement = 'right';
          left = iconRect.right + window.scrollX + 8;
        }
        if (top + 200 > viewportHeight + window.scrollY) {
          top = viewportHeight + window.scrollY - 250;
        }
        if (top < window.scrollY) {
          top = window.scrollY + 50;
        }

        setPosition({ top, left });
        setPaperPlacement(newPlacement);
      };

      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [open, placement]);

  const getArrowStyles = (placement, theme) => {
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
      <FloatingIconWrapper
        ref={iconRef}
        style={{
          top: iconPosition.top,
          right: iconPosition.right,
          bottom: iconPosition.bottom,
          left: iconPosition.left,
        }}
      >
        <Tooltip title="Click for help">
          <HelpIconButton
            onClick={handleToggle}
            color="primary"
            aria-label="contextual help"
            size={iconSize}
          >
            {helpPagesKey ? (HelpPages[helpPagesKey].icon ?? icon) : icon}
          </HelpIconButton>
        </Tooltip>
      </FloatingIconWrapper>
      
      {open && ReactDOM.createPortal(
        <Fade in={open}>
          <HelpPaper
            ref={paperRef}
            elevation={3}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            sx={(theme) => ({
              '&::before': getArrowStyles(paperPlacement, theme)
            })}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                gap: 1,
              }}
            >
              <Typography 
                variant="subtitle2" 
                fontWeight="bold"
                sx={{
                  bgcolor: 'primary.main',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: 'primary.contrastText',
                  flexGrow: 1,
                }}
              >
                {helpPagesKey ? HelpPages[helpPagesKey].title : title}
              </Typography>
              <IconButton
                size="small"
                onClick={handleToggle}
                aria-label="close help"
                sx={{
                  alignSelf: 'flex-start',
                  mt: -0.5,
                  mr: -0.5,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography 
              variant="body2" 
              component="div"
              sx={{
                '& p': {
                  marginBottom: 1,
                  '&:last-child': {
                    marginBottom: 0,
                  }
                },
                '& ul': {
                  pl: 2,
                  mb: 1,
                  '& li': {
                    mb: 0.5,
                  }
                }
              }}
            >
              {helpPagesKey ? HelpPages[helpPagesKey].content : content}
            </Typography>
          </HelpPaper>
        </Fade>,
        portalRef.current
      )}
    </>
  );
};

export default ContextualHelp;
