import React from 'react';
import { Button, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const StyledButton = styled(Button)(({ theme, color, fullWidth, variant }) => ({
  minWidth: 0,
  margin: theme.spacing(0.5),
  backgroundColor: color ? theme.palette[color].light : undefined,
  fullWidth: fullWidth || true,
  variant: variant || "contained",
}));

export default StyledButton;

// const StyledButton = styled(Button)(({ theme, customBgColor }) => ({
//   backgroundColor: customBgColor || theme.palette.primary.main,
//   color: theme.palette.primary.contrastText,
//   '&:hover': {
//     backgroundColor: customBgColor ? theme.palette.action.hover : theme.palette.primary.dark,
//   },
// }));

// const CustomButton = ({ variant, backgroundColor, fullWidth, ...props }) => {
//   const theme = useTheme();

//   return (
//     <StyledButton
//       variant={variant || "outlined"}
//       fullWidth={fullWidth || true}
//       customBgColor={backgroundColor}
//       sx={{my: 1}}
//       {...props}
//     >
//       {props.children}
//     </StyledButton>
//   );
// };

//export default CustomButton;