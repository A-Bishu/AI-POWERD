import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ text, onClick }) => (
  <MuiButton variant="contained" color="primary" onClick={onClick}>
    {text}
  </MuiButton>
);

export default Button;
