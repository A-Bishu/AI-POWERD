import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
    <Box>
      <Link href="https://facebook.com" target="_blank" rel="noopener">Facebook</Link>
      <Link href="https://twitter.com" target="_blank" rel="noopener" sx={{ mx: 2 }}>Twitter</Link>
      <Link href="https://instagram.com" target="_blank" rel="noopener">Instagram</Link>
    </Box>
    <Box sx={{ mt: 1 }}>
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/terms-of-service" sx={{ mx: 2 }}>Terms of Service</Link>
    </Box>
    <Typography variant="body2" color="textSecondary">© 2024 Company Name</Typography>
  </Box>
);

export default Footer;
