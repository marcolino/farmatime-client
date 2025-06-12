import { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { useDeepCompareEffect } from 'react-use';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  Paper,
  Divider,
  useTheme,
  styled
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { enUS, it, fr, de, es } from 'date-fns/locale';
import { ContextualHelp } from './ContextualHelp';
import { SortableItem } from './SortableItem';
import { MedicineInputAutocomplete } from './MedicineInputAutocomplete';
import { useSecureStorage } from '../hooks/useSecureStorage';
import { AuthContext } from '../providers/AuthProvider';
import { useSnackbarContext } from '../providers/SnackbarProvider';
import { dataAnagrafica, dataPrincipiAttivi, dataATC } from '../data/AIFA';
import { i18n }  from '../i18n';
import config from '../config';

// TODO: avoid navigating away from page if a list is not confirmed

const localeMap = {
  en: enUS,
  it: it,
  fr: fr,
  de: de,
  es: es,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

const Header = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const ItemContainer = styled(Box)(({ theme }) => ({
  maxHeight: `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.footerHeight}px - 400px - 100px)`, // 100% of viewport height, minus header and footer, minus this component header and footer 
  minHeight: 120,
  overflowY: 'auto',
  marginBottom: theme.spacing(2),
  paddingRight: theme.spacing(1),
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

export const MedicineList = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isLoggedIn } = useContext(AuthContext);
  const [option, setOption] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [fieldMedicine, setFieldMedicine] = useState('');
  const [fieldFrequency, setFieldFrequency] = useState(1);
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('add'); // 'add' or 'update'
  const [fieldToFocus, setFieldToFocus] = useState(null);

  // Use the show snackbar context
  const { showSnackbar } = useSnackbarContext(); 
  
  // Use the secure storage hook
  const { secureStorageStatus, secureStorageSet, secureStorageGet } = useSecureStorage();
  
  // Media queries
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

  // References to input fields
  const fieldMedicineRef = useRef(null);
  const fieldFrequencyRef = useRef(null);
  const fieldDateRef = useRef(null);
  
  const storeItems = async (items) => {
    if (secureStorageStatus !== 'ready') {
      //console.log('skipping secureStorageSet, secureStorageStatus not ready, but', secureStorageStatus);
      return;
    }
    try {
      await secureStorageSet('userData', items);
      console.log(`List stored with ${items.length} items`);
      // showSnackbar(
      //   t('List confirmed with {{count}} items', { count: items.length }), 
      //   'success'
      // );
    } catch (err) {
      //console.error(`Failed to save list: ${err.message}`);
      showSnackbar(t('Failed to save list: {{error}}', { 
        error: err.message 
      }), 'error');
    }
  }

  // Temporary useEffect: these checks should be done in an higher level component (like a route guard)
  useEffect(() => {
    if (!isLoggedIn) {
      showSnackbar(t('User must be logged in'), 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  
  // Load data when secure storage is ready
  useEffect(() => {
    if (secureStorageStatus !== 'ready') return;
    const loadData = async () => {
      try {
        const data = await secureStorageGet('userData');
        if (data) {
          setItems(data);
          //console.log(`${data?.length} items loaded successfully`);
        }
      } catch (err) {
        console.error(`Error loading data: ${err.message}`);
        showSnackbar(t('Error loading data: {{error}}', {
          error: err.message
        }), 'error');
      }
    };
    loadData();
  }, [secureStorageStatus, secureStorageGet, showSnackbar, t]);

  // When items effectively change, store them immediately
  useDeepCompareEffect(() => {
    storeItems(items);
  }, [items]);
  
  // When fieldToFocus changes, focus the corresponding input
  useEffect(() => {
    // Store refs in an object keyed by field name
    const inputRefs = {
      name: fieldMedicineRef,
      frequency: fieldFrequencyRef,
      date: fieldDateRef,
    };

    if (fieldToFocus && inputRefs[fieldToFocus]?.current) {
      inputRefs[fieldToFocus].current.focus();
    }
  }, [fieldToFocus]);

  // Create unified options
  const unifiedOptions = useMemo(() => {
    if (!dataAnagrafica.length || !dataPrincipiAttivi.length || !dataATC.length) return [];

    const options = [];

    dataAnagrafica.forEach(medicine => {
      options.push({
        id: `med_${medicine.id}`,
        label: medicine.name + (medicine.form ? ' • ' : '') + (medicine.form || ''),
        type: 'medicine',
        data: medicine,
        searchTerms: [medicine.name.toLowerCase()]
      });
    });

    dataPrincipiAttivi.forEach(ingredient => {
      options.push({
        id: `ing_${ingredient.id}`,
        label: ingredient.name + (ingredient.description ? ' • ' : '') + (ingredient.description || ''),
        type: 'ingredient',
        data: ingredient,
        searchTerms: [ingredient.name.toLowerCase()]
      });
    });

    dataATC.forEach(atc => {
      options.push({
        id: `atc_${atc.code}`,
        label: `${atc.code} - ${atc.description}`,
        type: 'atc',
        data: atc,
        searchTerms: [atc.code.toLowerCase(), atc.description.toLowerCase()]
      });
    });

    return options;
  }, []);


  // Medicines filter function
  const getFilteredOptions = (inputVal) => {
    if (!inputVal) return [];

    const query = inputVal.toLowerCase();
    const results = [];

    const getMatchScore = (terms) => {
      let score = 0;
      for (const term of terms) {
        if (term.startsWith(query)) score += 2;
        else if (term.includes(query)) score += 1;
      }
      return score;
    };

    const sortByMatchQuality = (a, b) => {
      return getMatchScore(b.searchTerms) - getMatchScore(a.searchTerms);
    };

    const medicines = unifiedOptions
      .filter(o => o.type === 'medicine' && o.searchTerms.some(term => term.includes(query)))
      .sort(sortByMatchQuality)
      .slice(0, 8);
    results.push(...medicines);

    if (results.length < 15) {
      const ingredients = unifiedOptions
        .filter(o => o.type === 'ingredient' && o.searchTerms.some(term => term.includes(query)))
        .sort(sortByMatchQuality)
        .slice(0, 15 - results.length);
      results.push(...ingredients);
    }

    if (results.length < 15) {
      const atcMatches = unifiedOptions
        .filter(o => o.type === 'atc' && o.searchTerms.some(term => term.includes(query)))
        .sort(sortByMatchQuality)
        .slice(0, 15 - results.length);
      results.push(...atcMatches);
    }

    return results;
  };

  // Define Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetItems = () => {
    setFieldMedicine('');
    setFieldFrequency(1);
    setDate(new Date());
    setOption(null);
  };

  const addItem = (e) => {
    e.preventDefault();

    const nameTrimmed = e.target[0].value?.trim();
    if (!nameTrimmed) {
      showSnackbar(t('Please enter a medicine name'), 'warning');
      return;
    } 
    if (!(fieldFrequency > 0)) {
      showSnackbar(t('Please enter a valid frequency in days'), 'warning');
      return;
    }

    const optionForced = option || {}
    optionForced.label = nameTrimmed; // Ensure option has the manually edited label
    if (!optionForced.id) {
      const random = Math.random().toString(36).substring(2, 9); // Generate a random string for id
      optionForced.id = `manually_edited_${random}`; // Assign a random id if not set
    }

    if (mode === 'add') {
      if (items.some(item => item.id === optionForced.id)) { // Check if item already exists by id
        showSnackbar(t('This item already exists in the list'), 'warning');
        return;
      }
    }

    resetItems();
    console.log(`addItem - items reset: fieldMedicine: ${fieldMedicine}, fieldFrequency: ${fieldFrequency}, date: ${date}, option: ${option}`);

    if (mode === 'add') { // Mode is 'add'
      setItems([...items, {
        option: optionForced, // Store the full option object
        id: optionForced.id,
        name: optionForced.label,
        fieldFrequency,
        date
      }]);
    } else { // Mode is 'update'
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItemId // Track which item we are editing
            ? { ...item, option, name: nameTrimmed, fieldFrequency, date }
            : item
        )
      );
      setEditingItemId(null); // Clear editing state
      setMode('add'); // Reset to add mode
    }
  };

  const startEdit = (id, field) => {
    const item = items.find(i => i.id === id);
    if (!item) {
      showSnackbar(t('Item by id {{id}} not found!', { id }), 'error'); // should not happen...
      return;
    }
    setEditingItemId(id); // Track which item is being edited
    setMode('update');
    setFieldToFocus(field); // e.g. 'name', 'frequency', or 'date'
    setOption(item.option || null);
    setFieldFrequency(item.fieldFrequency);
    setDate(new Date(item.date));
    setFieldMedicine(item.name); // Set fieldMedicine to the item's name
  };

  const handleEditStart = (id) => {
    setEditingItemId(id);
    //console.log(`handleEditStart - editingItemId set to: ${id}`);
  };

  const handleEditEnd = () => {
    setEditingItemId(null);
    //console.log(`handleEditEnd - editingItemId reset`);
  };

  const removeItem = async (id) => {
    const filteredItems = items.filter(item => item.id !== id);
    setItems(filteredItems);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const proceed = async () => {
    // TODO: check if input is being edited, and show a warning, asking to complete editing, or cancel editing...
    console.log('Proceeding...');
    showSnackbar(t('Proceeding...'), 'info');
  };

  const formatDate = (date) => {
    const locale = i18n.language;
    return format(date, getLocaleBasedFormat(), { locale: localeMap[locale] });
  };

  const getLocaleBasedFormat = () => {
    const locale = i18n.language;

    // US format: MMM dd (Jun 02)
    if (locale.startsWith('en-US')) {
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
  };

  if (!isLoggedIn) { // Check if user is logged in
    console.log(t('User must be logged in to use this component'));
    return null;
  }
  
  if (secureStorageStatus === 'error') {
    console.log('Secure storage status is error');
    return null;
  }

  if (secureStorageStatus === 'initializing') {
    //console.log('Loading secure storage...');
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[i18n.language]}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledPaper>
          <Header>
            <Typography variant="h3" fontWeight="bold">
              {t("Medicines List")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="light">
              {t('Add to the list medicines names, first request date, and frequency of requests in days')}
            </Typography>
          </Header>
          
          <Box p={4}>

            <Box
              component="form"
              onSubmit={addItem}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 4,
                alignItems: 'flex-end'
              }}
            >
              {/* First row: Only the medicine input on xs, full row on sm+ */}
              <Box
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  flexGrow: { xs: 0, sm: 1 }, // Take all space on sm+, not on xs
                  mb: { xs: 2, sm: 0 }
                }}
              >
                <ContextualHelp helpPagesKey="MedicineName" fullWidth showOnHover>
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
                    onInputChange={(event, newFieldMedicine, reason) => {
                      if (reason === 'input' || reason === 'clear') {
                        setFieldMedicine(newFieldMedicine);
                      }
                    }}
                    options={getFilteredOptions(fieldMedicine)}
                    placeholder="Enter full name of the medicine"
                    ref={fieldMedicineRef}
                  />
                </ContextualHelp>
              </Box>

              {/* Second row (xs): Date, Frequency, Buttons; 
                  On sm+, these are just next to the input */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                <ContextualHelp helpPagesKey="DateSince">
                  <DatePicker
                    label={t('Since day')}
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    format={getLocaleBasedFormat()}
                    sx={{ width: isXs ? 145 : isSm ? 125 : 145 }}
                    PopperProps={{
                      placement: 'bottom-start',
                    }}
                    inputRef={fieldDateRef}
                  />
                </ContextualHelp>

                <ContextualHelp helpPagesKey="Frequency">
                  <TextField
                    label={isXs ? t('Freq.') : isSm ? t('Freq.') : t('Frequency (days)')}
                    variant="outlined"
                    type="number"
                    input={{ min: 1 }}
                    value={fieldFrequency}
                    onChange={(e) => setFieldFrequency(parseInt(e.target.value) || 1)}
                    sx={{ width: isXs ? 65 : isSm ? 65 : 145 }}
                    inputRef={fieldFrequencyRef}
                  />
                </ContextualHelp>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ height: 56, mb: 0.2, px: isSm ? 1 : 4.5 }}
                >
                  {mode === 'add' ? t('Add') : t('Update')}
                </Button>
                {mode === 'update' && (
                  <Button
                    type="button"
                    onClick={() => { resetItems(); setMode('add'); setEditingItemId(null); }}
                    variant="contained"
                    color="default"
                    size="large"
                    sx={{ height: 56, mb: 0.2, px: isSm ? 1 : 4.5 }}
                  >
                    {t('Cancel')}
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ margin: -1.5 }} />
            
            <Box mt={4}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  <ItemContainer>
                    {items.length === 0 ? (
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        textAlign="center" 
                        py={3}
                      >
                        No items present yet
                      </Typography>
                    ) : (
                        <Box component="ul" sx={{ p: 0, m: 0 }}>
                          {items.map((item) => (
                            <SortableItem 
                              key={item.id} 
                              id={item.id}
                              name={item.option.label}
                              frequency={item.fieldFrequency}
                              date={item.date}
                              formatDate={formatDate}
                              onEdit={startEdit}
                              onRemove={removeItem}
                              isEditing={item.id === editingItemId}
                              onEditStart={() => handleEditStart(item.id)}
                              onEditEnd={handleEditEnd}
                            />
                          ))
                        }
                      </Box>
                    )}
                  </ItemContainer>
                </SortableContext>
              </DndContext>

              {items.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    // onClick={confirmList}
                    onClick={proceed}
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{
                      height: 56,
                      mb: 0.2
                    }}
                    disabled={mode === 'update' || items.length === 0}
                  >
                    {/* {t('Confirm')} */}
                    {t('Proceed')}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    </LocalizationProvider>
  );
};
