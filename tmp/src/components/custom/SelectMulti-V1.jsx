import React, { useState, useMemo } from 'react';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectMulti = ({ users, selectedUsers, setSelectedUsers, sx }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  // Handle null/undefined arrays and map to generic items
  const items = useMemo(() => users || [], [users]);
  const selectedItems = useMemo(() => selectedUsers || [], [selectedUsers]);

  // Filter items based on search term - search in firstName, lastName, businessName, email
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return items.filter(item =>
      (item.firstName && item.firstName.toLowerCase().includes(lowercasedSearch)) ||
      (item.lastName && item.lastName.toLowerCase().includes(lowercasedSearch)) ||
      (item.businessName && item.businessName.toLowerCase().includes(lowercasedSearch)) ||
      (item.email && item.email.toLowerCase().includes(lowercasedSearch)) ||
      (item.fiscalCode && item.fiscalCode.toLowerCase().includes(lowercasedSearch))
    );
  }, [items, searchTerm]);

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      // If all filtered items are already selected, unselect all filtered items
      const remainingItems = selectedItems.filter(
        selectedItem => !filteredItems.some(item => item._id === selectedItem._id)
      );
      setSelectedUsers(remainingItems);
    } else {
      // Select all filtered items that aren't already selected
      const newSelectedItems = [...selectedItems];
      filteredItems.forEach(item => {
        if (!newSelectedItems.some(selected => selected._id === item._id)) {
          newSelectedItems.push(item);
        }
      });
      setSelectedUsers(newSelectedItems);
    }
  };

  const handleUnselectAll = () => {
    if (searchTerm) {
      // Only unselect filtered items when searching
      const remainingItems = selectedItems.filter(
        selectedItem => !filteredItems.some(item => item._id === selectedItem._id)
      );
      setSelectedUsers(remainingItems);
    } else {
      // Unselect all
      setSelectedUsers([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    
    // Handle select all
    if (value.includes('select-all')) {
      handleSelectAll();
      return;
    }
    
    // Handle unselect all
    if (value.includes('unselect-all')) {
      handleUnselectAll();
      return;
    }

    // Handle regular selection/deselection
    const selectedIds = new Set(value);
    const newSelectedItems = items.filter(item => selectedIds.has(item._id));
    setSelectedUsers(newSelectedItems);
  };

  // const handleDeleteChip = (itemToDelete) => {
  //   const newSelectedItems = selectedItems.filter(item => item._id !== itemToDelete._id);
  //   setSelectedUsers(newSelectedItems);
  // };

  const getSelectedItemIds = () => {
    return selectedItems.map(item => item._id);
  };

  const isAllFilteredSelected = filteredItems.length > 0 && 
    filteredItems.every(item => 
      selectedItems.some(selected => selected._id === item._id)
    );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Get display name for an item
  const getItemDisplayName = (item) => {
    if (item.businessName) return item.businessName;
    if (item.firstName && item.lastName) return `${item.firstName} ${item.lastName}`;
    if (item.firstName) return item.firstName;
    if (item.email) return item.email;
    return 'Unknown Item';
  };

  // Get secondary text for an item
  const getItemSecondaryText = (item) => {
    const parts = [];
    if (item.firstName || item.lastName) {
      parts.push(`${item.firstName || ''} ${item.lastName || ''}`.trim());
    }
    if (item.email) {
      parts.push(item.email);
    }
    return parts.join(' • ');
  };

  // Render value with count display when multiple items are selected
  const renderValue = () => {
    if (selectedItems.length === 0) {
      return <em>Select items...</em>;
    }

    if (selectedItems.length === 1) {
      return getItemDisplayName(selectedItems[0]);
    }

    // Show count when multiple items are selected
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={`${selectedItems.length} selected`}
          size="small"
          onDelete={() => setSelectedUsers([])}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        />
      </Box>
    );
  };

  // Generate unique keys for special menu items
  //const selectAllKey = `select-all-${searchTerm}-${filteredItems.length}`;
  //const unselectAllKey = `unselect-all-${selectedItems.length}`;
  const resultsCountKey = `results-count-${filteredItems.length}-${searchTerm}`;
  const noResultsKey = `no-results-${searchTerm}-${filteredItems.length}`;

  return (
    <FormControl sx={sx}>
      <InputLabel id="multi-select-label">Select Items</InputLabel>
      <Select
        labelId="multi-select-label"
        multiple
        value={getSelectedItemIds()}
        onChange={handleChange}
        input={<OutlinedInput label="Select Items" />}
        renderValue={renderValue}
        MenuProps={MenuProps}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false);
          setSearchTerm(''); // Clear search when closing
        }}
        sx={{
          '& .MuiSelect-select': {
            minHeight: '40px !important',
            height: 'auto !important',
            display: 'flex',
            alignItems: 'center',
          }
        }}
      >
        {/* Search Box */}
        <Box sx={{ p: 1 }} key="search-box">
          <TextField
            size="small"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                ),
              },
            }}
            fullWidth
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>

        <Divider key="divider-1" />

        {/* Select All / Unselect All Buttons */}
        <Box sx={{ p: 1 }} key="action-buttons">
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button
              size="small"
              onClick={handleSelectAll}
              disabled={filteredItems.length === 0}
            >
              {isAllFilteredSelected ? 'Unselect All' : 'Select All'}
            </Button>
            <Button
              size="small"
              onClick={handleUnselectAll}
              disabled={selectedItems.length === 0}
            >
              Clear All
            </Button>
          </Stack>
        </Box>

        <Divider key="divider-2" />

        {/* Results Count */}
        <MenuItem disabled key={resultsCountKey}>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? `Found ${filteredItems.length} of ${items.length} items` 
              : `Total ${items.length} items`
            }
          </Typography>
        </MenuItem>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <MenuItem disabled key={noResultsKey}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'No items found' : 'No items available'}
            </Typography>
          </MenuItem>
        ) : (
          filteredItems.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              <Checkbox checked={selectedItems.some(selected => selected._id === item._id)} />
              <ListItemText 
                primary={getItemDisplayName(item)} 
                secondary={getItemSecondaryText(item)} 
              />
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectMulti);
