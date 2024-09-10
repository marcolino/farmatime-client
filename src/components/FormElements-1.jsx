import React from "react";
import PropTypes from "prop-types";
import {
  TextField, Button, Select, MenuItem, InputAdornment, OutlinedInput,
  FormControlLabel, Checkbox, Link, Typography, Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import InputMask from "react-input-mask";
import { shadeColor } from "../libs/Styling";
import { capitalize, isEmptyObject } from "../libs/Misc";


const FormInput = React.memo((props) => {
  const styles = theme => ({
    startAdornment: {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: -15,
      marginRight: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderRight: "1px solid #c5c5c5",
    },
    endAdornment: {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: 5,
      marginRight: -15,
      paddingLeft: 10,
      paddingRight: 10,
      borderLeft: "1px solid #c5c5c5",
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  return (
    <TextField
      id={props.id}
      type={props.type}
      value={props.value}
      required={props.required}
      autoFocus={props.autoFocus}
      autoComplete={props.autoComplete.toString()}
      variant={props.variant}
      fullWidth={props.fullWidth}
      label={props.label}
      size={props.size}
      margin={props.margin}
      className={props.className ? props.className : classes.textField}
      placeholder={props.placeholder}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.disabled}
      error={!isEmptyObject(props.error)}
      InputProps={{
        startAdornment: props.startAdornmentIcon ? (
          <InputAdornment
            className={props.startAdornmentClass ? props.startAdornmentClass : classes.startAdornment}
            position="start"
          >
            {props.startAdornmentIcon}
          </InputAdornment>
        ) : (<></>),
        endAdornment: props.endAdornmentIcon ? (
          <InputAdornment
            className={props.endAdornmentClass ? props.endAdornmentClass : classes.endAdornment}
            position="end"
          >
            {props.endAdornmentIcon}
          </InputAdornment>
        ) : (<></>),
        className: classes.input,
      }}
      {...props}
    />
  );
});

FormInput.propTypes = {
  value: PropTypes.string.isRequired,
  startAdornmentClass: PropTypes.string,
  startAdornmentIcon: PropTypes.object,
  endAdornmentClass: PropTypes.string,
  endAdornmentIcon: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

FormInput.defaultProps = {
  type: "text",
  required: false,
  autoFocus: false,
  autoComplete: false,
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
  error: "",
};


const FormPhoneInput = React.memo((props) => {
  const styles = theme => ({
    startAdornment: {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: -15,
      marginRight: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderRight: "1px solid #c5c5c5",
    },
    endAdornment: {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: 5,
      marginRight: -15,
      paddingLeft: 10,
      paddingRight: 10,
      borderLeft: "1px solid #c5c5c5",
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  const handleKeyDown = (event) => { // allow only +, digits and spaces
    const allowedKeys = ["Backspace", "Delete", "Escape", "Enter", "Tab", "ArrowLeft", "ArrowRight"];

    // check if the key pressed is one of the allowed control keys or a digit, plus (+), or space
    if (allowedKeys.includes(event.key) || /[0-9+ ]/.test(event.key)) {
        // allow the input
        return true;
    } else {
        // prevent the input
        event.preventDefault();
        return false;
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
      autoComplete={props.autoComplete.toString()}
      variant={props.variant}
      fullWidth={props.fullWidth}
      label={props.label}
      size={props.size}
      margin={props.margin}
      className={props.className ? props.className : classes.textField}
      placeholder={props.placeholder}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.disabled}
      error={!isEmptyObject(props.error)}
      InputProps={{
        startAdornment: props.startAdornmentIcon ? (
          <InputAdornment
            className={props.startAdornmentClass ? props.startAdornmentClass : classes.startAdornment}
            position="start"
          >
            {props.startAdornmentIcon}
          </InputAdornment>
        ) : (<></>),
        endAdornment: props.endAdornmentIcon ? (
          <InputAdornment
            className={props.endAdornmentClass ? props.endAdornmentClass : classes.endAdornment}
            position="end"
          >
            {props.endAdornmentIcon}
          </InputAdornment>
        ) : (<></>),
        className: classes.input,
        inputComponent: InputMask,
        inputProps: {
          maskChar: null,
          formatChars: {
            "9": "[0-9]",
            "+": "\\+",
            " ": " ",
          },
          //placeholder: "+xx xxx xxx xxxx",
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
  error: PropTypes.string,
};

FormPhoneInput.defaultProps = {
  type: "text",
  required: false,
  autoFocus: false,
  autoComplete: false,
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
  error: "",
};


const FormSelect = React.memo((props) => {
  const styles = theme => ({
    selectRoot: {
      "&.MuiSelect-select": {
        backgroundColor: theme.palette.base.backgroundColor, // the background when menu is closed
      },
    },
    startAdornment: {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: -15,
      marginRight: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderRight: "1px solid #c5c5c5",
    },
    endAdornment: {
      backgroundColor: "#eaedf0",
      height: "2.5rem",
      maxHeight: "3rem",
      marginLeft: 5,
      marginRight: -15,
      paddingLeft: 10,
      paddingRight: 10,
      borderLeft: "1px solid #c5c5c5",
    },
    marginVertical: {
      marginTop: 7,
      marginBottom: 5,
    }
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  return (
    <Select
      id={props.id}
      type={props.type}
      value={props.value}
      required={props.required}
      autoFocus={props.autoFocus}
      autoComplete={props.autoComplete.toString()}
      variant={props.variant}
      fullWidth={props.fullWidth}
      label={props.label}
      size={props.size}
      margin={props.margin}
      className={props.className ? props.className : [ classes.marginVertical, classes.selectField ]}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.disabled}
      error={!isEmptyObject(props.error)}
      input={
        <OutlinedInput
          startAdornment={props.startAdornmentIcon ? (
            <InputAdornment
              className={props.startAdornmentClass ? props.startAdornmentClass : classes.startAdornment}
              position="start"
            >
              {props.startAdornmentIcon}
            </InputAdornment>
          ) : (<></>)}
          endAdornment={props.endAdornmentIcon ? (
            <InputAdornment
              className={props.endAdornmentClass ? props.endAdornmentClass : classes.endAdornment}
              position="end"
            >
              {props.endAdornmentIcon}
            </InputAdornment>
          ) : (<></>)}
        />
      }
      // InputProps={{
      //   className: classes.selectInput,
      // }}
      inputProps={{
        className: classes.selectRoot,
      }}
      multiple={props.multiple}
      renderValue={(selected) => (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {props.multiple ? selected.map((value, index) => (
            <div style={{ margin: 2 }} key={index}>{value}{(index < selected.length - 1) ? ", " : ""}</div>
          )) : (
            <div style={{ margin: 2 }}>{selected}</div>
          )}
        </div>
      )}
      {...props}
    >
      {props.options.map((option) => (
        <MenuItem key={option} value={option} style={{ marginTop: 2, marginBottom: 2 }}
          classes={{ selected: classes.selected }}
        >
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
  error: PropTypes.string,
};

FormSelect.defaultProps = {
  type: "text",
  required: false,
  autoFocus: false,
  autoComplete: false,
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
  error: "",
};


const FormButton = React.memo((props) => {
  const styles = theme => ({
    button: {
      margin: theme.spacing(1, 0, 0, 0),
      textTransform: "none",
      fontSize: "1.1em",
      color: "#fff", // TODO
      backgroundColor: theme.palette.success.main,
      "&:hover": {
        backgroundColor: shadeColor(theme.palette.success.main, -25),
      },
      noWrap: true,
    },
    buttonSecondary: {
      margin: theme.spacing(1, 0, 0, 0),
      textTransform: "none",
      fontSize: "1em !important",
      color: "#ccc", // TODO
      backgroundColor: theme.palette.secondary.dark + " !important",
      "&:hover": {
        backgroundColor: shadeColor(theme.palette.secondary.dark, -25)  + " !important",
      },
      noWrap: true,
    },
    buttonFederated: {
      margin: theme.spacing(1, 0, 0, 0),
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(5),
      fontSize: "1.3em",
    },  
    buttonFederatedFacebook: {
      backgroundColor: theme.palette.socialButtons.facebook.backgroundColor,
      "&:hover": {
        backgroundColor: shadeColor(theme.palette.socialButtons.facebook.backgroundColor, -25),
      },
    },
    buttonFederatedGoogle: {
      backgroundColor: theme.palette.socialButtons.google.backgroundColor,
      "&:hover": {
        backgroundColor: shadeColor(theme.palette.socialButtons.google.backgroundColor, -25),
      },
    },
  
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  return (
    <Button
      fullWidth={props.fullWidth}
      variant={props.variant}
      color={props.color}
      size={props.size}
      className={`${classes.button} ${props.social ? classes.buttonFederated : ""} ${props.social ? classes["buttonFederated" + capitalize(props.social)] : ""} ${classes[props.className]}`}
      startIcon={props.startIcon}
      onClick={props.onClick}
      disabled={props.disabled}
      {...props}
    >
      {props.children}
    </Button>
  );
});

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


const FormCheckbox = React.memo((props) => {
  const styles = theme => ({
    disabled: {
      color: "grey",
      cursor: "default",
      "&:hover": {
        textDecoration: "none",
      },
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  const classNameDisabled = props.disabled ? classes.disabled : "";

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
          className={`${props.className} ${classNameDisabled}`}
          color={props.color}
          size={props.size}
          disabled={props.disabled}
          {...props}
        />
      }
      label={
        <FormText
          className={`${props.className} ${classNameDisabled}`}
        >
          {props.children}
        </FormText>
      }
    />
  );
});

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


const FormLink = React.memo((props) => {
  const styles = theme => ({
    normal: {
      cursor: "pointer",
    },
    disabled: {
      color: "grey",
      cursor: "default",
      "&:hover": {
        textDecoration: "none",
        color: "grey",
      },
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  const className = props.disabled ? classes.disabled : classes.normal;

  return (
    <Link
      href={props.href}
      //onClick={() => navigate("/xxx")}  //props.href)} //"/signUp")}
      className={`${props.className} ${className}`}
      color={props.color}
      {...props}
    >
      {props.children}
    </Link>
  );
});

FormLink.propTypes = {
};

FormLink.defaultProps = {
  color: "textPrimary",
};


const FormDividerWithText = React.memo((props) => {
  const styles = theme => ({
    container: {
      display: "flex",
      alignItems: "center",
      marginTop: theme.spacing(props.marginVertical),
      marginBottom: theme.spacing(props.marginVertical),
    },
    divider: {
      width: "100%",
      borderBottom: "1px solid " + (props.color ? props.color : theme.palette.primary.dark),
      paddingLeft: theme.spacing(1),
    },
    text: {
      paddingLeft: theme.spacing(props.paddingHorizontal),
      paddingRight: theme.spacing(props.paddingHorizontal),
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.divider} />
      {props.children && <span className={classes.text}>
        {props.children}
      </span>}
      <div className={classes.divider} />
    </div>
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


const FormTitle = React.memo((props) => {
  const styles = theme => ({
    title: {
      padding: 8,
      paddingRight: 24,
      borderRadius: 4,
      textAlign: "right",
      color: theme.palette.title.color,
      backgroundColor: theme.palette.title.backgroundColor,
    },
  });
  const useStyles = makeStyles((theme) => (styles(theme)));
  const classes = useStyles();

  return (
    <Box sx={{ marginBottom: 24 }} className={props.classes ?? classes.title}>
      <Typography variant="h6">
        {props.children || props.contents}
      </Typography>
    </Box>
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
