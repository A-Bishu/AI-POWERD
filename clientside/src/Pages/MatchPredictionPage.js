
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import debounce from 'lodash.debounce';

const MatchPredictionPage = () => {
  const location = useLocation();
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    const fetchPrediction = debounce(async () => {
      const matchId = new URLSearchParams(location.search).get('match');
      console.log('Fetching prediction for matchId:', matchId); // Debugging log
      try {
        const response = await axios.get(`http://localhost:3003/predict-match-outcome/${matchId}`);
        console.log('Prediction response:', response.data); // Debugging log
        setPrediction(response.data);
      } catch (error) {
        console.error('Error fetching prediction:', error);
        setPrediction('Failed to fetch prediction.');
      }
    }, 300); // Adjust the debounce delay as needed

    fetchPrediction();

    return () => {
      fetchPrediction.cancel();
    };
  }, [location.search]);

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ my: 4 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Match Prediction
              </Typography>
              <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {prediction}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default MatchPredictionPage;
