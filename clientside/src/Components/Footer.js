import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => (
  
    
   
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        textAlign: 'center',
        bgcolor: 'transparent', // To match the AppBar background
        backgroundImage: 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
      }}
    >
      <Box sx={{ mb: 1 }}>
        <IconButton href="https://facebook.com" target="_blank" rel="noopener" sx={{ color: '#3b5998' }}>
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" rel="noopener" sx={{ color: '#1DA1F2', mx: 1 }}>
          <TwitterIcon />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" rel="noopener" sx={{ color: '#E1306C' }}>
          <InstagramIcon />
        </IconButton>
        <IconButton href="https://tiktok.com" target="_blank" rel="noopener" sx={{ color: '#000000', mx: 1 }}>
          <FaTiktok />
        </IconButton>
      </Box>
      <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Link href="/privacy-policy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" color="inherit" underline="hover">
          Terms of Service
        </Link>
      </Box>
      <Typography variant="body2" color="inherit">
        © 2024 Company Name. All rights reserved.
      </Typography>
    </Box>
  
    );

export default Footer;
