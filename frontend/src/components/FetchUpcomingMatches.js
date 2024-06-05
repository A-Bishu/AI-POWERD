//FetchUpcomingMatches.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './styles/App.css';

const FetchUpcomingMatches = () => {
  const competitionIds = [992, 995, 996, 999, 1017, 1011, 1035, 1046,1114]; // Predefined competition IDs
  const [cid, setCid] = useState(competitionIds[0]); // Default to the first ID
  const [matches, setMatches] = useState([]); // Store fetched matches
  const [loading, setLoading] = useState(false); // Loading status
  const [error, setError] = useState(null); // Error handling

  const fetchMatches = async (cid) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3003/competition-matches/${cid}`);
      const fetchedMatches = response.data.data; // Ensure correct data extraction

      if (Array.isArray(fetchedMatches)) {
        setMatches(fetchedMatches);
      } else {
        throw new Error('Unexpected response structure'); // Custom error message for unexpected structure
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(`Failed to fetch upcoming matches: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(cid); // Fetch matches when component mounts or `cid` changes
  }, [cid]); // React to changes in `cid`

  return (
    <div className='fetch-upcoming-matches'>
      <h2>Fetch Upcoming Matches by Competition ID</h2>
      <form>
        <label>
          Competition ID:
          <select value={cid} onChange={(e) => setCid(e.target.value)}> {/* Dropdown to select competition ID */}
            {competitionIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
      </form>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>} {/* Display error message */}

      <ul>
        {matches.length > 0
          ? matches.map((match) => (
              <li key={match.mid}>
                  {/* Corrected Link syntax */}
                  <Link to={`/match/${match.mid}`}>
                  Match ID: {match.mid} - {match.teams.home.tname} vs {match.teams.away.tname} - {match.dateStart} 
                  </Link>
              </li>
            ))
          : !loading && <p>No matches found for this competition.</p>} {/* Handle no data case */}
      </ul>
    </div>
  );
};

export default FetchUpcomingMatches;
