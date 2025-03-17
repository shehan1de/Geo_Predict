from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load model files with error handling
try:
    encoded_address = joblib.load("model/encoded_address.pkl")
    if not isinstance(encoded_address, LabelEncoder):
        print("Warning: Re-initializing LabelEncoder")
        encoded_address = LabelEncoder()
except FileNotFoundError:
    print("Error: encoded_address.pkl not found. Initializing a new LabelEncoder.")
    encoded_address = LabelEncoder()

try:
    scaler = joblib.load("model/scaler_land.pkl")
    if not isinstance(scaler, StandardScaler):
        print("Warning: Re-initializing StandardScaler")
        scaler = StandardScaler()
except FileNotFoundError:
    print("Error: scaler_land.pkl not found. Initializing a new StandardScaler.")
    scaler = StandardScaler()

try:
    final_model = joblib.load("model/catboost_model.pkl")
except FileNotFoundError:
    print("Error: catboost_model.pkl not found.")
    final_model = None

# Load address distance data
try:
    address_distance_dict = joblib.load("model/address_distance_data.pkl")
except FileNotFoundError:
    print("Warning: address_distance.pkl not found. Using an empty dictionary.")
    address_distance_dict = {}

@app.route("/")
def home():
    return "GeoPredict Flask API is running!"

@app.route("/predict", methods=["POST"])
def predict_price():
    data = request.get_json()
    address = data.get("address")
    price_category = data.get("price_category")

    if not address or not price_category:
        return jsonify({"error": "Missing input values"}), 400

    # Check if model is available
    if final_model is None:
        return jsonify({"error": "Model not loaded. Please check the backend setup."}), 500

    # Encode address safely
    if address in encoded_address.classes_:
        address_encoded = encoded_address.transform([address])[0]
    else:
        print(f"Error: Unknown address '{address}'")
        return jsonify({"error": "Unknown address"}), 400

    # Encode price category
    price_category_mapping = {"Prime Area": 2, "Mid-range Area": 0, "Outer Area": 1}
    price_category_encoded = price_category_mapping.get(price_category)
    
    if price_category_encoded is None:
        print(f"Error: Invalid price category '{price_category}'")
        return jsonify({"error": "Invalid price category"}), 400

    # Prepare input as a DataFrame
    user_input = pd.DataFrame([[address_encoded, price_category_encoded]], columns=["Address", "Price Category"])

    # Scale input
    try:
        user_input_scaled = scaler.transform(user_input)
    except Exception as e:
        print(f"Error in scaling input: {e}")
        return jsonify({"error": "Scaling error. Please check the input data."}), 500

    # Predict price
    try:
        predicted_price = final_model.predict(user_input_scaled)[0]
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed. Check the model."}), 500

    # Get distance data
    distance_info = address_distance_dict.get(address, {})

    response = {
        "address": address,
        "price_category": price_category,
        "predicted_price": round(predicted_price, 2),
        "distance_info": distance_info
    }

    return jsonify(response)


@app.route("/get_addresses", methods=["GET"])
def get_addresses():
    if encoded_address is not None:
        address_list = list(encoded_address.classes_)
        return jsonify({"addresses": address_list})
    else:
        return jsonify({"error": "Address encoder not loaded"}), 500

if __name__ == "__main__":
    app.run(debug=True)
