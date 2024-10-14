import React from "react";
import PropTypes from "prop-types";
import {
  TextField, Button, Select, MenuItem, InputAdornment, OutlinedInput,
  FormControlLabel, Checkbox, Link, Typography, Box,
} from "@mui/material";
import { styled } from "@mui/system";
import InputMask from "react-input-mask";
import { shadeColor } from "../libs/Styling";
import { capitalize, isEmptyObject } from "../libs/Misc";


const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    "& .MuiInputAdornment-root": {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: -15,
      marginRight: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderRight: "1px solid #c5c5c5",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const FormInput = React.memo((props) => {
  const props2 = props;
  delete props2.startAdornmentIcon;
  delete props2.endAdornmentIcon;
  delete props2.startAdornmentClass;
  delete props2.endAdornmentClass;
  return (
    <StyledTextField
      id={props.id}
      type={props.type}
      value={props.value}
      required={props.required}
      autoFocus={props.autoFocus}
      //autoComplete={props.autoComplete.toString()}
      autoComplete={props.autoComplete}
      variant={props.variant}
      fullWidth={props.fullWidth}
      label={props.label}
      size={props.size}
      margin={props.margin}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      disabled={props.disabled}
      error={Boolean(props.error)}
      InputProps={{
        startAdornment: props.startAdornmentIcon && (
          <InputAdornment position="start">
            {props.startAdornmentIcon}
          </InputAdornment>
        ),
        endAdornment: props.endAdornmentIcon && (
          <InputAdornment position="end">
            {props.endAdornmentIcon}
          </InputAdornment>
        ),
      }}
      {...props2}
    />
  )
});

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  startAdornmentClass: PropTypes.string,
  startAdornmentIcon: PropTypes.object,
  endAdornmentClass: PropTypes.string,
  endAdornmentIcon: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  //autoComplete: PropTypes.string,
};

FormInput.defaultProps = {
  id: null,
  type: "text",
  required: false,
  autoFocus: false,
  //autoComplete: false,
  variant: "outlined",
  fullWidth: true,
  label: "",
  size: "small",
  margin: "dense",
  className: null,
  placeholder: "",
  startAdornmentClass: null,
  endAdornmentClass: null,
  disabled: false,
  error: false,
};


const StyledStartAdornment = styled(InputAdornment)(({ theme }) => ({
  backgroundColor: "#eaedf0",
  height: "2.5rem",
  maxHeight: "3rem",
  marginLeft: -15,
  marginRight: 5,
  paddingLeft: 10,
  paddingRight: 10,
  borderRight: "1px solid #c5c5c5",
}));

const StyledEndAdornment = styled(InputAdornment)(({ theme }) => ({
  backgroundColor: "#eaedf0",
  height: "2.5rem",
  maxHeight: "3rem",
  marginLeft: 5,
  marginRight: -15,
  paddingLeft: 10,
  paddingRight: 10,
  borderLeft: "1px solid #c5c5c5",
}));

const FormPhoneInput = React.memo((props) => {
  const handleKeyDown = (event) => {
    const allowedKeys = ["Backspace", "Delete", "Escape", "Enter", "Tab", "ArrowLeft", "ArrowRight"];
    if (!allowedKeys.includes(event.key) && !/[0-9+ ]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <TextField
      onKeyDown={handleKeyDown}
      id={props.id}
      type={props.type}
      value={props.value}
      required={props.required}
      autoFocus={props.autoFocus}
      //autoComplete={props.autoComplete.toString()}
      autoComplete={props.autoComplete}
      variant={props.variant}
      fullWidth={props.fullWidth}
      label={props.label}
      size={props.size}
      margin={props.margin}
      placeholder={props.placeholder}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.disabled}
      error={!isEmptyObject(props.error)}
      InputProps={{
        startAdornment: props.startAdornmentIcon && (
          <StyledStartAdornment position="start">
            {props.startAdornmentIcon}
          </StyledStartAdornment>
        ),
        endAdornment: props.endAdornmentIcon && (
          <StyledEndAdornment position="end">
            {props.endAdornmentIcon}
          </StyledEndAdornment>
        ),
        inputComponent: InputMask,
        inputProps: {
          maskChar: null,
        },
      }}
      {...props}
    />
  );
});

