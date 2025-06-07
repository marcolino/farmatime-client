import { useState, useEffect, useMemo, useRef } from 'react';
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
import { enUS, it, fr, de, es } from 'date-fns/locale'; // TODO: check enUS works with config.locales ...
import { ContextualHelp } from './ContextualHelp';
import { SortableItem } from './SortableItem';
import { MedicineInputAutocomplete } from './MedicineInputAutocomplete';
import { dataAnagrafica, dataPrincipiAttivi, dataATC } from '../data/AIFA';
import { i18n }  from "../i18n";
//import config from '../config';

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
  maxHeight: 500, // TODO: make it dynamical ?
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

export const MedicineList = () => { // TODO: get locale from parent or global state
  const { t } = useTranslation();
  const theme = useTheme();
  const [option, setOption] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('add'); // 'add' or 'update'
  const [fieldToFocus, setFieldToFocus] = useState(null);

  // References to input fields
  const nameRef = useRef(null);
  const frequencyRef = useRef(null);
  const dateRef = useRef(null);

  // Media queries
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  
  // When fieldToFocus changes, focus the corresponding input
  useEffect(() => {
    // Store refs in an object keyed by field name
    const inputRefs = {
      name: nameRef,
      frequency: frequencyRef,
      date: dateRef,
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

    // Filter function moved here
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetItems = () => {
    setInputValue('');
    setOption(null);
    setFrequency(1);
    setDate(new Date());
  };

  const addItem = (e) => {
    //console.log("addItem");
    e.preventDefault();

    const nameTrimmed = e.target[0].value?.trim();
    if (!nameTrimmed) {
      alert(t("Please enter a medicine name.")); // TODO
      return;
    } 
    if (!(frequency > 0)) {
      alert(t("Please enter a valid frequency in days.")); // TODO
      return;
    }

    // TODO: avoid double entries
    
    const optionForced = option || {}
    optionForced.label = nameTrimmed; // Ensure option has the manually edited label
    if (!optionForced.id) {
      const random = Math.random().toString(36).substring(2, 9); // Generate a random string for id
      optionForced.id = `manually_edited_${random}`; // Assign a random id if not set
    }

    if (mode === 'add') {
      if (items.some(item => item.id === optionForced.id)) { // Check if item already exists by id
        //if (optionForced.id in items.map(item => item.id)) { // Check if item already exists by id
        alert(t("This item already exists in the list.")); // TODO
        return;
      }
    }

    resetItems();
    console.log(`addItem - items reset: inputValue: ${inputValue}, option: ${option}, frequency: ${frequency}, date: ${date}`);

    if (mode === 'add') { // Mode is 'add'
      //console.log(`addItem - mode is add`);
      setItems([...items, {
        option: optionForced, // Store the full option object
        id: optionForced.id,
        name: optionForced.label,
        frequency,
        date
      }]);
    } else { // Mode is 'update'
      // Update existing item by id
      //console.log(`addItem - mode is update`);
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItemId // Track which item we are editing
            ? { ...item, option, name: nameTrimmed, frequency, date }
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
      alert(t("Item by id {{id}} not found!", { id })); // TODO... (should not happen)
      return;
    }
    setEditingItemId(id); // Track which item is being edited
    setMode('update');
    setFieldToFocus(field); // e.g. "name", "frequency", or "date"
    setOption(item.option || null);
    setFrequency(item.frequency);
    setDate(new Date(item.date));
    setInputValue(item.name); // Set inputValue to the item's name
  };

  const handleEditStart = (id) => {
    setEditingItemId(id);
    //console.log(`handleEditStart - editingItemId set to: ${id}`);
  };

  const handleEditEnd = () => {
    setEditingItemId(null);
    //console.log(`handleEditEnd - editingItemId reset`);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
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

  const confirmList = () => {
    console.log('Confirmed list:', items);
    alert(t("List confirmed with {{count}} items.", { count: items.length })); // TODO
  };

  const formatDate = (date) => {
    const locale = i18n.language;
    return format(date, getLocaleBasedFormat(), { locale: localeMap[locale] });
  };

  const getLocaleBasedFormat = () => {
    //const locale = navigator.language || 'en-US';
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[i18n.language]}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledPaper>
          <Header>
            <Typography variant="h3" fontWeight="bold">
              {t("Medicines List")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="light">
              {t("Add to the list medicines names, first request date, and frequency of requests in days")}
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
              <ContextualHelp helpPagesKey="MedicineName" fullWidth showOnHover>
                <MedicineInputAutocomplete
                  autoFocus
                  fullWidth
                  variant="outlined"
                  value={option}
                  inputValue={inputValue ?? ""}
                  onChange={(_event, newValue) => {
                    setOption(newValue);
                    setInputValue(newValue ? newValue.label : ''); // Optionally sync inputValue to selected option label
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    // Update inputValue on user typing or clearing
                    if (reason === 'input' || reason === 'clear') {
                        setInputValue(newInputValue);
                    }
                    // if (reason === 'createOption') {
                    //   setInputValue(event.target.value ?? '');
                    // }
                  }}
                  options={getFilteredOptions(inputValue)}
                  placeholder="Enter full name of the medicine"
                  ref={nameRef}
                />
              </ContextualHelp>

              <ContextualHelp helpPagesKey="DateSince">
                <DatePicker
                  label={t("Since day")}
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  format={getLocaleBasedFormat()}
                  sx={{ width: isXs ? 145 : isSm ? 125 : 145 }}
                  PopperProps={{
                    placement: 'bottom-start',
                  }}
                  inputRef={dateRef}
                />
              </ContextualHelp>
              
              <ContextualHelp helpPagesKey="Frequency">
                <TextField
                  label={isXs ? t("Frequency (days)") : isSm ? t("Freq.") : t("Frequency (days)")}
                  variant="outlined"
                  type="number"
                  input={{ min: 1 }}
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
                  sx={{ width: isXs ? 145 : isSm ? 65 : 145 }}
                  inputRef={frequencyRef}
                  />
              </ContextualHelp>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ height: 56, mb: 0.2, px: 4.5 }}
              >
                { mode === 'add' ? t("Add") : t("Update") }
              </Button>
              {(mode === 'update') &&
                <Button
                  type="cancel"
                  onClick={() => { resetItems(); setMode('add'); setEditingItemId(null); }}
                  variant="contained"
                  color="default"
                  size="large"
                  sx={{ height: 56, mb: 0.2, px: 4.5 }}
                >
                  {t("Cancel")}
                </Button>
              }
            </Box>
            
            <Divider />
            
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
                              frequency={item.frequency}
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
                    onClick={confirmList}
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
                    {t("Confirm")}
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

