// MatchDetails.js

import React, { useEffect, useState } from 'react';
import apiClient from '../api'; // Importing the axios client
import { useParams } from 'react-router-dom';

const MatchDetails = () => {
  const { mid } = useParams(); // Extracting 'mid' from the route parameters
  const [matchDetails, setmatchDetails] = useState(null); // State to store match details
  const [Loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
     // Fetching match details from the backend using the Axios client
    const fetchMatchDetails = async () => {
      try {
        const response = await apiClient.get(`/match-details/${mid}`);
        setmatchDetails(response.data); // Setting the fetched match details
        setLoading(false); // Stop loading when the data is fetched
      } catch (error) {
        console.error('Error fetching match details:', error);
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchMatchDetails(); // Call the function when the componentis mounted
  }, [mid]); // Re-run effect when 'mid' changes

  if (Loading) {
    return <div>Loading match details...</div>; // Loading state
  }

  if (!matchDetails) {
    return <div>Match Details not available.</div>; // If no match details are found
  }

  return (
    <div className="match-details">
      <h1>Match Details</h1>
      <p>Match ID: {matchDetails.mid}</p>
      <p>Teams: {matchDetails.teams.home.tname} vs {matchDetails.teams.away.tname}</p>
      <p>Venue: {matchDetails.venue.name}</p>
      <p>Start Date: {matchDetails.dateStart}</p>
      {/* Additional details can be added here */}
    </div>
  );
};

export default MatchDetails;
