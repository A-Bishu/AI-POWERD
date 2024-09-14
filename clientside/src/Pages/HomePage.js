import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, Typography, Grid, Button, Paper, CircularProgress } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

import soccerBackground from '../Assets/soccer-background.jpg';
import nflBackground from '../Assets/nfl-background.jpg';
import basketballBackground from '../Assets/basketball-background.jpg';
import defaultBackground from '../Assets/sports-background.jpg'; // Fallback background

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('');
  const [loading, setLoading] = useState(false);

  const sportsOptions = [
    { value: 'soccer', label: 'SOCCER', background: soccerBackground },
    { value: 'nfl', label: 'NFL', background: nflBackground },
    { value: 'basketball', label: 'BASKETBALL', background: basketballBackground },
  ];

  const getBackgroundImage = () => {
    switch (selectedSport) {
      case 'soccer':
        return soccerBackground;
      case 'nfl':
        return nflBackground;
      case 'basketball':
        return basketballBackground;
      default:
        return defaultBackground;
    }
  };

  const handleSportSelect = (value) => {
    setSelectedSport(value);
    setLoading(true);
    // Navigate based on the selected sport value
    setTimeout(() => {
      setLoading(false);
      switch (value) {
        case 'soccer':
          navigate(`/competition-selection?sport=${value}`);
          break;
        case 'nfl':
          navigate(`/nfl/competition-selection?sport=${value}`);
          break;
        case 'basketball':
          navigate(`/basketball/competition-selection?sport=${value}`);
          break;
        default:
          alert('This sport is not yet supported.');
          break;
      }
    }, 1000); // Simulate loading time
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getBackgroundImage()}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={6} sx={{ py: 6, px: 4, textAlign: 'center', backgroundImage: 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)'  }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: '#fff', 
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
                mb: 2
              }}
            >
              Welcome To MatchsMaster!
            </Typography>
            <Paper
              elevation={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                borderRadius: '50px', // Creates an oval shape
                border: '4px solid #3a1c71', // Bold border with a color of your choice
                backgroundColor: 'purple', // Light background to make text stand out
                maxWidth: '650px', // Limits the width of the oval shape
                margin: '0 auto', // Centers the box horizontally
                mt: 4, // Margin top for spacing
                mb: 4, // Margin bottom for spacing
                textAlign: 'center', // Center the text inside the oval
              }}
            >
              <Typography 
                variant="subtitle1" 
                component="h2" 
                sx={{ 
                  color: '#f0f0f0', 
                  lineHeight: 1.6, 
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', 
                  fontSize: '1.2rem'
                }}
              >
                Our Sports Prediction & Analysis App provides detailed predictions and analysis for various sport matches. 
                Whether you're a fan of Soccer, NFL, or Basketball, our app leverages advanced algorithms and data analysis 
                to give you insights into upcoming games. Explore team statistics, key player impacts, and game predictions 
                to enhance your sports knowledge and betting strategies.
              </Typography>
            </Paper>

            <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
              Select Your Sport
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {sportsOptions.map((option) => (
                <Grid item xs={12} sm={6} md={4} key={option.value}>
                  <Paper
                    elevation={3}
                    onClick={() => handleSportSelect(option.value)}
                    sx={{
                      height: '200px',
                      padding: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${option.background}) center center / cover no-repeat`,
                      color:  '#fff',
                      border: selectedSport === option.value ? '2px solid #3f51b5' : '2px solid transparent',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                    aria-label={`Select ${option.label}`}
                  >
                    <Typography variant="h4" component="p">
                      {loading && selectedSport === option.value ? <CircularProgress size={24} color="inherit" /> : option.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
              
            <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
              <Grid item>
                <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
                  Try For Free
                </Typography>
                <Paper
                  elevation={6}
                  sx={{
                    padding: '16px', // Add padding for spacing inside the paper
                    backgroundColor: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Vibrant gradient background
                    borderRadius: '12px', // Rounded corners
                    textAlign: 'center', // Center align the content
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button 
                    component={Link} 
                    to="/same-date-matches" 
                    variant="contained" 
                    color="primary"
                    sx={{
                      bgcolor: '#fff', // Button color to contrast with the vibrant background
                      color: '#3a1c71', // Text color inside the button
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#f0f0f0', // Hover effect for the button
                      },
                    }}
                  >
                    Featured Matchs
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
