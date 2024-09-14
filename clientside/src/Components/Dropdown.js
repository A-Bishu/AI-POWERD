import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const Dropdown = ({ label, options, onChange, value, icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default Dropdown;
