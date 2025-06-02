import { useState } from 'react';
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
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { enUS, it, fr, de, es } from 'date-fns/locale';
import { SortableItem } from './SortableItem';
import { MedicineInputAutocomplete } from './MedicineInputAutocomplete';

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
  //background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
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

export const MedicineList = ({ locale = 'en' }) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState([]);
  
  const resetItems = () => {
    setName('');
    setFrequency(1);
    setDate(new Date());
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addItem = (e) => {
    e.preventDefault();
    const nameTrimmed = name.label.trim()
    if (!nameTrimmed) {
      alert("Please enter a medicine name.");
      return;
    } 
    if (!(frequency > 0)) {
      alert("Please enter a valid frequency in days.");
      return;
    }
    const id = items.length; 
    setItems([...items, { 
      id: `item-${id}`, 
      name: nameTrimmed,
      frequency,
      date
    }]);
    resetItems();
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
    alert(`List confirmed with ${items.length} items.`);
  };

  const formatDate = (date) => {
    //alert(locale);
    return format(date, getLocaleBasedFormat(), { locale: localeMap[locale] });
  };

  const getLocaleBasedFormat = () => {
    const locale = navigator.language || 'en-US';

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
    return 'MMM dd';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[locale]}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledPaper>
          <Header>
            <Typography variant="h3" fontWeight="bold">
              Medicines List
            </Typography>
            <Typography variant="subtitle1" fontWeight="light">
              Add to the list medicines names, first request date, and frequency of requests in days
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
              {/* <TextField
                fullWidth
                label="Medicine name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name of the medicine"
                autoFocus
              /> */}
              <MedicineInputAutocomplete
                fullWidth
                variant="outlined"
                value={name}
                //onChange={(e) => setName(e.target.value)}
                onChange={(event, newValue) => setName(newValue)}
                placeholder="Enter full name of the medicine"
                autoFocus
              />

              <DatePicker
                label="Since day"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                format={getLocaleBasedFormat()}
                sx={{ width: 240 }}
                PopperProps={{
                  placement: 'bottom-start',
                }}
              />
              
              <TextField
                label="Frequency (days)"
                variant="outlined"
                type="number"
                input={{ min: 1 }}
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
                sx={{ width: 240 }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ height: 56 }}
              >
                Add
              </Button>
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
                              name={item.name}
                              frequency={item.frequency}
                              date={item.date}
                              onRemove={removeItem}
                              formatDate={formatDate}
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
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={confirmList}
                    sx={{ 
                      //height: 56,
                      //fontSize: '50px',
                      minWidth: '200px'
                    }}
                  >
                    Confirm
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
