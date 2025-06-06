import { forwardRef } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Grid,
  Typography,
} from '@mui/material';


export const MedicineInputAutocomplete = forwardRef(({
  value,
  onChange,
  inputValue,
  onInputChange,
  options,
  autoFocus = false,
  ...props
}, ref) => {
  return (
    <Autocomplete
      {...props}
      options={options}
      value={value}
      inputValue={inputValue}
      onChange={onChange}
      onInputChange={onInputChange}
      getOptionLabel={(option) => option.label ?? ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
          autoFocus={autoFocus}
          inputRef={ref}  // Forward the ref
          label="Nome farmaco (nome, principio attivo o codice ATC)"
          variant="outlined"
          fullWidth
          placeholder="Farmaco (es: Tachipirina, Paracetamolo, N02BE01...)"
        />
      )}
      renderOption={(props, option) => {
        const { key, ...propsWithoutKey } = props;
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
                    {(option.type === 'medicine' && option.data.form/* && option.data.form !== " "*/) && (
                      <Typography variant="caption" color="text.secondary">
                        &nbsp; • &nbsp;{option.data.form}
                      </Typography>
                    )}
                    {(option.type === 'ingredient' && option.data.description/* && option.data.description !== " "*/) && (
                      <Typography variant="caption" color="text.secondary">
                        &nbsp; • &nbsp; {option.data.description}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        );
      }}
      noOptionsText={
        inputValue ? "Nessun farmaco trovato" : "Inizia a digitare il nome del farmaco per cercare"
      }
    />
  );
});

MedicineInputAutocomplete.displayName = "MedicineInputAutocomplete"; // Set displayName explicitly
