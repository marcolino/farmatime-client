import { useState, useMemo } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { mockAnagrafica, mockPrincipiAttivi, mockATC } from '../data/AIFA';


export const MedicineInputAutocomplete = (props) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  
  // State for the three datasets
  const [anagrafica] = useState(mockAnagrafica);
  const [principiAttivi] = useState(mockPrincipiAttivi);
  const [atcCodes] = useState(mockATC);


  // Create unified options with precedence
  const unifiedOptions = useMemo(() => {
    if (!anagrafica.length || !principiAttivi.length || !atcCodes.length) return [];

    const options = [];

    // 1. Priority: Brand names from Anagrafica Farmaci
    anagrafica.forEach(medicine => {
      options.push({
        id: `med_${medicine.id}`,
        label: medicine.name,
        type: 'medicine',
        data: medicine,
        searchTerms: [medicine.name.toLowerCase()]
      });
    });

    // 2. Secondary: Active ingredients from Principi Attivi
    principiAttivi.forEach(ingredient => {
      options.push({
        id: `ing_${ingredient.id}`,
        label: ingredient.name,
        type: 'ingredient',
        data: ingredient,
        searchTerms: [ingredient.name.toLowerCase()]
      });
    });

    // 3. Tertiary: ATC codes
    atcCodes.forEach(atc => {
      options.push({
        id: `atc_${atc.code}`,
        label: `${atc.code} - ${atc.description}`,
        type: 'atc',
        data: atc,
        searchTerms: [atc.code.toLowerCase(), atc.description.toLowerCase()]
      });
    });

    return options;
  }, [anagrafica, principiAttivi, atcCodes]);

  const getFilteredOptions = (inputValue) => {
    if (!inputValue) return [];
    
    const query = inputValue.toLowerCase();
    const results = [];

    // Helper function to score matches (higher score = better match)
    const getMatchScore = (terms) => {
      let score = 0;
      for (const term of terms) {
        if (term.startsWith(query)) {
          score += 2; // Higher score for startsWith
        } else if (term.includes(query)) {
          score += 1; // Lower score for includes
        }
      }
      return score;
    };

    // Sort function that prioritizes startsWith matches
    const sortByMatchQuality = (a, b) => {
      const scoreA = getMatchScore(a.searchTerms);
      const scoreB = getMatchScore(b.searchTerms);
      return scoreB - scoreA; // Descending order
    };

    // First, add matching medicines (highest priority)
    const medicines = unifiedOptions
      .filter(option => option.type === 'medicine')
      .filter(option => option.searchTerms.some(term => term.includes(query)))
      .sort(sortByMatchQuality)
      .slice(0, 8);
    results.push(...medicines);

    // Then, add matching ingredients if we have space
    if (results.length < 15) {
      const ingredients = unifiedOptions
        .filter(option => option.type === 'ingredient')
        .filter(option => option.searchTerms.some(term => term.includes(query)))
        .sort(sortByMatchQuality)
        .slice(0, 15 - results.length);
      results.push(...ingredients);
    }

    // Finally, add matching ATC codes if we still have space
    if (results.length < 15) {
      const atcMatches = unifiedOptions
        .filter(option => option.type === 'atc')
        .filter(option => option.searchTerms.some(term => term.includes(query)))
        .sort(sortByMatchQuality)
        .slice(0, 15 - results.length);
      results.push(...atcMatches);
    }

    return results;
  };

  return (
    <>
      <Autocomplete
        {...props}
        options={getFilteredOptions(inputValue)}
        getOptionLabel={(option) => option.label ?? ""}
        //value={selectedValue}
        //onChange={(event, newValue) => setSelectedValue(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        ListboxProps={{
          sx: {
            '& .MuiAutocomplete-option': {
              minHeight: 'auto',
              py: 0.3,
              px: 1,
            }
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Nome farmaco (nome, principio attivo o codice ATC)"
            variant="outlined"
            fullWidth
            placeholder="Farmaco (es: Tachipirina, Paracetamolo, N02BE01...)"
          />
        )}
        renderOption={(props, option) => {
          const { key, ...props2 } = props;
          return (
            <Box
              key={key}
              component="li"
              {...props2}
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
                      {(option.type === 'medicine' && option.data.form && option.data.form !== " ") && (
                        <Typography variant="caption" color="text.secondary">
                          &nbsp; • &nbsp;{option.data.form}
                        </Typography>
                      )}
                      {(option.type === 'ingredient' && option.data.description && option.data.description !== " ") && (
                        <Typography variant="caption" color="text.secondary">
                          &nbsp; • &nbsp; {option.data.description}
                        </Typography>
                      )}
                      {/* {option.type === 'atc' && (
                        <Typography variant="caption" color="text.secondary">
                        </Typography>
                      )} */}
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

      {/* {selectedValue && (
        <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Selezione attuale:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {selectedValue.label}
            </Typography>
          </Box>
          {selectedValue.type === 'medicine' && (
            <Box>
              <Typography variant="body2">
                <strong>Titolare:</strong> {selectedValue.data.holder}
              </Typography>
              <Typography variant="body2">
                <strong>Forma farmaceutica:</strong> {selectedValue.data.form}
              </Typography>
              <Typography variant="body2">
                <strong>Codice ATC:</strong> {selectedValue.data.atcCode}
              </Typography>
            </Box>
          )}
        </Box>
      )} */}
    </>
  );
}
