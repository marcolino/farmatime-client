import React, { useState } from "react";
import StyledTextField from "../custom/TextField"; // Assuming this is the file where your StyledTextField is defined
//import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const TextFieldPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledTextField
      {...props}
      type={showPassword ? "text" : "password"}
      endIcon={
        <IconButton
          onClick={handleClickShowPassword}
          edge="end"
          tabIndex={-1}
          aria-label="toggle password visibility"
        >
          {showPassword ? <Visibility sx={{ fontSize: "1.4rem" }} /> : <VisibilityOff sx={{ fontSize: "1.4rem" }} />}
        </IconButton>
      }
    />
  );
};

export default TextFieldPassword;

// import React, { useState } from "react";
// import TextField from "./TextField";
// import InputAdornment from "@mui/material/InputAdornment";
// import { Visibility, VisibilityOff }  from "@mui/icons-material";


// // TODO .................................................................

// const CustomTextFieldPassword = ({
//   startIcon = null,
//   ...props
// }) => {
//   props.onChange = props.onChange ?? (() => { }); // without an onChange prop this component is unuseful
//   props.fullWidth = props.fullWidth ?? true;

//   const toggleVisibility = () => {

//   }

//   return (
//     <TextField
//       onChange={onChange}
//       fullWidth={props.fullWidth} // TODO: from props
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             {startIcon}
//           </InputAdornment>
//         ),
//         endAdornment: (
//           <IconButton onClick={toggleVisibility} size="small" >
//             <Visibility _sx={{fontSize: "1.2rem"}} />
//           </IconButton>
//         )
//       }}
//       {...props}
//     />
//   );
// };

// export default CustomTextFieldPassword;
