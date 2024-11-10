import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid, Paper,  useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Dropdown from '../Components/Dropdown';
import Button from '../Components/Button';

// Correct import paths assuming images are in src/Assets
import BundesligaImage from '../Assets/Bundesliga_image.jpg';
import SerieAImage from '../Assets/Serie_A_image.jpg';
import Ligue1Image from '../Assets/Ligue_1_image.jpg';
import PremierLeagueImage from '../Assets/Premier_League_image.jpg';
import LaLigaImage from '../Assets/LaLiga_image.jpg';
import MLSImage from '../Assets/MLS_image.jpg';
import ChampionsLeague from '../Assets/UEFA_image.jpg';

const apiBaseUrls = {
  soccer: process.env.REACT_APP_SOCCER_API_BASE_URL,
};

const competitionData = [
  { name: 'Bundesliga', cid: '1176', background: BundesligaImage },
  { name: 'Serie A', cid: '1172', background: SerieAImage },
  { name: 'Ligue 1', cid: '1119', background: Ligue1Image },
  { name: 'Premier League', cid: '1118', background: PremierLeagueImage },
  { name: 'LaLiga', cid: '1120', background: LaLigaImage },
  { name: 'MLS', cid: '1067', background: MLSImage },
  { name: 'UEFA Champions League', cid: '1128', background: ChampionsLeague},
  
];

const CompetitionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Extract 'sport' parameter from URL query string
    const sport = new URLSearchParams(location.search).get('sport');
    
    const token = process.env.REACT_APP_SOCCER_API_KEY;

    if (!sport) {
      setError('No sport selected. Please go back and select a sport.');
      return;
    }

    if (apiBaseUrls[sport] && token) {
      setLoading(true); // Start loading
      axios.get(`${apiBaseUrls[sport]}/competitions`, {
        params: {
          token,
          status: 3,
          per_page: 50,
          paged: 1,
        },
      })
      .then((response) => {
        const fetchedCompetitions = response.data.response.items.map(item => ({ value: item.cid, label: item.cname }));
        setCompetitions(fetchedCompetitions);
        setError(''); // Clear previous errors if any
      })
      .catch((error) => {
        console.error('Error fetching competitions:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please check your API token.');
        } else {
          setError('Error fetching competitions. Please try again later.');
        }
      })
      .finally(() => {
        setLoading(false); // End loading
      });
    } else {
      setError('Invalid sport or missing API token.');
    }
  }, [location]);

  const handleCompetitionSelect = (event) => {
    setSelectedCompetition(event.target.value);
  };

  const handleViewMatches = (cid) => {
    if (cid) {
      navigate(`/match-list?competition=${cid}`);
    } else {
      setError('Please select a competition first.');
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #3f51b5, #2196f3)',
          py: 4,
        }}
      >
        <Container>
          <Paper elevation={6} sx={{ py: 4, px: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            
            {loading ? (
              <CircularProgress /> // Show a loading spinner when fetching data
            ) : (
              <Grid container spacing={isSmallScreen ? 1 : 2} sx={{ mt: 4 }}>
                {competitionData.map((competition) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={competition.cid}>
                     <Paper
                      onClick={() => handleViewMatches(competition.cid)} // Make the entire box clickable
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: 200, // Adjust height as needed
                        background: `url(${competition.background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: theme.shadows[3],
                        borderRadius: '12px', // Rounded corner effect
                        overflow: 'hidden', // Ensures content stays within the box
                        cursor: 'pointer', // Change cursor to pointer to indicate it's clickable
                        transition: 'transform 0.3s ease', // Add a transition effect
                        '&:hover': { 
                          transform: 'scale(1.05)' // Slightly enlarge on hover for feedback
                        },
                      }}
                    >
                      
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            {error && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              More Competitions
            </Typography>
              <Grid item xs={12} sm={8} md={6} lg={4}>
                <Dropdown label="Competition" options={competitions} onChange={handleCompetitionSelect} value={selectedCompetition} fullWidth />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button text="View Matches" onClick={() => handleViewMatches(selectedCompetition)} fullWidth />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CompetitionSelectionPage;
