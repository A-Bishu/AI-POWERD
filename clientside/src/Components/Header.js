import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../Assets/SportifyAI.jpg'; // Assuming the sports background image is used as a logo

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSportSelect = (sport) => {
    navigate(`/competition-selection?sport=${sport}`);
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundImage:
          'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
        zIndex: 1300, // Ensures it stays above other content
      }}
    >
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            marginRight: 2,
          }}
        >
          <Box
            component="img"
            sx={{
              height: 64, // Adjust the height as needed
              borderRadius: '50%', // Makes the image circular
            }}
            alt="Logo"
            src={logo}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: '#ffffffaa', // Using a semi-transparent white background
            borderRadius: '50px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            marginRight: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
            SportifyAI
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Button
            sx={{ color: '#000', fontWeight: 'bold' }}
            component={RouterLink}
            to="/"
          >
            Home
          </Button>
          <Button
            sx={{ color: '#000', fontWeight: 'bold' }}
            onClick={() => handleSportSelect('soccer')}
          >
            Competitions
          </Button>
          <Button
            sx={{ color: '#000', fontWeight: 'bold' }}
            component={RouterLink}
            to="/login"
          >
            Login
          </Button>
          <Button
            sx={{ color: '#000', fontWeight: 'bold' }}
            component={RouterLink}
            to="/register"
          >
            Register
          </Button>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={handleMenuClose}
              component={RouterLink}
              to="/"
            >
              Home
            </MenuItem>
            <MenuItem onClick={() => handleSportSelect('soccer')}>
              Competitions
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={RouterLink}
              to="/login"
            >
              Login
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={RouterLink}
              to="/register"
            >
              Register
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
