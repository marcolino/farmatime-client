import {
  Select,
  MenuItem,
  OutlinedInput,
  FilledInput,
  Input,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { alpha } from "@mui/system";
import { useTheme } from "@mui/material/styles";

const StyledSelect = ({
  startIcon = null,
  endIcon = null,
  variant = "outlined",
  fullWidth = true,
  size = "small",
  margin = "dense",
  placeholder = "",
  ...props
}) => {
  props.variant = props.variant ?? variant;
  props.fullWidth = props.fullWidth ?? fullWidth;
  props.size = props.size ?? size;
  props.margin = props.margin ?? margin;
  props.placeholder = props.placeholder ?? placeholder;

  let optionsDisabled = [];
  if (props.optionsDisabled) {
    optionsDisabled = props.optionsDisabled;
    delete props.optionsDisabled;
  }

  const theme = useTheme();

  const InputComponent =
    variant === "outlined"
      ? OutlinedInput
      : variant === "filled"
      ? FilledInput
      : Input;

  const labelId = `${props.id || props.label}-label`;

  return (
    <FormControl
      fullWidth={props.fullWidth}
      sx={{ mt: 1, mb: 0.7 }}
      variant={variant}
      size={size}
    >
      <InputLabel
        id={labelId}
        sx={{
          px: 0,
          color:
            props.id === document.activeElement.id
              ? "primary.main"
              : "text.primary",
        }}
      >
        {props.label}
      </InputLabel>

      <Select
        labelId={labelId}
        id={props.id}
        multiple={props.multiple}
        sx={{
          ...props.sx,
          my:
            props.margin === "normal"
              ? "8px"
              : props.margin === "dense"
              ? "5px"
              : 0,
        }}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {props.multiple ? (
              selected.map((value, index) => (
                <div style={{ margin: 2 }} key={index}>
                  {value}
                  {index < selected.length - 1 ? ", " : ""}
                </div>
              ))
            ) : (
              <div style={{ margin: 2 }}>{selected}</div>
            )}
          </div>
        )}
        input={
          <InputComponent
            label={props.label} // Necessary for notched outline
            startAdornment={
              startIcon && (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              )
            }
            endAdornment={
              endIcon && (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              )
            }
          />
        }
        {...props}
      >
        {props.options
          .sort((a, b) => a.priority - b.priority)
          .map((option, index) => {
            const isSelected = props.multiple
              ? props.value.includes(option)
              : props.value === option;

            return (
              <MenuItem
                key={option}
                value={option}
                disabled={optionsDisabled[index]}
                sx={{
                  my: 0.5,
                  backgroundColor: isSelected
                    ? alpha(theme.palette.violet.main, 0.4)
                    : "inherit",
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.violet.main, 0.6),
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: alpha(theme.palette.violet.main, 0.8),
                  },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.violet.main, 0.2),
                  },
                }}
              >
                {option}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};

export default StyledSelect;
