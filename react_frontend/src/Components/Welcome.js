import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary text-white">
      <div className="text-center">
        <h1 className="display-4">Welcome to GeoPredict</h1>
        <p className="lead">
          Your trusted land price prediction system powered by AI.
        </p>
        <button
          className="btn btn-light btn-lg mt-3"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
