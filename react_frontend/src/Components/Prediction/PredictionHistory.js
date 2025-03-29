import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    axios
      .get(`/api/predictions/${userId}`)
      .then((response) => {
        const sortedPredictions = response.data.sort((a, b) => {
          const dateA = new Date(a.predictedDate);
          const dateB = new Date(b.predictedDate);
          return dateB - dateA;
        });
        setPredictions(sortedPredictions);
      })
      .catch((error) => {
        console.error('Error fetching prediction data:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const capitalizeAddress = (address) => {
    if (!address) return '';
    return address
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="container mt-4">
      <center><h2 className="mb-3">Your Prediction History</h2></center>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Address</th>
              <th>Predicted Price</th>
              <th>Land Type</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {predictions.length > 0 ? (
              predictions.map((prediction) => (
                <tr key={prediction.predictionId}>
                  <td>{capitalizeAddress(prediction.address)}</td>
                  <td>{prediction.predictedPrice} LKR</td>
                  <td>{prediction.landType}</td>
                  <td>{formatDate(prediction.predictedDate)}</td>
                  <td>{formatTime(prediction.predictedDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No predictions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistory;