FormPhoneInput.propTypes = {
  value: PropTypes.string.isRequired,
  startAdornmentClass: PropTypes.string,
  startAdornmentIcon: PropTypes.object,
  endAdornmentClass: PropTypes.string,
  endAdornmentIcon: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

FormPhoneInput.defaultProps = {
  type: "text",
  required: false,
  autoFocus: false,
  //autoComplete: false,
  variant: "outlined",
  fullWidth: true,
  label: "",
  size: "small",
  margin: "dense",
  className: null,
  placeholder: "",
  startAdornmentClass: null,
  endAdornmentClass: null,
  disabled: false,
  error: false,
};


// const StyledStartAdornment = styled(InputAdornment)(({ theme }) => ({
//   backgroundColor: "#eaedf0",
//   height: "2.5rem",
//   maxHeight: "3rem",
//   marginLeft: -15,
//   marginRight: 5,
//   paddingLeft: 10,
//   paddingRight: 10,
//   borderRight: "1px solid #c5c5c5",
// }));

// const StyledEndAdornment = styled(InputAdornment)(({ theme }) => ({
//   backgroundColor: "#eaedf0",
//   height: "2.5rem",
//   maxHeight: "3rem",
//   marginLeft: 5,
//   marginRight: -15,
//   paddingLeft: 10,
//   paddingRight: 10,
//   borderLeft: "1px solid #c5c5c5",
// }));

const FormSelect = React.memo((props) => {
  return (
    <Select
      id={props.id}
      value={props.value}
      fullWidth={props.fullWidth}
      size={props.size}
      onChange={e => props.onChange(e.target.value)}
      input={
        <OutlinedInput
          startAdornment={props.startAdornmentIcon && (
            <StyledStartAdornment position="start">
              {props.startAdornmentIcon}
            </StyledStartAdornment>
          )}
          endAdornment={props.endAdornmentIcon && (
            <StyledEndAdornment position="end">
              {props.endAdornmentIcon}
            </StyledEndAdornment>
          )}
        />
      }
      {...props}
    >
      {props.options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
});

FormSelect.propTypes = {
  value: PropTypes.string.isRequired,
  startAdornmentClass: PropTypes.string,
  startAdornmentIcon: PropTypes.object,
  endAdornmentClass: PropTypes.string,
  endAdornmentIcon: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

FormSelect.defaultProps = {
  type: "text",
  required: false,
  autoFocus: false,
  //autoComplete: false,
  variant: "outlined",
  fullWidth: true,
  label: "",
  size: "small",
  margin: "dense",
  className: null,
  placeholder: "",
  startAdornmentClass: null,
  endAdornmentClass: null,
  disabled: false,
  error: false,
};


const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  textTransform: "none",
  fontSize: "1.1em",
  color: "#fff",
  backgroundColor: theme.palette.success.main,
  "&:hover": {
    backgroundColor: shadeColor(theme.palette.success.main, -25),
  },
  noWrap: true,
  "&.MuiButton-secondary": {
    color: "#ccc",
    backgroundColor: theme.palette.secondary.dark,
    "&:hover": {
      backgroundColor: shadeColor(theme.palette.secondary.dark, -25),
    },
  },
}));

const FormButton = React.memo((props) => (
  <StyledButton
    fullWidth={props.fullWidth}
    variant={props.variant}
    color={props.color}
    size={props.size}
    startIcon={props.startIcon}
    onClick={props.onClick}
    disabled={props.disabled}
    {...props}
  >
    {props.children}
  </StyledButton>
));

FormButton.propTypes = {
  social: PropTypes.oneOf([
    "Facebook",
    "Google",
  ]),
}

FormButton.defaultProps = {
  fullWidth: true,
  variant: "contained",
  color: "primary",
  social: null,
};


const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  "&.Mui-disabled": {
    color: theme.palette.action.disabled,
  },
}));

const FormCheckbox = React.memo((props) => (
  <FormControlLabel
    control={
      <StyledCheckbox
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        color={props.color}
        size={props.size}
        disabled={props.disabled}
      />
    }
    label={props.children}
  />
));

FormCheckbox.propTypes = {
};

FormCheckbox.defaultProps = {
  checked: false,
  color: "primary",
  size: "small",
};

const FormText = React.memo((props) => {
  return (
    <Typography
      component={props.component}
      variant={props.variant}
      color={props.color}
      align={props.align}
      {...props}
    >
      {props.children}
    </Typography>
  );
});

FormText.propTypes = {
};

FormText.defaultProps = {
  component: "h1",
  variant: "body2",
  color: "textPrimary",
};


const DisabledLink = styled(Link)(({ theme }) => ({
  color: "grey",
  cursor: "default",
  "&:hover": {
    textDecoration: "none",
    color: "grey",
  },
}));

const NormalLink = styled(Link)(({ theme }) => ({
  cursor: "pointer",
}));

const FormLink = React.memo((props) => {
  return props.disabled ? (
    <DisabledLink {...props}>
      {props.children}
    </DisabledLink>
  ) : (
    <NormalLink {...props}>
      {props.children}
    </NormalLink>
  );
});

FormLink.propTypes = {
};

FormLink.defaultProps = {
  color: "textPrimary",
};


const DividerContainer = styled(Box)(({ theme, marginVertical }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(marginVertical),
  marginBottom: theme.spacing(marginVertical),
}));

const DividerLine = styled(Box)(({ theme, color }) => ({
  width: "100%",
  borderBottom: `1px solid ${color || theme.palette.primary.dark}`,
}));

const DividerText = styled(Box)(({ theme, paddingHorizontal }) => ({
  paddingLeft: theme.spacing(paddingHorizontal),
  paddingRight: theme.spacing(paddingHorizontal),
}));

const FormDividerWithText = React.memo((props) => {
  return (
    <DividerContainer marginVertical={props.marginVertical}>
      <DividerLine color={props.color} />
      {props.children && (
        <DividerText paddingHorizontal={props.paddingHorizontal}>
          {props.children}
        </DividerText>
      )}
      <DividerLine color={props.color} />
    </DividerContainer>
  );
});

FormDividerWithText.propTypes = {
  color: PropTypes.string,
  marginVertical: PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]),
  paddingHorizontal: PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]),
};

FormDividerWithText.defaultProps = {
  marginVertical: 1,
  paddingHorizontal: 1,
};


const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  textAlign: "right",
}));

const FormTitle = React.memo((props) => {
  return (
    <StyledBox>
      <Typography variant="h6">
        {props.children}
      </Typography>
    </StyledBox>
  );
});

FormTitle.propTypes = {
  contents: PropTypes.string,
  color: PropTypes.string,
  marginVertical: PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]),
  paddingHorizontal: PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]),
};

FormTitle.defaultProps = {
  contents: "No title",
  marginVertical: 1,
  paddingHorizontal: 1,
};


export {
  FormInput, FormPhoneInput, FormSelect, FormButton, FormCheckbox,
  FormText, FormLink, FormDividerWithText, FormTitle,
};
