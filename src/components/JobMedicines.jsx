import React, { useState, useEffect, useMemo, useRef, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor, // Import MouseSensor
  TouchSensor, // Import TouchSensor
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  useTheme,
  styled
} from '@mui/material'; // Changed to @mui/material
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ContextualHelp } from './ContextualHelp';
import { SortableItem } from './SortableItem';
import { MedicineInputAutocomplete } from './MedicineInputAutocomplete';
import { AuthContext } from '../providers/AuthContext';
import { useSnackbarContext } from '../providers/SnackbarProvider';
//import { dataAnagrafica, dataPrincipiAttivi, dataATC } from '../data/AIFA';
import { StyledPaper, StyledBox } from './JobStyles';
import { i18n } from '../i18n';
import { localeMap, formatDate } from '../libs/Misc';
import config from '../config';

const ItemContainer = styled(Box)(({ theme }) => ({
  // 100% of viewport height, minus header and footer, minus this component header and footer
  maxHeight: `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.footerHeight}px - 400px - 120px)`,
  minHeight: 120,
  overflowY: 'auto',
  marginBottom: theme.spacing(2),
  paddingRight: theme.spacing(1),
  //touchAction: 'none',
  '&::-webkit-scrollbar': {
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[400],
    borderRadius: 4,
  },
}));

