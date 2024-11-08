// src/Pages/PredictionList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoSection from '../Components/VideoSection';
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  List,
  ListItem,
  ListItemText,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const PredictionList = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering and sorting state
  const [dateFilter, setDateFilter] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BACKEND_URL ;
      try {
        const response = await axios.get(`${baseUrl}/match-predictions`, {
          params: {
            page,
            limit: 10,
            date: dateFilter,
            league: leagueFilter,
            team: teamFilter,
            sort: sortOption,
          },
        });

        setPredictions(response.data.predictions);
        setTotalPages(response.data.totalPages);
        setError('');
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setError('Failed to fetch predictions.');
        setPredictions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [page, dateFilter, leagueFilter, teamFilter, sortOption]);

  const handleOpenModal = (prediction) => {
    setSelectedPrediction(prediction);
    setOpen(true);
  };

  const handleCloseModal = () => {
    // Stop speech synthesis when closing the modal
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setOpen(false);
    setSelectedPrediction(null);
  };

  const handleOpenVideoModal = (prediction) => {
    setSelectedPrediction(prediction);
    setVideoOpen(true);
  };

  const handleCloseVideoModal = () => {
    setVideoOpen(false);
    setSelectedPrediction(null);
  };

  const handleSpeakPrediction = () => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support speech synthesis.');
      return;
    }

    if (selectedPrediction && selectedPrediction.prediction) {
      const text = generatePredictionText(selectedPrediction);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;

      // Optional event handlers
      utterance.onstart = () => {
        console.log('Speech synthesis started');
      };

      utterance.onend = () => {
        console.log('Speech synthesis ended');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const generatePredictionText = (prediction) => {
    let text = `${prediction.homeTeam} versus ${prediction.awayTeam} on ${dayjs(
      prediction.matchDate
    ).format('YYYY-MM-DD HH:mm')}. `;

    if (prediction.prediction.expectedOutcome) {
      const eo = prediction.prediction.expectedOutcome;
      text += `Expected Outcome: Goals - ${prediction.homeTeam} ${
        eo.goals.home ?? 'N/A'
      }, ${prediction.awayTeam} ${eo.goals.away ?? 'N/A'}. `;
      text += `Corners - ${prediction.homeTeam} ${
        eo.corners.home ?? 'N/A'
      }, ${prediction.awayTeam} ${eo.corners.away ?? 'N/A'}. `;
    }

    if (prediction.prediction.analysis) {
      text += `Analysis: ${prediction.prediction.analysis}. `;
    }

    if (prediction.prediction.keyFactors && prediction.prediction.keyFactors.length > 0) {
      text += `Key Factors: ${prediction.prediction.keyFactors.join('. ')}. `;
    }

    if (prediction.prediction.bettingTips && prediction.prediction.bettingTips.length > 0) {
      text += `Betting Tips: ${prediction.prediction.bettingTips.join('. ')}. `;
    }

    if (
      prediction.prediction.sameGameParlaySuggestions &&
      prediction.prediction.sameGameParlaySuggestions.length > 0
    ) {
      text += `Same Game Parlay Suggestions: ${prediction.prediction.sameGameParlaySuggestions.join(
        '. '
      )}. `;
    }

    return text;
  };

 

  return (
    <>
      {/* Filters and Sorting */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mb={3} // Reduced margin-bottom for compactness
        sx={{ backgroundColor: 'lightblue', p: 1, borderRadius: '8px' }} // Reduced padding and border radius
      >
        {/* Date Filter */}
        <TextField
          label="Date"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 100, mr: 1, mb: 1 }} // Reduced minWidth and margin
          size="small" // Smaller input size
        />

        {/* League Filter */}
        <FormControl sx={{ minWidth: 130, mr: 1, mb: 1 }} size="small">
          <InputLabel id="league-select-label">League</InputLabel>
          <Select
            labelId="league-select-label"
            label="League"
            value={leagueFilter}
            onChange={(e) => setLeagueFilter(e.target.value)}
          >
            <MenuItem value="">All Leagues</MenuItem>
            <MenuItem value="Premier League">Premier League</MenuItem>
            <MenuItem value="LaLiga">La Liga</MenuItem>
            <MenuItem value="Bundesliga">Bundesliga</MenuItem>
            <MenuItem value="Serie A">Serie A</MenuItem>
            <MenuItem value="Ligue 1">Ligue 1</MenuItem>
            {/* Add more leagues as needed */}
          </Select>
        </FormControl>

        {/* Team Filter */}
        <TextField
          label="Team"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          sx={{ minWidth: 130, mr: 1, mb: 1 }} // Reduced minWidth and margin
          size="small" // Smaller input size
        />

        {/* Sorting */}
        <FormControl sx={{ minWidth: 130, mr: 1, mb: 1 }} size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            label="Sort By"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="league">League</MenuItem>
            <MenuItem value="team">Team</MenuItem>
            {/* Add more sort options as needed */}
          </Select>
        </FormControl>

        {/* Reset Filters Button */}
        <Button
          variant="outlined"
          onClick={() => {
            setDateFilter('');
            setLeagueFilter('');
            setTeamFilter('');
            setSortOption('date');
          }}
          sx={{ mb: 1 }} // Reduced margin-bottom
          size="small" // Smaller button size
        >
          Reset Filters
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80px" // Reduced minHeight
          sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: '8px' }} // Reduced padding and border radius
        >
          <CircularProgress size={24} /> {/* Smaller spinner */}
          <Typography variant="body2" component="p" sx={{ ml: 1, fontSize: '0.875rem' }}> {/* Smaller font */}
            Loading...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ backgroundColor: '#f8d7da', borderRadius: '8px', mb: 2 }}>
          {error}
        </Alert>
      ) : predictions.length === 0 ? (
        <Typography variant="body2" textAlign="center" sx={{ fontSize: '0.875rem' }}>
          No predictions available for the selected criteria.
        </Typography>
      ) : (
        <>
          <Grid container spacing={1}> {/* Reduced spacing */}
            {predictions.map((prediction) => (
              <Grid item xs={12} sm={6} md={4} key={prediction.mid}> {/* Adjusted Grid sizes */}
                <Paper
                  elevation={2} // Slightly reduced elevation
                  sx={{
                    p: 2, // Reduced padding
                    backgroundColor: 'lightblue', // Lighter background
                    cursor: 'pointer',
                    borderRadius: '8px', // Reduced border radius
                    transition: 'transform 0.2s', // Smooth hover effect
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Grid container spacing={1}> {/* Reduced spacing */}
                    {/* Match Details */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
                        Date: {new Date(prediction.matchDate).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold' }}>
                        Competition: {prediction.competitionName ?? 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Expected Outcome */}
                    {prediction.prediction.expectedOutcome && (
                      <Grid item xs={12}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1, // Reduced padding
                            backgroundColor: '#e0f7fa', // Light cyan background
                            borderRadius: '6px', // Reduced border radius
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                            Expected Outcome
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                            <strong>Goals:</strong> {prediction.homeTeam} {prediction.prediction.expectedOutcome.goals.home ?? 'N/A'} - {prediction.awayTeam} {prediction.prediction.expectedOutcome.goals.away ?? 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                            <strong>Corners:</strong> {prediction.homeTeam} {prediction.prediction.expectedOutcome.corners.home ?? 'N/A'}, {prediction.awayTeam} {prediction.prediction.expectedOutcome.corners.away ?? 'N/A'}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    
                    

                   {/* View Full Prediction and Play Video Buttons Side-by-Side */}
<Grid container spacing={1}>
  <Grid item xs={6}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleOpenModal(prediction)} // This opens the full prediction dialog
      fullWidth
      size="small"
      sx={{ mt: 1, fontSize: '0.75rem', py: 0.5 }}
    >
      View Full Prediction
    </Button>
  </Grid>
  
  <Grid item xs={6}>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleOpenVideoModal(prediction)} // This will open the video dialog
      fullWidth
      size="small"
      sx={{ mt: 1, fontSize: '0.75rem', py: 0.5 }}
    >
             Play Video
            </Button>
          </Grid>
        </Grid>

      </Grid>
      </Paper>
    </Grid>
  ))}
</Grid>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                size="small" // Smaller pagination
              />
            </Box>
          )}
        </>
      )}

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {selectedPrediction?.homeTeam} vs {selectedPrediction?.awayTeam}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Match Details */}
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Date: {new Date(selectedPrediction?.matchDate).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '1rem' , fontWeight: 'bold'}}>
                Competition: {selectedPrediction?.competitionName ?? 'N/A'}
              </Typography>
            </Grid>

            {/* Expected Outcome */}
            {selectedPrediction?.prediction?.expectedOutcome && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#e0f7fa', // Light cyan background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Expected Outcome
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                    <strong>Goals:</strong> {selectedPrediction?.homeTeam} {selectedPrediction?.prediction?.expectedOutcome?.goals?.home ?? 'N/A'} - {selectedPrediction?.awayTeam} {selectedPrediction?.prediction?.expectedOutcome?.goals?.away ?? 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                    <strong>Corners:</strong> {selectedPrediction?.homeTeam} {selectedPrediction?.prediction?.expectedOutcome?.corners?.home ?? 'N/A'}, {selectedPrediction?.awayTeam} {selectedPrediction?.prediction?.expectedOutcome?.corners?.away ?? 'N/A'}
                  </Typography>
                  {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.7rem', fontWeight: 'bold' }}>
                        Goals by Period:
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        <em>First Half:</em> {selectedPrediction?.homeTeam} - {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod?.firstHalf?.home ?? 'N/A'}, {selectedPrediction?.awayTeam} - {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod?.firstHalf?.away ?? 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        <em>Second Half:</em> {selectedPrediction?.homeTeam} - {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod?.secondHalf?.home ?? 'N/A'}, {selectedPrediction?.awayTeam} - {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod?.secondHalf?.away ?? 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        <em>Full Time:</em> {selectedPrediction?.homeTeam} - {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod?.fullTime?.home ?? 'N/A'}, {selectedPrediction?.awayTeam} - {selectedPrediction?.prediction?.expectedOutcome?.goalsByPeriod?.fullTime?.away ?? 'N/A'}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Same Game Parlay Suggestions */}
            {selectedPrediction?.prediction?.sameGameParlaySuggestions && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#ffe0b2', // Light orange background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Same Game Parlay Suggestions
                  </Typography>
                  {selectedPrediction.prediction.sameGameParlaySuggestions.length > 0 ? (
                    <List dense>
                      {selectedPrediction.prediction.sameGameParlaySuggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`• ${suggestion}`} sx={{ fontSize: '0.7rem' }} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                      No parlay suggestions available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Key Players */}
            {selectedPrediction?.prediction?.keyPlayers && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#dcedc8', // Light green background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Key Players
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {selectedPrediction?.homeTeam}
                      </Typography>
                      {selectedPrediction.prediction.keyPlayers.home.length > 0 ? (
                        <List dense>
                          {selectedPrediction.prediction.keyPlayers.home.map((player, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText
                                primary={player.name}
                                secondary={`Shots: ${player.shots}, Shots on Target: ${player.shotsOnTarget}, Assists: ${player.assists}`}
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                          No key players data available.
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {selectedPrediction?.awayTeam}
                      </Typography>
                      {selectedPrediction.prediction.keyPlayers.away.length > 0 ? (
                        <List dense>
                          {selectedPrediction.prediction.keyPlayers.away.map((player, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText
                                primary={player.name}
                                secondary={`Shots: ${player.shots}, Shots on Target: ${player.shotsOnTarget}, Assists: ${player.assists}`}
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                          No key players data available.
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Analysis */}
            {selectedPrediction?.prediction?.analysis && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#f8bbd0', // Light pink background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Analysis
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
                    {selectedPrediction.prediction.analysis}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {/* Key Factors */}
            {selectedPrediction?.prediction?.keyFactors && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#c8e6c9', // Light green background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Key Factors
                  </Typography>
                  {selectedPrediction.prediction.keyFactors.length > 0 ? (
                    <List dense>
                      {selectedPrediction.prediction.keyFactors.map((factor, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText primary={`• ${factor}`} sx={{ fontSize: '0.7rem' }} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                      No key factors available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Betting Tips */}
            {selectedPrediction?.prediction?.bettingTips && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#d1c4e9', // Light purple background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Betting Tips
                  </Typography>
                  {selectedPrediction.prediction.bettingTips.length > 0 ? (
                    <List dense>
                      {selectedPrediction.prediction.bettingTips.map((tip, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText primary={`• ${tip}`} sx={{ fontSize: '0.8rem', fontWeight: 'bold' }} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                      No betting tips available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Additional Predictions */}
            {selectedPrediction?.prediction?.additionalPredictions && (
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1, // Reduced padding
                    backgroundColor: '#fff9c4', // Light yellow background
                    borderRadius: '6px', // Reduced border radius
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Additional Predictions
                  </Typography>
                  {selectedPrediction.prediction.additionalPredictions.totalGoalsOverUnder && (
                    <>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        Total Goals Over/Under:
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        First Half: {selectedPrediction.prediction.additionalPredictions.totalGoalsOverUnder.firstHalf ?? 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        Second Half: {selectedPrediction.prediction.additionalPredictions.totalGoalsOverUnder.secondHalf ?? 'N/A'}
                      </Typography>
                    </>
                  )}
                  <Typography variant="body2" sx={{ mt: 1, fontSize: '0.7rem', fontWeight: 'bold' }}>
                    Most Probable Single Bet Outcome: {selectedPrediction.prediction.additionalPredictions.mostProbableSingleBetOutcome ?? 'N/A'}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSpeakPrediction}
            color="primary"
            size="small"
            sx={{ fontSize: '0.7rem' }}
          >
            Read Aloud
          </Button>
          <Button
            onClick={handleCloseModal}
            color="primary"
            size="small"
            sx={{ fontSize: '0.7rem' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog for Video */}
      <Dialog maxWidth="lg" fullWidth open={videoOpen} onClose={handleCloseVideoModal}>
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {selectedPrediction?.homeTeam} vs {selectedPrediction?.awayTeam}
        </DialogTitle>

        {/* Full-Screen Video Content */}
        <DialogContent dividers sx={{ p: 0 }}>
          {/* Remove padding for full-screen video */}
          <Box
            sx={{
              width: '100%',
              height: '80vh',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="body2"
              sx={{ mb: 1, fontSize: '0.75rem', textAlign: 'center', mt: 2 }}
            >
              Watch Highlights:
            </Typography>

            {/* Full-Screen VideoSection */}
            <VideoSection />
          </Box>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions>
          <Button
            onClick={handleCloseVideoModal}
            color="primary"
            size="small"
            sx={{ fontSize: '0.7rem' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PredictionList;