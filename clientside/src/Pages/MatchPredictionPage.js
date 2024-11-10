import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import backgroundImage from '../Assets/sports-background.jpg';

const SectionPaper = ({ children, backgroundColor }) => (
  <Paper elevation={3} sx={{ p: 3, backgroundColor, borderRadius: '10px', padding: '10px' }}>
    {children}
  </Paper>
);

const MatchPredictionPage = () => {
  const location = useLocation();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('https://www.sportiifyai.com');
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
        const predictionData = response.data;

        // Since the response is now structured JSON, we can set it directly
        setPrediction(predictionData);
        setShareUrl(window.location.href);
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
    if (prediction) {
      const predictionText = JSON.stringify(prediction, null, 2);
      navigator.clipboard.writeText(predictionText).catch((err) => {
        console.error('Failed to copy prediction:', err);
      });
    }
  };


  const gridBackgroundStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    padding: '10px',
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
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
              Match Analysis & Prediction
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={gridBackgroundStyle} aria-live="polite">
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Loading...</Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={gridBackgroundStyle}>{error}</Alert>
            ) : (
              prediction && (
                <Grid container spacing={4} sx={{ ...gridBackgroundStyle, backgroundColor: 'black', padding: '20px' }}>
                  
                  {/* Expected Outcome */}
                  {prediction?.expectedOutcome && (
                    <Grid item xs={12} sx={gridBackgroundStyle}>
                      <SectionPaper backgroundColor="#e0f7fa">
                        <Typography variant="h5">Expected Outcome</Typography>
                        <Typography variant="body1">
                          <strong>Goals:</strong> {prediction?.homeTeam} - {prediction?.expectedOutcome?.goals?.home ?? 'N/A'}, {prediction?.awayTeam} - {prediction?.expectedOutcome?.goals?.away ?? 'N/A'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Corners:</strong> Home - {prediction?.expectedOutcome?.corners?.home ?? 'N/A'}, Away - {prediction?.expectedOutcome?.corners?.away ?? 'N/A'}
                        </Typography>
                      </SectionPaper>
                    </Grid>
                  )}


                  {/* Key Players */}
                  {prediction.keyPlayers && (
                    <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#dcedc8' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                              Key Players
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="h6">Home Team</Typography>
                            {prediction.keyPlayers.home.length > 0 ? (
                              <List>
                                {prediction.keyPlayers.home.map((player, index) => (
                                  <ListItem key={index}>
                                    <ListItemText
                                      primary={player.name}
                                      secondary={`Shots: ${player.shots}, Shots on Target: ${player.shotsOnTarget}, Assists: ${player.assists}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography>No key players data available for home team.</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="h6">Away Team</Typography>
                            {prediction.keyPlayers.away.length > 0 ? (
                              <List>
                                {prediction.keyPlayers.away.map((player, index) => (
                                  <ListItem key={index}>
                                    <ListItemText
                                      primary={player.name}
                                      secondary={`Shots: ${player.shots}, Shots on Target: ${player.shotsOnTarget}, Assists: ${player.assists}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography>No key players data available for away team.</Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Same Game Parlay Suggestions */}
                  {prediction.sameGameParlaySuggestions && (
                    <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffe0b2' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                              Same Game Parlay Suggestions
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            {prediction.sameGameParlaySuggestions.length > 0 ? (
                              <List>
                                {prediction.sameGameParlaySuggestions.map((suggestion, index) => (
                                  <ListItem key={index}>
                                    <ListItemText primary={suggestion} />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography>No parlay suggestions available.</Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Additional Predictions */}
                  {prediction.additionalPredictions && (
                    <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fff9c4' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                              Additional Predictions
                            </Typography>
                          </Grid>
                          {prediction.additionalPredictions.totalGoalsOverUnder && (
                            <>
                              <Grid item xs={12}>
                                <Typography variant="body1">
                                  <strong>Total Goals Over/Under:</strong>
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  First Half: {prediction.additionalPredictions.totalGoalsOverUnder.firstHalf ?? 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  Second Half: {prediction.additionalPredictions.totalGoalsOverUnder.secondHalf ?? 'N/A'}
                                </Typography>
                              </Grid>
                            </>
                          )}
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>Most Probable Single Bet Outcome:</strong>{' '}
                              {prediction.additionalPredictions.mostProbableSingleBetOutcome ?? 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Analysis */}
                  {prediction.analysis && (
                    <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f8bbd0' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                              Analysis
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {prediction.analysis}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Key Factors */}
                  {prediction.keyFactors && (
                    <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#c8e6c9' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                              Key Factors
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            {prediction.keyFactors.length > 0 ? (
                              <List>
                                {prediction.keyFactors.map((factor, index) => (
                                  <ListItem key={index}>
                                    <ListItemText primary={factor} />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography>No key factors available.</Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Betting Tips */}
                  {prediction.bettingTips && (
                    <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#d1c4e9'}}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                              Betting Tips
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            {prediction.bettingTips.length > 0 ? (
                              <List>
                                {prediction.bettingTips.map((tip, index) => (
                                  <ListItem key={index}>
                                    <ListItemText primary={tip} />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography>No betting tips available.</Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Share and Copy Buttons */}
                  <Grid item xs={12} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '10px' }}>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCopyText}
                        sx={{ mr: 2 }}
                      >
                        Copy Prediction JSON
                      </Button>
                      <FacebookShareButton
                        url={shareUrl}
                        quote="Check out this match prediction!"
                        aria-label="Share on Facebook"
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={shareUrl}
                        title="Check out this match prediction!"
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        url={shareUrl}
                        title="Check out this match prediction!"
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </Box>
                  </Grid>
                </Grid>
              )
            )}
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MatchPredictionPage;
