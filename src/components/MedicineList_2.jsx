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
  useTheme,
  styled,
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
import { dataAnagrafica, dataPrincipiAttivi, dataATC } from '../data/AIFA';
import { i18n } from '../i18n';

const localeMap = { en: enUS, it, fr, de, es };

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
  maxHeight: 500,
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
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

  const [option, setOption] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('add');
  const [editingItemId, setEditingItemId] = useState(null);
  const [fieldToFocus, setFieldToFocus] = useState(null);

  const nameRef = useRef();
  const frequencyRef = useRef();
  const dateRef = useRef();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const focusMap = { name: nameRef, frequency: frequencyRef, date: dateRef };
    if (fieldToFocus && focusMap[fieldToFocus]?.current) {
      focusMap[fieldToFocus].current.focus();
    }
  }, [fieldToFocus]);

  const options = useMemo(() => {
    const unify = (type, data) => data.map(entry => ({
      id: `${type}_${entry.id || entry.code}`,
      label: type === 'atc' ? `${entry.code} - ${entry.description}` : `${entry.name}${entry.form ? ' • ' + entry.form : ''}`,
      type,
      data: entry,
      searchTerms: [entry.name?.toLowerCase(), entry.code?.toLowerCase(), entry.description?.toLowerCase()].filter(Boolean),
    }));

    return [
      ...unify('medicine', dataAnagrafica),
      ...unify('ingredient', dataPrincipiAttivi),
      ...unify('atc', dataATC),
    ];
  }, []);

  const getFilteredOptions = (inputVal) => {
    if (!inputVal) return [];
    const query = inputVal.toLowerCase();
    const matchScore = (terms) => terms.reduce((score, term) => score + (term.startsWith(query) ? 2 : term.includes(query) ? 1 : 0), 0);
    const sorted = (type) => options.filter(o => o.type === type && o.searchTerms.some(term => term.includes(query))).sort((a, b) => matchScore(b.searchTerms) - matchScore(a.searchTerms));

    return [...sorted('medicine').slice(0, 8), ...sorted('ingredient').slice(0, 7), ...sorted('atc').slice(0, 5)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || frequency < 1) return;

    const selected = option || { label: trimmed, id: `manual_${Date.now()}` };
    if (mode === 'add' && items.some(i => i.id === selected.id)) return; // TODO: warn user?
    //if (mode === 'add' && items.some(i => i.name.toLowerCase() === selected.label.toLowerCase())) return; // TODO: warn user? - THIS SHOULD BE OVERKILL... IF ID's differ, NAME differ for sure...
    const newItem = { id: selected.id, name: selected.label, frequency, date, option: selected };

    setItems(mode === 'add' ? [...items, newItem] : items.map(i => i.id === editingItemId ? newItem : i));
    resetForm();
  };

  const resetForm = () => {
    setOption(null);
    setInputValue('');
    setFrequency(1);
    setDate(new Date());
    setMode('add');
    setEditingItemId(null);
  };

  const startEdit = (id, field) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    setEditingItemId(id);
    setMode('update');
    setOption(item.option);
    setInputValue(item.name);
    setFrequency(item.frequency);
    setDate(new Date(item.date));
    setFieldToFocus(field);
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIdx = items.findIndex(i => i.id === active.id);
      const newIdx = items.findIndex(i => i.id === over?.id);
      setItems(arrayMove(items, oldIdx, newIdx));
    }
  };

  const locale = i18n.language;
  const formatDate = (d) => format(d, locale.startsWith('en-US') ? 'MMM dd' : 'dd MMM', { locale: localeMap[locale] });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[locale]}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledPaper>
          <Header>
            <Typography variant="h3" fontWeight="bold">{t('Medicines List')}</Typography>
            <Typography variant="subtitle2">{t('Add to the list medicines names, first request date, and frequency of requests in days')}</Typography>
          </Header>

          <Box p={4} component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <ContextualHelp helpPagesKey="MedicineName" fullWidth showOnHover>
              <MedicineInputAutocomplete
                autoFocus fullWidth variant="outlined"
                value={option} inputValue={inputValue}
                onChange={(_, val) => { setOption(val); setInputValue(val?.label || ''); }}
                onInputChange={(_, val, reason) => { if (reason === 'input' || reason === 'clear') setInputValue(val); }}
                options={getFilteredOptions(inputValue)}
                placeholder={t('Enter full name of the medicine')}
                ref={nameRef}
              />
            </ContextualHelp>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: 2, alignItems: 'flex-end' }}>
              <ContextualHelp helpPagesKey="DateSince">
                <DatePicker
                  label={t('Since day')} value={date} onChange={setDate} format={formatDate(date)}
                  sx={{ width: isXs ? 145 : isSm ? 125 : 145 }} inputRef={dateRef}
                />
              </ContextualHelp>

              <ContextualHelp helpPagesKey="Frequency">
                <TextField
                  label={t('Frequency (days)')} type="number" variant="outlined"
                  value={frequency} onChange={(e) => setFrequency(Number(e.target.value) || 1)}
                  sx={{ width: isXs ? 145 : isSm ? 65 : 145 }} inputRef={frequencyRef}
                />
              </ContextualHelp>

              <Button type="submit" variant="contained" size="large" sx={{ height: 56 }}>{mode === 'add' ? t('Add') : t('Update')}</Button>
              {mode === 'update' && (
                <Button variant="outlined" color="inherit" onClick={resetForm} size="large" sx={{ height: 56 }}>{t('Cancel')}</Button>
              )}
            </Box>
          </Box>

          <ItemContainer>
            <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {items.map(item => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    formatDate={formatDate}
                    editingItemId={editingItemId}
                    startEdit={startEdit}
                    setItems={setItems}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </ItemContainer>

          <Box textAlign="right" px={4} pb={4}>
            <Button variant="contained" onClick={() => alert(t('List confirmed with {{count}} items.', { count: items.length }))}>{t('Confirm')}</Button>
          </Box>
        </StyledPaper>
      </Container>
    </LocalizationProvider>
  );
};
