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

const StyledBox = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: theme.spacing(1.5),
  textAlign: 'center',
}));

const StyledPaperSmall = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  
}));

const StyledBoxSmall = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.light,
  color: theme.palette.common.black,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
}));

export { StyledPaper, StyledBox, StyledPaperSmall, StyledBoxSmall };
