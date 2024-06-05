import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Grid } from '@mui/material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Dropdown from '../Components/Dropdown';
import Button from '../Components/Button';

const apiBaseUrls = {
  soccer: 'https://soccer.entitysport.com',
  nfl: 'https://nfl.entitysport.com',
  basketball: 'https://basketball.entitysport.com'
};

const CompetitionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');

  useEffect(() => {
    const fetchCompetitions = async () => {
      const sport = new URLSearchParams(location.search).get('sport');
      const token = process.env.REACT_APP_SOCCER_API_TOKEN;

      if (apiBaseUrls[sport] && token) {
        try {
          const response = await axios.get(`${apiBaseUrls[sport]}/competitions`, {
            params: {
              token,
              status: 3,
              per_page: 10,
              paged: 1
            }
          });
          const fetchedCompetitions = response.data.response.items.map(item => ({ value: item.cid, label: item.cname }));
          console.log('Fetched Competitions:', fetchedCompetitions);
          setCompetitions(fetchedCompetitions);
        } catch (error) {
          console.error('Error fetching competitions:', error);
          if (error.response && error.response.status === 401) {
            alert('Unauthorized access. Please check your API token.');
          } else {
            alert('Error fetching competitions. Please try again later.');
          }
        }
      }
    };

    fetchCompetitions();
  }, [location]);

  const handleCompetitionSelect = (event) => {
    setSelectedCompetition(event.target.value);
  };

  const handleViewMatches = () => {
    navigate(`/match-list?competition=${selectedCompetition}`);
  };

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Select Competition
          </Typography>
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Dropdown label="Competition" options={competitions} onChange={handleCompetitionSelect} value={selectedCompetition} fullWidth />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button text="View Matches" onClick={handleViewMatches} fullWidth />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default CompetitionSelectionPage;
