import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

export default function App() {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState("");
  const [priceCategory, setPriceCategory] = useState("Prime Area");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false); // Control advanced details visibility

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_addresses");
        setAddresses(response.data.addresses);
      } catch (err) {
        console.error("Error fetching addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setShowAdvanced(false);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        address,
        price_category: priceCategory,
      });

      setPrediction(response.data);
    } catch (err) {
      setError("Error fetching prediction. Please check input values.");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4">
              <h2 className="text-center mb-4 text-primary">GeoPredict - Land Price Prediction</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Town you preferred</label>
                  <select
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">-- Select Town --</option>
                    {addresses.map((addr, index) => (
                      <option key={index} value={addr}>
                        {addr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Area you preferred</label>
                  <select
                    value={priceCategory}
                    onChange={(e) => setPriceCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Prime Area">Prime Area</option>
                    <option value="Mid-range Area">Mid-range Area</option>
                    <option value="Outer Area">Outer Area</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Get Prediction
                </button>
              </form>

              {error && <p className="mt-3 text-danger text-center">{error}</p>}
            </div>

            {prediction && (
              <div className="card shadow-lg mt-4 p-4">
                <h3 className="text-center text-success">Predicted Price<h6>(price per perch)</h6></h3>
                <h2 className="text-center text-primary">
                  Rs. {prediction.predicted_price.toLocaleString()}
                </h2>

                {/* Advanced Feature Button */}
                <button
                  className="btn btn-outline-secondary w-100 mt-3"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Hide Details" : "View Advanced Features"}
                </button>

                {/* Advanced Details - Only Show if Button Clicked */}
                {showAdvanced && (
                  <div className="mt-3">
                    <h5 className="text-center">Additional Information</h5>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <strong>Town:</strong> {prediction.address}
                      </li>
                      <li className="list-group-item">
                        <strong>Area Type:</strong> {prediction.price_category}
                      </li>
                    </ul>

                    {prediction.distance_info && (
  <div className="mt-3">
    <h5 className="text-center">Distance Information</h5>
    <ul className="list-group">
      {Object.entries(prediction.distance_info).map(([key, value]) => {
        const distance = parseFloat(value);
        const formattedDistance =
          distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(3)} km`;
        
        return (
          <li key={key} className="list-group-item">
            {key}: <strong>{formattedDistance}</strong>
          </li>
        );
      })}
    </ul>
  </div>
)}


                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
