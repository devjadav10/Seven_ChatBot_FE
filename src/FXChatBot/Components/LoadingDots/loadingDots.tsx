import { Box, Typography } from '@mui/material';

import React from 'react';
import { keyframes } from '@emotion/react';

const dotBounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.5);
  }
  60% {
    transform: scale(1.5);
  }
`;
 
const Dot = ({ delay }) => (
  <Box
    sx={{
      display: 'inline-block',
      width: '8px',
      height: '8px',
      margin: '0 2px',
      borderRadius: '50%',
      backgroundColor: 'grey',
      animation: `${dotBounce} 1.4s infinite ease-in-out`,
      animationDelay: delay,
    }}
  />
);
 
const LoadingDots = () => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography sx={{ marginRight: '8px' }}>Sending</Typography>
    <Dot delay="0s" />
    <Dot delay="0.2s" />
    <Dot delay="0.4s" />
  </Box>
);
 
export default LoadingDots;