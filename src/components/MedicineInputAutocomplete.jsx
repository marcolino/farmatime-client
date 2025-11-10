import { forwardRef } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';


export const MedicineInputAutocomplete = forwardRef(({
  value,
  onChange,
  inputValue,
  onInputChange,
  getFilteredOptions,
  autoFocus = false,
  ...props
}, ref) => {
  const { t } = useTranslation();

  const options = inputValue ? getFilteredOptions(inputValue) : [];

  return (
    <Autocomplete
      {...props}
      freeSolo
      options={options ?? []}
      
      value={value}
      inputValue={inputValue}
      onChange={onChange}
      onInputChange={onInputChange}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option?.label ?? ''
      }
      isOptionEqualToValue={(option, value) => option === value}
      slotProps={{
        listbox: {
          sx: {
            '& .MuiAutocomplete-option': {
              minHeight: 'auto',
              py: 0.3,
              px: 1,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.stopPropagation();
          }}
          autoFocus={autoFocus}
          inputRef={ref}
          label={t('Medicine name (name, active ingredient or ATC code)')}
          variant="outlined"
          fullWidth
          placeholder={t('Medicine (e.g.: Tachipirina, Paracetamolo, N02BE01...)')}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...rest } = props;
        return (
          <Box key={key} component="li" {...rest}>
            {typeof option === 'string' ? option : option?.label ?? ''}
          </Box>
        );
      }}
      noOptionsText={
        inputValue ? t('No medicine found') : t('Start typing the medicine name')
      }
    />
  );
});

MedicineInputAutocomplete.displayName = 'MedicineInputAutocomplete';
