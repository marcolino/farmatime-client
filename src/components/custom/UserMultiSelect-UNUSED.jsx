import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const UserMultiSelect = ({ users = [], value: propValue = [], onChange, sx = {}, label = "Select Users" }) => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // Make sure value only contains objects from users array (by _id)
    const matched = propValue
      .map((v) => users.find((u) => u._id === v._id))
      .filter(Boolean);

    if (matched.length === 0 && users.length > 0) {
      // Default: all users selected
      setValue(users);
      onChange?.(users);
    } else {
      setValue(matched);
    }
  }, [users, propValue, onChange]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Autocomplete
      multiple
      options={users}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
        onChange?.(newValue);
      }}
      isOptionEqualToValue={(option, val) => option._id === val._id} // MATCH BY _id
      getOptionLabel={(user) => `${user.firstName} ${user.lastName} ${user.email}`}
      disableCloseOnSelect
      filterSelectedOptions
      sx={{
        ...sx,
        "& .MuiAutocomplete-inputRoot": {
          minHeight: 40,
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} sx={{ mr: 1 }} />
          {option.firstName} {option.lastName} ({option.email})
        </li>
      )}
      renderInput={(params) => <TextField {...params} label={label} />}
      limitTags={1}
      getLimitTagsText={(more) => `${value.length} selected`}
    />
  );
};

export default UserMultiSelect;
