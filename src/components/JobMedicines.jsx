import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
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
  IconButton,
  Container,
  TextField,
  Typography,
  Tooltip,
  Divider,
  useTheme,
  styled
} from '@mui/material';
import { Add, Check} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ContextualHelp } from './ContextualHelp';
import { JobMedicinesSortableItem } from './JobMedicinesSortableItem';
import { MedicineInputAutocomplete } from './MedicineInputAutocomplete';
import { JobContext } from '../providers/JobContext';
import { useSnackbarContext } from '../hooks/useSnackbarContext';
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { StyledPaper, StyledBox } from './JobStyles';
import { i18n } from '../i18n';
import { localeMap, formatDateDDMMM, getLanguageBasedFormatDDMMM } from '../libs/Misc';
import makeGetFilteredOptions from '../libs/MakeGetFilteredOptions';
//import medicinesList from '../data/AIFA';
import config from '../config';

const ItemContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})(({ theme, isMobile }) => ({
  /**
   * 100% of viewport height, minus header and footer, minus this component header and footer
   * Sets a higher limit to  the visible height
   * on mobile we set a higher limit since the whole page scrolls anyway;
   * this way more than one item is always (if present) visible,
   * resulting in a clearer interface for the user:
   * it is clear that in this container there can be more than one item.
   * otherwise we limit maxHeight so that the whole page is visible,
   * including the footer, and the scroll is limited to this container.
   */
  maxHeight: isMobile ?
    `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.footerHeight}px - 290px - 120px)` :
    `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.footerHeight}px - 380px - 120px)`
  ,
  minHeight: 100, // to let the medicines container always visible
  overflowY: 'auto',
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(1),
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



const JobMedicines = ({ data = [], onChange, onEditingChange, onCompleted }) => {
  const { t } = useTranslation();
  //const navigate = useNavigate();
  const theme = useTheme();
  //const { isLoggedIn } = useContext(AuthContext);
  const { checkUserJobRequests } = useContext(JobContext);
  const [option, setOption] = useState(null); // Initialize with null for clarity
  const [editingItemId, setEditingItemId] = useState(null);
  const [fieldMedicine, setFieldMedicine] = useState('');
  const [fieldFrequency, setFieldFrequency] = useState(1);
  //const [fieldSinceDate, setfieldSinceDate] = useState(new Date());
  const [fieldSinceDate, setFieldSinceDate] = useState(tomorrowAsString());
  const [showAddUpdateBlock, setShowAddUpdateBlock] = useState(false);
  const [mode, setMode] = useState('add');
  const [fieldToFocus, setFieldToFocus] = useState(null);
  const { showSnackbar } = useSnackbarContext();
  const { isMobile } = useMediaQueryContext();
  const [getFilteredOptions, setGetFilteredOptions] = useState(() => {
    const FilterLoading = () => [];
    FilterLoading.displayName = 'FilterLoading';
    return FilterLoading;
  });
  
  // References to input fields
  const fieldMedicineRef = useRef(null);
  const fieldFrequencyRef = useRef(null);
  const fieldSinceDateRef = useRef(null);
  
  // function today() {
  //   return new Date();
  // }

  function tomorrowAsString() {
   const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Returns "2025-11-25"
  }

  // Reset date when locale changes
  useEffect(() => {
    setFieldSinceDate(tomorrowAsString()/*new Date()*/);
  }, []);

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
  }, [fieldMedicine]); // eslint-disable-line react-hooks/exhaustive-deps

  // inform caller a valid medicines list (at least one item is present) is available
  useEffect(() => {
    onCompleted(isValid());
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { default: medicinesList } = await import("../data/AIFA.js");
      if (cancelled) return;

      const factory = makeGetFilteredOptions(medicinesList, { limit: 15 });
      setGetFilteredOptions(() => factory);
    })();

    return () => { cancelled = true; };
   }, []);
  
  const isValid = () => {
    return (data.length >= 1);  // at least one item is present)
  };

  // // Build search function only once
  // const getFilteredOptions = useMemo(() => {
  //   return makeGetFilteredOptions(medicinesList, { limit: 15 });
  // }, []);
  
