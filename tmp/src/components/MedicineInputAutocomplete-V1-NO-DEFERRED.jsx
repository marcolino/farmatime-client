import { forwardRef } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';


export const MedicineInputAutocomplete = forwardRef(({
  value,
  onChange,
  inputValue,
  onInputChange,
  options,
  autoFocus = false,
  ...props
}, ref) => {
  const { t } = useTranslation();
  
  return (
    <Autocomplete
      {...props}
      options={options}
      value={value}
      inputValue={inputValue}
      onChange={onChange}
      onInputChange={onInputChange}
      //getOptionLabel={(option) => option.label ?? ""}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.label ?? ""
      }
      //isOptionEqualToValue={(option, value) => option.id === value.id}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        if (typeof value === "string") return option.label === value;
        if (typeof option === "string") return option === value.label;
        return option.id === value.id;
      }}
      freeSolo // Allows input values outside the options list
      slotProps={{
        listbox: {
          sx: {
            '& .MuiAutocomplete-option': {
              minHeight: 'auto',
              py: 0.3,
              px: 1,
            }
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyDown={(e) => { if (e.key === 'Enter') e.stopPropagation(); }} // Force consistent Enter behavior
          autoFocus={autoFocus}
          inputRef={ref}  // Forward the ref
          label={t("Medicine name (name, active ingredient or ATC code)")}
          variant="outlined"
          fullWidth
          placeholder={t("Medicine (e.g.: Tachipirina, Paracetamolo, N02BE01...)")}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...propsWithoutKey } = props;
        const label = typeof option === "string" ? option : option?.label ?? "";

        return (
          <Box
            key={key}
            component="li"
            {...propsWithoutKey}
            sx={{
              '&:hover': {
                filter: 'brightness(0.95)'
              },
            }}
          >
            <Box>
              {label}
            </Box>
            {/*
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container direction="row">
                  <Grid>
                    <Typography variant="body1" sx={{ fontWeight: option.type === 'medicine' ? 600 : 400 }}>
                      {option.type === 'medicine' ? option.data.name :
                        option.type === 'ingredient' ? option.data.name :
                          `${option.data.code} - ${option.data.description}`}
                    </Typography>
                  </Grid>
                  <Grid>
                    {(option.type === 'medicine' && option.data.form) && (
                      <Typography variant="caption" color="text.secondary">
                        &nbsp; • &nbsp;{option.data.form}
                      </Typography>
                    )}
                    {(option.type === 'ingredient' && option.data.description) && (
                      <Typography variant="caption" color="text.secondary">
                        &nbsp; • &nbsp; {option.data.description}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
            */}
          </Box>
        );
      }}
      noOptionsText={
        inputValue ? t("No medicine found") : t("Start typing the medicine name")
      }
    />
  );
});

MedicineInputAutocomplete.displayName = "MedicineInputAutocomplete"; // Set displayName explicitly
