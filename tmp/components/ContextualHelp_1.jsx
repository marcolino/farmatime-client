import { useState } from 'react';
import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Fade,
  styled
} from '@mui/material';
//import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
//import { icon } from 'leaflet';

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

const HelpPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  padding: theme.spacing(2),
  //maxWidth: 300,
  width: 'max-content',
  zIndex: theme.zIndex.tooltip,
  boxShadow: theme.shadows[4],
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid'
  }
}));

const LeftPositionedPaper = styled(HelpPaper)(({ theme }) => ({
  right: '100%',
  marginRight: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  '&::before': {
    right: -8,
    top: '50%',
    transform: 'translateY(-50%)',
    borderWidth: '8px 0 8px 8px',
    borderColor: `transparent transparent transparent ${theme.palette.background.paper}`
  }
}));

const RightPositionedPaper = styled(HelpPaper)(({ theme }) => ({
  left: '100%',
  marginLeft: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  '&::before': {
    left: -8,
    top: '50%',
    transform: 'translateY(-50%)',
    borderWidth: '8px 8px 8px 0',
    borderColor: `transparent ${theme.palette.background.paper} transparent transparent`
  }
}));

const TopPositionedPaper = styled(HelpPaper)(({ theme }) => ({
  bottom: '100%',
  marginBottom: theme.spacing(1),
  left: '50%',
  transform: 'translateX(-50%)',
  '&::before': {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '8px 8px 0 8px',
    borderColor: `${theme.palette.background.paper} transparent transparent transparent`
  }
}));

const BottomPositionedPaper = styled(HelpPaper)(({ theme }) => ({
  top: '100%',
  marginTop: theme.spacing(1),
  left: '50%',
  transform: 'translateX(-50%)',
  '&::before': {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '0 8px 8px 8px',
    borderColor: `transparent transparent ${theme.palette.background.paper} transparent`
  }
}));

const ContextualHelp = ({
  title = 'Help',
  content,
  icon = <InfoIcon />,
  placement = 'right',
  helpPagesKey = null,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const PositionedPaper = {
    left: LeftPositionedPaper,
    right: RightPositionedPaper,
    top: TopPositionedPaper,
    bottom: BottomPositionedPaper
  }[placement];

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Tooltip title="Click for info">
        <IconButton
          onClick={handleToggle}
          color="primary"
          aria-label="contextual help"
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          {helpPagesKey ? (HelpPages[helpPagesKey].icon ?? icon) : icon}
        </IconButton>
      </Tooltip>

      <Fade in={open}>
        <PositionedPaper elevation={3}>
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
                borderRadius: '4px'
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
        </PositionedPaper>
      </Fade>
    </Box>
  );
};

export default ContextualHelp;
