import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import welcomeImage from "../image/main.jpg";
import "./css/main.css";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const handleGetStarted = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/home");
    }, 800);
  };

  return (
    <div
      className={`welcome-container ${fadeOut ? "fade-out slide-up" : ""}`}
      style={{ backgroundImage: `url(${welcomeImage})` }}
    >
      <div className="overlay"></div>
      <div className="content">
        <h1 className="title">Welcome to GeoPredict</h1>
        <p className="subtitle">
          Your trusted land price prediction system powered by AI.
        </p>
        <button className="btn btn-light btn-lg mt-3" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
