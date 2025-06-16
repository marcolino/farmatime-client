//import React from 'react';
import { Box as _Box, Typography } from '@mui/material';

export function Box({ label, children, ...rest }) {
  return (
    <_Box {...rest}>
      {label && <Typography variant="subtitle2">{label}</Typography>}
      {children}
    </_Box>
  );
}