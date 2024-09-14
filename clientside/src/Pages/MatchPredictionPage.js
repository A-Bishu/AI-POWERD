import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, CircularProgress, Button, Paper, Alert } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import backgroundImage from '../Assets/sports-background.jpg';

const MatchPredictionPage = () => {
  const location = useLocation();
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('https://www.matchsmaster.com');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrediction = async () => {
      const matchId = new URLSearchParams(location.search).get('match');
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      if (!matchId) {
        setError('Match ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${baseUrl}/predict-match-outcome/${matchId}`);
        setPrediction(response.data);
        setShareUrl('https://www.matchsmaster.com');
      } catch (error) {
        console.error('Error fetching prediction:', error);
        setError('Failed to fetch prediction.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [location.search]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(prediction)
      
      .catch((err) => {
        console.error('Failed to copy prediction:', err);
      });
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          background: `url(${backgroundImage}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: 3,
            }}
          >
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={10} md={8} lg={6}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                  Match Analysis & Prediction
                </Typography>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                    <Typography variant="body1" component="p" sx={{ ml: 2 }}>
                      Loading...
                    </Typography>
                  </Box>
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : (
                  <Paper elevation={3} sx={{ p: 3, mt: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                      {prediction}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button variant="contained" color="primary" onClick={handleCopyText}>
                        Copy Prediction Text
                      </Button>
                    </Box>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <FacebookShareButton url={shareUrl} quote={prediction}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={shareUrl} title={prediction}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <WhatsappShareButton url={shareUrl} title={prediction}>
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MatchPredictionPage;
