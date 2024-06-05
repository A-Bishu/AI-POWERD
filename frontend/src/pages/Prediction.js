// Prediction.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Prediction = () => {
  const { mid} = useParams(); // Extracting parameters from the route
  const [prediction, setPrediction] = useState(''); // To store the fetched prediction
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/predict-match-outcome/${mid}`);
        setPrediction(response.data); // Set the fetched outcome
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching prediction:', error);
        setError('Failed to fetch prediction'); // Set an error message
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchPrediction(); // Fetch when component is mounted
  }, [mid]); // Re-run if 'mid' or 'cid' changes

  if (loading) {
    return <div className="prediction-container"><div className="loading">Loading prediction...</div></div>;
  }

  if (error) {
    return <div className="prediction-container"><div className="error">Error: {error}</div></div>;
  }

  return (
    <div className="prediction-container">
      <h2>Prediction</h2>
      <pre>{prediction}</pre>
    </div>
  );
};
export default Prediction;
