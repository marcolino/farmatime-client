import {
  Box,
  Paper,
  styled
} from 'mui-material-custom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

const StyledPaperSmall = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  
}));

const StyledBox = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: theme.spacing(1.5),
  textAlign: 'center',
}));

const StyledBoxSmall = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.light,
  color: theme.palette.common.black,
  padding: theme.spacing(1.3),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

export { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall };
