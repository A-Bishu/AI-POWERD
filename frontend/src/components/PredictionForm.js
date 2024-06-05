//PredictionForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/App.css';

const PredictionForm = () => {
  const [mid, setMid] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mid) {
      navigate(`/predict/${mid}`); // Navigate to the prediction route with 'mid' and 'cid'
    }
  };

  return (
    <div className='prediction-form'>
      <h2>Get Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Match ID (mid):
          <input
            type="text"
            value={mid}
            onChange={(e) => setMid(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Get Prediction</button>
      </form>
    </div>
  );
};

export default PredictionForm;