const JobMedicines = ({ data, onChange, onEditingChange, onCompleted/*, hasNavigatedAway*/}) => {
  const { t } = useTranslation();
  //const navigate = useNavigate();
  const theme = useTheme();
  //const { isLoggedIn } = useContext(AuthContext);
  const [option, setOption] = useState(null); // Initialize with null for clarity
  const [editingItemId, setEditingItemId] = useState(null);
  const [fieldMedicine, setFieldMedicine] = useState('');
  const [fieldFrequency, setFieldFrequency] = useState(1);
  const [fieldSinceDate, setfieldSinceDate] = useState(new Date());
  const [mode, setMode] = useState('add');
  const [fieldToFocus, setFieldToFocus] = useState(null);

  const { showSnackbar } = useSnackbarContext();
  //const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

  // References to input fields
  const fieldMedicineRef = useRef(null);
  const fieldFrequencyRef = useRef(null);
  const fieldSinceDateRef = useRef(null);

  const [dataAnagrafica, setDataAnagrafica] = useState([]);
  const [dataPrincipiAttivi, setDataPrincipiAttivi] = useState([]);
  const [dataATC, setDataATC] = useState([]);

  //const fieldFrequencMinimum = 1;

  // dynamically load AIFA data for medicines
  useEffect(() => {
    import('../data/AIFA').then(module => {
      setDataAnagrafica(module.dataAnagrafica);
      setDataPrincipiAttivi(module.dataPrincipiAttivi);
      setDataATC(module.dataATC);
    });
  }, []);
  
  console.log("MEDICINES:", data);
  console.log("dataAnagrafica:", dataAnagrafica);

  // Reset date when locale changes
  useEffect(() => {
    setfieldSinceDate(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Focus handling
  useEffect(() => {
    const inputRefs = {
      name: fieldMedicineRef,
      frequency: fieldFrequencyRef,
      date: fieldSinceDateRef,
    };

    if (fieldToFocus && inputRefs[fieldToFocus]?.current) {
      // Small delay to ensure the field is rendered and ready for focus
      const timer = setTimeout(() => {
        inputRefs[fieldToFocus].current.focus();
      }, 100);
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [fieldToFocus]);

  // inform caller we are finished editing if no medicine name is set
  useEffect(() => {
    if (!fieldMedicine) {
      onEditingChange(false);
    }
  }, [fieldMedicine, onEditingChange]);

  // inform caller a valid medicines list (at least one item is present) is available
  useEffect(() => {
    onCompleted(isValid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isValid = () => {
    return (data.length >= 1);  // at least one item is present)
  };

  // Create unified options
  const unifiedOptions = useMemo(() => {
    if (!dataAnagrafica.length || !dataPrincipiAttivi.length || !dataATC.length) return [];

    return [
      ...dataAnagrafica.map(medicine => ({
        id: `med_${medicine.id}`,
        label: medicine.name + (medicine.form ? ' • ' : '') + (medicine.form || ''),
        type: 'medicine',
        data: medicine,
        searchTerms: [medicine.name.toLowerCase()]
      })),
      ...dataPrincipiAttivi.map(ingredient => ({
        id: `ing_${ingredient.id}`,
        label: ingredient.name + (ingredient.description ? ' • ' : '') + (ingredient.description || ''),
        type: 'ingredient',
        data: ingredient,
        searchTerms: [ingredient.name.toLowerCase()]
      })),
      ...dataATC.map(atc => ({
        id: `atc_${atc.code}`,
        label: `${atc.code} - ${atc.description}`,
        type: 'atc',
        data: atc,
        searchTerms: [atc.code.toLowerCase(), atc.description.toLowerCase()]
      }))
    ];
  }, [dataAnagrafica, dataPrincipiAttivi, dataATC]);

  // Filter function
  const getFilteredOptions = useCallback((inputVal) => {
    if (!inputVal) return [];
    const query = inputVal.toLowerCase();

    const getMatchScore = (terms) => terms.reduce((score, term) =>
      term.startsWith(query) ? score + 2 : term.includes(query) ? score + 1 : score, 0);

    const sortByMatchQuality = (a, b) => getMatchScore(b.searchTerms) - getMatchScore(a.searchTerms);

    const filterAndSlice = (type, limit) => unifiedOptions
      .filter(o => o.type === type && o.searchTerms.some(term => term.includes(query)))
      .sort(sortByMatchQuality)
      .slice(0, limit);

    const results = filterAndSlice('medicine', 8);
    if (results.length < 15) results.push(...filterAndSlice('ingredient', 15 - results.length));
    if (results.length < 15) results.push(...filterAndSlice('atc', 15 - results.length));

    return results;
  }, [unifiedOptions]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetItems = useCallback(() => {
    setFieldMedicine('');
    setFieldFrequency(1);
    setfieldSinceDate(new Date());
    setOption(null); // Reset option to null
    onEditingChange(false); // inform caller we are done editing
    setFieldToFocus(null); // Clear focus
  }, [onEditingChange]);

  const addItem = useCallback((e) => {
    e.preventDefault();

    const name = fieldMedicine?.trim(); // Use state variable directly
    if (!name) {
      showSnackbar(t('Please enter a medicine name'), 'warning');
      return;
    }
    if (!fieldSinceDate) {
      showSnackbar(t('Please enter a valid date'), 'warning');
      return;
    }
    if (!(fieldFrequency > 0)) {
      showSnackbar(t('Please enter a valid frequency in days'), 'warning');
      return;
    }

    // Use a unique ID for new items, if not already existing (for manual input)
    const newItemId = option?.id || name;

    if (mode === 'add') {
      if (data.some(item => item.id === newItemId)) {
        showSnackbar(t('This item already exists in the list'), 'warning');
        return;
      }
      onChange([...data, {
        id: newItemId, // Use the new unique ID or existing option ID
        name,
        fieldFrequency,
        fieldSinceDate,
        option: option // Store the full option object for re-editing
      }]);
    } else { // mode === 'update'
      onChange(data.map(item =>
        item.id === editingItemId
          ? { ...item, option, name, fieldFrequency, fieldSinceDate } // Update option as well
          : item
      ));
      handleEditEnd();
      setMode('add');
    }
    resetItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldMedicine, fieldSinceDate, fieldFrequency, option, mode, data, editingItemId, onChange, resetItems, showSnackbar, t]);


  const startEdit = useCallback((id, field) => {
    const item = data.find(i => i.id === id);
    if (!item) {
      showSnackbar(t('Item by ID {{id}} not found!', { id }), 'error');
      return;
    }
    setEditingItemId(id); // Use item.id for editingItemId
    setMode('update');
    setFieldToFocus(field); // e.g. 'name', 'frequency', or 'date'
    setOption(item.option || null); // Restore the full option object
    setFieldFrequency(item.fieldFrequency);
    setfieldSinceDate(new Date(item.fieldSinceDate));
    setFieldMedicine(item.name);
    onEditingChange(true); // inform caller we are editing
  }, [data, onEditingChange, showSnackbar, t]);

  const handleEditEnd = useCallback(() => {
    setEditingItemId(null);
    onEditingChange(false); // Ensure parent knows editing has ended
  }, [onEditingChange]);

  const removeItem = useCallback((id) => {
    onChange(data.filter(item => item.id !== id));
    if (editingItemId === id) { // If the removed item was being edited, reset the form
      resetItems();
      setMode('add');
      handleEditEnd();
    }
  }, [data, onChange, editingItemId, resetItems, handleEditEnd]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = data.findIndex(item => item.id === active.id);
      const newIndex = data.findIndex(item => item.id === over.id);
      onChange(arrayMove(data, oldIndex, newIndex));
    }
  }, [data, onChange]);

  const getLocaleBasedFormat = useCallback(() => {
    const locale = i18n.language;
    //console.log('getLocaleBasedFormat called with locale:', locale);

    // US format: MMM dd (Jun 02)
    if (locale.startsWith('en')) {
      return 'MMM dd';
    }

    // Most other locales: dd MMM (02 Jun)
    if (
      locale.startsWith('en') ||
      locale.startsWith('it') ||
      locale.startsWith('de') ||
      locale.startsWith('fr')
    ) {
      return 'dd MMM';
    }

    // Default fallback
    return 'dd MMM';
  }/*, [i18n.language]*/);

  const isDataLoaded =
    dataAnagrafica.length > 0 &&
    dataPrincipiAttivi.length > 0 &&
    dataATC.length > 0
  ;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[i18n.language]}>
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <StyledPaper>
          <StyledBox>
            <Typography variant="h5" fontWeight="bold">
              {t("Medicines List")}
            </Typography>
          </StyledBox>

          <Box p={4}>
            <Box
              component="form"
              onSubmit={addItem}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 4,
              }}
            >
              {/* First row: medicine input (xs: alone, sm+: with date & frequency) */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'flex-end'
                }}
              >
                {/* Medicine input - takes maximum space */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    flexGrow: { xs: 1, sm: 1 }, // Take all available space
                  }}
                >
                  <ContextualHelp helpPagesKey="MedicineName" fullWidth showOnHover>
                    {!isDataLoaded ? (
                      null //<Typography>{t('loading medicines data...')}</Typography>
                    ) : (
                      <MedicineInputAutocomplete
                        autoFocus
                        fullWidth
                        variant="outlined"
                        value={option}
                        inputValue={fieldMedicine ?? ''}
                        onChange={(_event, newValue) => {
                          setOption(newValue);
                          setFieldMedicine(newValue ? newValue.label : '');
                        }}
                        onInputChange={(_event, newFieldMedicine, reason) => {
                          if (reason === 'input' || reason === 'clear') {
                            setFieldMedicine(newFieldMedicine);
                          }
                          onEditingChange(true); // inform caller we are editing
                        }}
                        options={getFilteredOptions(fieldMedicine)}
                        placeholder={t("Enter full name of the medicine")}
                        ref={fieldMedicineRef}
                      />
                    )}
                  </ContextualHelp>
                </Box>

                {/* Date picker - only visible on sm+ screens */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <ContextualHelp helpPagesKey="DateSince">
                    <DatePicker
                      key={i18n.language} // This forces a complete remount when locale changes
                      label={t('Since day')}
                      value={fieldSinceDate}
                      onChange={setfieldSinceDate}
                      format={getLocaleBasedFormat()}
                      sx={{ width: 132 }}
                      PopperProps={{ placement: 'bottom-start' }}
                      minDate={new Date()} // Today onwards: only dates in the future
                      formatDensity="spacious"
                      inputRef={fieldSinceDateRef}
                    />
                  </ContextualHelp>
                </Box>

                {/* Frequency input - only visible on sm+ screens */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <ContextualHelp helpPagesKey="Frequency">
                    <TextField
                      label={isSm ? t('Freq.') : t('Frequency (days)')}
                      variant="outlined"
                      type="number"
                      value={fieldFrequency}
                      onChange={(e) => {
                        const val = e.target.value;
                        // allow empty string or numeric strings only
                        if (val === "" || /^[0-9\b]+$/.test(val)) {
                          setFieldFrequency(val);
                        }
                      }}
                      sx={{ width: { sm: 65, md: 145 } }}
                      inputRef={fieldFrequencyRef}
                    />
                  </ContextualHelp>
                </Box>

                {/* Buttons - only visible on sm+ screens */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'row',
                    gap: 2,
                    mt: 0,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      height: 56,
                      mb: 0.2,
                      px: { sm: 1, md: 4.5 },
                    }}
                  >
                    {mode === 'add' ? t('Add') : t('Update')}
                  </Button>
                  {mode === 'update' && (
                    <Button
                      type="button"
                      onClick={() => { resetItems(); setMode('add'); handleEditEnd(); }}
                      variant="contained"
                      color="default"
                      size="large"
                      sx={{
                        height: 56,
                        mb: 0.2,
                        px: { sm: 1, md: 4.5 },
                      }}
                    >
                      {t('Cancel')}
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Second row: date + frequency (xs screens only) */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'flex-end'
                }}
              >
                {/* Date picker */}
                <ContextualHelp helpPagesKey="DateSince">
                  <DatePicker
                    key={i18n.language} // This forces a complete remount when locale changes
                    label={t('Since day')}
                    value={fieldSinceDate}
                    onChange={setfieldSinceDate}
                    format={getLocaleBasedFormat()}
                    sx={{ width: 132 }}
                    PopperProps={{ placement: 'bottom-start' }}
                    minDate={new Date()} // Today onwards: only dates in the future
                    formatDensity="spacious"
                    inputRef={fieldSinceDateRef}
                  />
                </ContextualHelp>

                {/* Frequency input */}
                <ContextualHelp helpPagesKey="Frequency">
                  <TextField
                    label={t('Freq.')}
                    variant="outlined"
                    type="number"
                    value={fieldFrequency}
                    onChange={(e) => {
                      const val = e.target.value;
                      // allow empty string or numeric strings only
                      if (val === "" || /^[0-9\b]+$/.test(val)) {
                        setFieldFrequency(val);
                      }
                    }}
                    sx={{ width: 65 }}
                    inputRef={fieldFrequencyRef}
                  />
                </ContextualHelp>
              </Box>

              {/* Third row: buttons - only visible on xs screens */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  flexDirection: 'row',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    height: mode === 'update' ? 36 : 56,
                    px: 0,
                    width: mode === 'update' ? '100%' : 'auto',
                    flexGrow: mode === 'update' ? 0 : 1,
                  }}
                >
                  {mode === 'add' ? t('Add') : t('Update')}
                </Button>
                {mode === 'update' && (
                  <Button
                    type="button"
                    onClick={() => { resetItems(); setMode('add'); handleEditEnd(); }}
                    variant="contained"
                    color="default"
                    size="large"
                    sx={{
                      height: 36,
                      px: 0,
                      width: '100%',
                    }}
                  >
                    {t('Cancel')}
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ margin: -1 }} />

            <Box mt={4}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={data}
                  strategy={verticalListSortingStrategy}
                >
                  <ItemContainer>
                    {data.length === 0 ? (
                      <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
                        {t("No medicines present yet")}
                      </Typography>
                    ) : (
                      <Box component="ul" sx={{ p: 0, m: 0 }}>
                        {data.map((item) => (
                          <SortableItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            frequency={item.fieldFrequency}
                            date={item.fieldSinceDate}
                            formatDate={formatDate}
                            onEdit={startEdit}
                            onRemove={removeItem}
                            isEditing={item.id === editingItemId}
                          />
                        ))}
                      </Box>
                    )}
                  </ItemContainer>
                </SortableContext>
              </DndContext>
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    </LocalizationProvider>
  );
};

export default React.memo(JobMedicines);
