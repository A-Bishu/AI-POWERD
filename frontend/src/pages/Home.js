import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Reset error
        const response = await axios.get('http://localhost:3003/upcoming-matches');
        if (response.data) {
          setMatches(response.data); // Store fetched matches
        } else {
          throw new Error('Invalid response data'); // Handle unexpected structure
        }
      } catch (err) {
        setError(`Error fetching matches: ${err.message}`); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="home-container">
      <h1>Upcoming Matches</h1>

      {loading && <p>Loading...</p>} {/* Display while loading */}
      {error && <p>{error}</p>} {/* Display error message */}

      {!loading && !error && matches.length === 0 && (
        <p>No upcoming matches.</p>
      )}

      {!error && matches.length > 0 && (
        <ul>
          {matches.map((match) => (
            <li key={match.mid}>
              <Link to={`/match/${match.mid}`}>{`${match.teams.home.tname} vs ${match.teams.away.tname}`}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
