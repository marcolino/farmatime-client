import { useState, useMemo } from 'react';
import {
  TextField,
  Autocomplete,
  //CircularProgress,
  Box,
  Typography,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { 
  LocalPharmacy,
  Science,
  Label
} from '@mui/icons-material';

// Mock data representing the three AIFA datasets
const mockAnagrafica = [
  { id: '001', name: 'TACHIPIRINA 500MG', holder: 'Angelini S.p.A.', form: 'Compresse', atcCode: 'N02BE01' },
  { id: '002', name: 'ASPIRINA 100MG', holder: 'Bayer S.p.A.', form: 'Compresse', atcCode: 'N02BA01' },
  { id: '003', name: 'BRUFEN 600MG', holder: 'Mylan Italia S.r.l.', form: 'Compresse', atcCode: 'M01AE01' },
  { id: '004', name: 'VOLTAREN EMULGEL', holder: 'GSK Consumer Healthcare', form: 'Gel', atcCode: 'M01AB05' },
  { id: '005', name: 'OKI 80MG', holder: 'Dompé farmaceutici S.p.A.', form: 'Bustine', atcCode: 'M01AE03' },
  { id: '006', name: 'MOMENT 200MG', holder: 'Angelini S.p.A.', form: 'Compresse', atcCode: 'M01AE01' },
  { id: '007', name: 'CARDIOASPIRIN 100MG', holder: 'Bayer S.p.A.', form: 'Compresse', atcCode: 'B01AC06' },
  { id: '008', name: 'PLASIL 10MG', holder: 'Sanofi S.p.A.', form: 'Compresse', atcCode: 'A03FA01' }
];

const mockPrincipiAttivi = [
  { id: 'PA001', name: 'Paracetamolo', description: 'Analgesico e antipiretico' },
  { id: 'PA002', name: 'Acido acetilsalicilico', description: 'Antinfiammatorio non steroideo' },
  { id: 'PA003', name: 'Ibuprofene', description: 'Antinfiammatorio non steroideo' },
  { id: 'PA004', name: 'Diclofenac', description: 'Antinfiammatorio non steroideo' },
  { id: 'PA005', name: 'Ketoprofene', description: 'Antinfiammatorio non steroideo' },
  { id: 'PA006', name: 'Metoclopramide', description: 'Antiemetico e procinetico' }
];

const mockATC = [
  { code: 'N02BE01', description: 'Paracetamolo', level: 'Principio attivo' },
  { code: 'N02BA01', description: 'Acido acetilsalicilico', level: 'Principio attivo' },
  { code: 'M01AE01', description: 'Ibuprofene', level: 'Principio attivo' },
  { code: 'M01AB05', description: 'Diclofenac', level: 'Principio attivo' },
  { code: 'M01AE03', description: 'Ketoprofene', level: 'Principio attivo' },
  { code: 'A03FA01', description: 'Metoclopramide', level: 'Principio attivo' },
  { code: 'N02', description: 'Analgesici', level: 'Gruppo terapeutico' },
  { code: 'M01', description: 'Antinfiammatori e antireumatici', level: 'Gruppo terapeutico' }
];

export const MedicineInputAutocomplete = () => {
  //const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  
  // State for the three datasets
  // const [anagrafica, setAnagrafica] = useState([]);
  // const [principiAttivi, setPrincipiAttivi] = useState([]);
  // const [atcCodes, setAtcCodes] = useState([]);
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

  // Custom filtering with precedence
  const getFilteredOptions = (inputValue) => {
    if (!inputValue) return unifiedOptions.slice(0, 10);
    
    const query = inputValue.toLowerCase();
    const results = [];

    // First, add matching medicines (highest priority)
    const medicines = unifiedOptions
      .filter(option => option.type === 'medicine')
      .filter(option => option.searchTerms.some(term => term.includes(query)))
      .slice(0, 8);
    results.push(...medicines);

    // Then, add matching ingredients if we have space
    if (results.length < 15) {
      const ingredients = unifiedOptions
        .filter(option => option.type === 'ingredient')
        .filter(option => option.searchTerms.some(term => term.includes(query)))
        .slice(0, 15 - results.length);
      results.push(...ingredients);
    }

    // Finally, add matching ATC codes if we still have space
    if (results.length < 15) {
      const atcMatches = unifiedOptions
        .filter(option => option.type === 'atc')
        .filter(option => option.searchTerms.some(term => term.includes(query)))
        .slice(0, 15 - results.length);
      results.push(...atcMatches);
    }

    return results;
  };

  const getOptionIcon = (type) => {
    switch (type) {
      case 'medicine':
        return <LocalPharmacy size={16} color="#1976d2" />;
      case 'ingredient':
        return <Science size={16} color="#388e3c" />;
      case 'atc':
        return <Label size={16} color="#f57c00" />;
      default:
        return null;
    }
  };

  const getOptionColor = (type) => {
    switch (type) {
      case 'medicine':
        return '#e3f2fd';
      case 'ingredient':
        return '#e8f5e8';
      case 'atc':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Ricerca Farmaci AIFA
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Cerca per nome commerciale, principio attivo o codice ATC
      </Typography>

      <Autocomplete
        options={getFilteredOptions(inputValue)}
        getOptionLabel={(option) => option.label}
        //loading={loading}
        value={selectedValue}
        onChange={(event, newValue) => setSelectedValue(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        filterOptions={(options) => options} // We handle filtering manually
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cerca farmaco, principio attivo o codice ATC"
            variant="outlined"
            fullWidth
            placeholder="Es: Tachipirina, Paracetamolo, N02BE01..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {/* {loading ? <CircularProgress color="inherit" size={20} /> : null} */}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
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
                backgroundColor: getOptionColor(option.type),
                '&:hover': {
                  backgroundColor: `${getOptionColor(option.type)} !important`,
                  filter: 'brightness(0.95)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                {getOptionIcon(option.type)}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: option.type === 'medicine' ? 600 : 400 }}>
                    {option.type === 'medicine' ? option.data.name :
                      option.type === 'ingredient' ? option.data.name :
                        `${option.data.code} - ${option.data.description}`}
                  </Typography>
                  {option.type === 'medicine' && (
                    <Typography variant="caption" color="text.secondary">
                      {option.data.holder} • {option.data.form}
                    </Typography>
                  )}
                  {option.type === 'ingredient' && (
                    <Typography variant="caption" color="text.secondary">
                      {option.data.description}
                    </Typography>
                  )}
                  {option.type === 'atc' && (
                    <Typography variant="caption" color="text.secondary">
                      {option.data.level}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={option.type === 'medicine' ? 'Farmaco' :
                    option.type === 'ingredient' ? 'Principio' : 'ATC'}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          );
        }}
        PaperComponent={(props) => (
          <Paper {...props} sx={{ mt: 1 }}>
            {props.children}
            {inputValue && (
              <>
                <Divider />
                <Box sx={{ p: 0.5, bgcolor: '#f8f9fa' }}>
                  <Typography variant="caption" color="text.secondary">
                    💡 Ordine di ricerca: Farmaci commerciali → Principi attivi → Codici ATC
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        )}
        noOptionsText={
          //loading ? "Caricamento dati AIFA..." : 
          inputValue ? "Nessun risultato trovato" : "Inizia a digitare per cercare"
        }
      />

      {selectedValue && (
        <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Selezione attuale:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {getOptionIcon(selectedValue.type)}
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
      )}

      {/* TODO: show in some info or about window or section */}
      {/* <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Fonte dati:</strong> AIFA Open Data • 
          <strong> Anagrafica Farmaci:</strong> {anagrafica.length} farmaci • 
          <strong> Principi Attivi:</strong> {principiAttivi.length} principi • 
          <strong> Codici ATC:</strong> {atcCodes.length} codici
        </Typography>
      </Box> */}

    </Box>
  );
}
