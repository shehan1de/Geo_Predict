import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Prediction from "./Components/Prediction/Prediction";
import Welcome from "./Components/Welcome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/predict" element={<Prediction />} />
      </Routes>
    </Router>
  );
}

export default App;