// DEBUG ONLY
// const getFilteredOptions = makeGetFilteredOptions([
//   "Aspirina - 500 Mg Granulato - 10 Bustine",
//   "Paracetamolo 1000 Mg Compresse"
// ]);
// getFilteredOptions("aspirina 500");
  
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
    setFieldSinceDate(tomorrowAsString());
    setOption(null); // Reset option to null
    onEditingChange(false); // inform caller we are done editing
    setFieldToFocus(null); // Clear focus
  }, [onEditingChange]);

  const addItem = useCallback(async (e) => {
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

    // // Use a unique ID for new items, if not already existing (for manual input)
    const newItemId = option?.id || name;
    const newItemName = option?.name || name;

    if (mode === 'add') {
      //if (data.some(item => item.id === newItemId)) {
      if (data.some(item => item.name === newItemName)) {
        showSnackbar(t('This item already exists in the list'), 'warning');
        return;
      }

      const userJobRequestsStatus = await checkUserJobRequests(data);
      if (userJobRequestsStatus.check === false) {
        showSnackbar(userJobRequestsStatus.message, 'warning');
        return;
      }

      onChange([...data, {
        id: newItemId, // Use the new unique ID or existing option ID
        name,
        fieldFrequency,
        fieldSinceDate,
        option: option // Store the full option object for re-editing
      }]);
      handleEditEnd(); // close Edit mode after adding a medicine
    } else { // mode === 'update'
      onChange(data.map(item =>
        item.id === editingItemId
          ? { ...item, option, name: name.trim(), fieldFrequency, fieldSinceDate } // Update option as well
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
    setShowAddUpdateBlock(true);
    setFieldToFocus(field); // e.g. 'name', 'frequency', or 'date'
    setOption(item.option || null); // Restore the full option object
    setFieldFrequency(item.fieldFrequency);
    setFieldSinceDate(new Date(item.fieldSinceDate));
    setFieldMedicine(item.name);
    onEditingChange(true); // inform caller we are editing
  }, [data, onEditingChange, showSnackbar, t]);

  const handleEditEnd = useCallback(() => {
    setEditingItemId(null);
    setShowAddUpdateBlock(false);
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
  
  //const isDataLoaded = medicinesList.length > 0;
  const isDataLoaded = true;
  // const isDataLoaded =
  //   dataAnagrafica.length > 0 &&
  //   dataPrincipiAttivi.length > 0 &&
  //   dataATC.length > 0
  // ;

  // optional: show loading UI until AIFA is loaded
  // if (true || getFilteredOptions.toString() === "() => []") {
  //   return <CircularProgress size={20} />;
  // }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[i18n.language]}>
      <Container maxWidth="xl">
        <StyledPaper sx={{ mt: isMobile ? 1 : 2 }}>
          <StyledBox>
            <Typography variant="h5" fontWeight="bold">
              {t("Medicines List")}
            </Typography>
          </StyledBox>

          <Box p={2} sx={{ py: 1 }}>
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
                {data.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" textAlign="center" fontStyle="italic" py={2}>
                    {t("No medicines present yet")}
                  </Typography>
                ) : (
                  <ItemContainer isMobile={isMobile}>
                    <Box component="ul" sx={{
                      p: 0, m: 0,
                      overflowY: 'auto', // adds scrollbar when content exceeds
                    }}>
                      {data.map((item) => (
                        <JobMedicinesSortableItem
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          frequency={item.fieldFrequency}
                          date={item.fieldSinceDate}
                          formatDate={formatDateDDMMM}
                          onEdit={startEdit}
                          onRemove={removeItem}
                          isEditing={item.id === editingItemId}
                        />
                      ))}
                    </Box>
                  </ItemContainer>
                )}
              </SortableContext>
            </DndContext>
          
            {!showAddUpdateBlock && ( /* PLUS button */
              <Box display="flex" justifyContent="flex-end" width="100%">
                <Tooltip title={t("Add a new medicine")} arrow>
                  <IconButton
                    aria-label={t("Add a new medicine")}
                    size={isMobile ? "small" : "normal"}
                    onClick={() => setShowAddUpdateBlock(true)}
                    disabled={false}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      mr: isMobile ? '4vw' : '3vw',
                    }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {showAddUpdateBlock && (
            <React.Fragment>

              <Divider sx={{ m: 0}} />

              <Box p={4}>
                <Box
                  //component="form"
                  //onSubmit={addItem}
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
                      <ContextualHelp helpPagesKey="MedicineName" fullWidth showOnHover showOnMobileToo>
                        {!isDataLoaded ? (
                          null //<Typography>{t('loading medicines data...')}</Typography>
                        ) : (
                        
                          <MedicineInputAutocomplete
                            value={option ?? null}
                            inputValue={fieldMedicine ?? ""}
                            //options={getFilteredOptions(fieldMedicine) ?? []}
                            getFilteredOptions={getFilteredOptions}
                            autoFocus
                            onChange={(_event, newValue) => {
                              if (typeof newValue === "string") {
                                // User typed and pressed Enter → treat as free text
                                setOption(null);
                                setFieldMedicine(newValue);
                              } else if (newValue && newValue.inputValue) {
                                // (Only if you later add "create new option" pattern)
                                setOption(null);
                                setFieldMedicine(newValue.inputValue);
                              } else {
                                // User picked an existing option
                                setOption(newValue);
                                setFieldMedicine(newValue ? newValue.label : "");
                              }

                              onEditingChange(true);
                            }}
                            onInputChange={(_event, newInputValue, reason) => {
                              if (reason === "input" || reason === "clear") {
                                setFieldMedicine(newInputValue);
                                if (!newInputValue) {
                                  setOption(null);
                                }
                              }
                              onEditingChange(true);
                            }}
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
                          //value={fieldSinceDate}
                          value={new Date(fieldSinceDate)} // Convert string back to Date for DatePicker
                          // onChange={setFieldSinceDate}
                          onChange={(date) => {
                            if (date) {
                              // Convert to YYYY-MM-DD string
                              const dateString = date.toISOString().split('T')[0];
                              setFieldSinceDate(dateString);
                            }
                          }}
                          format={getLanguageBasedFormatDDMMM(i18n.language)}
                          sx={{ width: 132 }}
                          PopperProps={{ placement: 'bottom-start' }}
                          //minDate={new Date()} // Today onwards: only dates in the future
                          formatDensity="spacious"
                          inputRef={fieldSinceDateRef}
                        />
                      </ContextualHelp>
                    </Box>

                    {/* Frequency input - only visible on sm+ screens */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <ContextualHelp helpPagesKey="Frequency">
                        <TextField
                          label={isMobile ? t('Freq.') : t('Frequency (days)')}
                          variant="outlined"
                          type="number"
                          value={fieldFrequency}
                          onChange={(e) => {
                            const val = e.target.value;
                            // allow empty string or numeric strings only
                            if (val === "" || /^[0-9\b]+$/.test(val)) {
                              //setFieldFrequency(val);
                              setFieldFrequency(val === "" ? "" : parseInt(val, 10));
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
                        //type="submit"
                        onClick={addItem}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={mode === 'add' ? <Add /> : <Check />}
                        disabled={!fieldMedicine} /* enable only when something is present in fieldMedicine, for a better UI clarity */
                        sx={{
                          height: 56,
                          mb: 0.2,
                          px: { sm: 1, md: 4.5 },
                        }}
                      >
                        {mode === 'add' ? t('Add') : t('Confirm')}
                      </Button>
                      {(mode === 'update' || mode === 'add') && (
                        <Button
                          type="button"
                          onClick={() => { resetItems(); setMode('add'); handleEditEnd(); }}
                          variant="contained"
                          color="default"
                          size="large"
                          startIcon={<Check />}
                          sx={{
                            height: 56,
                            mb: 0.2,
                            px: { sm: 1, md: 4.5 },
                            width: "auto",
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
                    <ContextualHelp helpPagesKey="DateSince" showOnMobileToo>
                      <DatePicker
                        key={i18n.language} // This forces a complete remount when locale changes
                        label={t('Since day')}
                        //value={fieldSinceDate}
                        value={new Date(fieldSinceDate)} // Convert string back to Date for DatePicker
                        //onChange={setFieldSinceDate}
                        onChange={(date) => {
                          if (date) {
                            // Convert to YYYY-MM-DD string
                            const dateString = date.toISOString().split('T')[0];
                            setFieldSinceDate(dateString);
                          }
                        }}
                        format={getLanguageBasedFormatDDMMM(i18n.language)}
                        sx={{ width: 132 }}
                        PopperProps={{ placement: 'bottom-start' }}
                        //minDate={today()} // Today onwards: only dates in the future
                        minDate={new Date(`${config.ui.jobs.requestsScheduled.minimumYear}-01-01`)}
                        formatDensity="spacious"
                        inputRef={fieldSinceDateRef}
                      />
                    </ContextualHelp>

                    {/* Frequency input */}
                    <ContextualHelp helpPagesKey="Frequency" showOnMobileToo>
                      <TextField
                        label={t('Freq.')}
                        variant="outlined"
                        type="number"
                        value={fieldFrequency}
                        onChange={(e) => {
                          const val = e.target.value;
                          // allow empty string or numeric strings only
                          if (val === "" || /^[0-9\b]+$/.test(val)) {
                            //setFieldFrequency(val);
                            setFieldFrequency(val === "" ? "" : parseInt(val, 10));
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
                      onClick={addItem}
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={mode === 'add' ? <Add /> : <Check />}
                      disabled={!fieldMedicine} /* enable only when something is present in fieldMedicine, for a better UI clarity */
                      sx={{
                        height: 36,
                        px: 0,
                        width: mode === 'update' ? '100%' : 'auto',
                        flexGrow: mode === 'update' ? 0 : 1,
                      }}
                    >
                      {mode === 'add' ? t('Add') : t('Update')}
                    </Button>
                    {(mode === 'update' || mode === 'add') && (
                      <Button
                        type="button"
                        onClick={() => { resetItems(); setMode('add'); handleEditEnd(); }}
                        variant="contained"
                        color="default"
                        //size="large"
                        sx={{
                          height: 36,
                          px: 0,
                          width: 'auto',
                        }}
                      >
                        {t('Cancel')}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </StyledPaper>
      </Container>
    </LocalizationProvider>
  );
};

export default React.memo(JobMedicines);
