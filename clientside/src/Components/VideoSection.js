import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Mapping of competitions to video URLs using environment variables
const competitionVideos = {
  'All Leagues': process.env.REACT_APP_ALL_LEAGUES_VIDEO_URL,
  'Premier League': process.env.REACT_APP_PREMIER_LEAGUE_VIDEO_URL,
  LaLiga: process.env.REACT_APP_LALIGA_VIDEO_URL,
  Bundesliga: process.env.REACT_APP_BUNDESLIGA_VIDEO_URL,
  'Serie A': process.env.REACT_APP_SERIE_A_VIDEO_URL,
  'Ligue 1': process.env.REACT_APP_LIGUE1_VIDEO_URL,
};

const VideoSection = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('All Leagues');

  const handleCompetitionChange = (event) => {
    setSelectedCompetition(event.target.value);
  };

  return (
    <>
      {/* Competition Selection Menu */}
      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel id="competition-select-label">Competition</InputLabel>
        <Select
          labelId="competition-select-label"
          id="competition-select"
          value={selectedCompetition}
          onChange={handleCompetitionChange}
          label="Competition"
        >
          <MenuItem value="All Leagues">All Leagues</MenuItem>
          <MenuItem value="Premier League">Premier League</MenuItem>
          <MenuItem value="LaLiga">La Liga</MenuItem>
          <MenuItem value="Bundesliga">Bundesliga</MenuItem>
          <MenuItem value="Serie A">Serie A</MenuItem>
          <MenuItem value="Ligue 1">Ligue 1</MenuItem>
        </Select>
      </FormControl>

      {/* Embedded Video Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '56.25%', // 16:9 Aspect Ratio
          mb: 4,
        }}
      >
        <iframe
          src={competitionVideos[selectedCompetition]}
          frameBorder="0"
          allow="encrypted-media; fullscreen"
         
          title={`${selectedCompetition} Video`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></iframe>
      </Box>
    </>
  );
};

export default VideoSection;
