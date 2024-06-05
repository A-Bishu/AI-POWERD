import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Dropdown from '../Components/Dropdown';
import Button from '../Components/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('');

  const sportsOptions = [
    { value: 'soccer', label: 'Soccer' },
    { value: 'nfl', label: 'NFL' },
    { value: 'basketball', label: 'Basketball' },
  ];

  const handleSportSelect = (event) => {
    setSelectedSport(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedSport) {
      navigate(`/competition-selection?sport=${selectedSport}`);
    } else {
      alert('Please select a sport.');
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Our Prediction App!
          </Typography>
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Dropdown
                label="Select a sport"
                options={sportsOptions}
                onChange={handleSportSelect}
                value={selectedSport}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button text="Submit" onClick={handleSubmit} fullWidth />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
