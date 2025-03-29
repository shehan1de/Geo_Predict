import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CreateReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const generateUserReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date should not be after the end date.");
      return;
    }

    try {
      const response = await axios.get(`/download/user-report?startDate=${startDate}&endDate=${endDate}`, {
        responseType: 'arraybuffer'  // Expecting a PDF file as an array buffer
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `User_Report_${startDate}_to_${endDate}.pdf`;
      link.click();

      toast.success("User report generated successfully.");
    } catch (error) {
      console.error("Error generating user report:", error);
      toast.error("Failed to generate user report.");
    }
  };

  const generatePredictionReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date should not be after the end date.");
      return;
    }

    try {
      const response = await axios.get(`/download/prediction-report?startDate=${startDate}&endDate=${endDate}`, {
        responseType: 'arraybuffer'  // Expecting a PDF file as an array buffer
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `Prediction_Report_${startDate}_to_${endDate}.pdf`;
      link.click();

      toast.success("Prediction report generated successfully.");
    } catch (error) {
      console.error("Error generating prediction report:", error);
      toast.error("Failed to generate prediction report.");
    }
  };

  // Check if both start and end dates are valid
  const isFormValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  return (
    <div className="main-content">
      <div className="container mt-4 d-flex justify-content-center align-items-center flex-column">
        <div className="form-group mb-3 w-75">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="form-group mb-3 w-75">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={generateUserReport}
            disabled={!isFormValid} // Disable if form is not valid
          >
            Generate User Report
          </button>
          <button
            className="btn btn-secondary"
            onClick={generatePredictionReport}
            disabled={!isFormValid} // Disable if form is not valid
          >
            Generate Prediction Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
