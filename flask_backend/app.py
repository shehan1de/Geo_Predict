from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import datetime
import requests

app = Flask(__name__)
CORS(app)

# Setup database configuration (SQLite used for simplicity, adjust as needed)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///predictions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define Prediction model for storing predictions
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    price_category = db.Column(db.String(50), nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<Prediction {self.address} - {self.predicted_price}>"

# Load models and encoders
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

    if final_model is None:
        return jsonify({"error": "Model not loaded. Please check the backend setup."}), 500

    if address in encoded_address.classes_:
        address_encoded = encoded_address.transform([address])[0]
    else:
        return jsonify({"error": "Unknown address"}), 400

    price_category_mapping = {"Prime Area": 2, "Mid-range Area": 0, "Outer Area": 1}
    price_category_encoded = price_category_mapping.get(price_category)
    
    if price_category_encoded is None:
        return jsonify({"error": "Invalid price category"}), 400

    user_input = pd.DataFrame([[address_encoded, price_category_encoded]], columns=["Address", "Price Category"])

    try:
        user_input_scaled = scaler.transform(user_input)
    except Exception as e:
        return jsonify({"error": "Scaling error. Please check the input data."}), 500

    try:
        predicted_price = final_model.predict(user_input_scaled)[0]
    except Exception as e:
        return jsonify({"error": "Prediction failed. Check the model."}), 500

    distance_info = address_distance_dict.get(address, {})

    response = {
        "address": address,
        "price_category": price_category,
        "predicted_price": round(predicted_price, 2),
        "distance_info": distance_info
    }

    return jsonify(response)



@app.route('/save_prediction', methods=['POST'])
def save_prediction():
    data = request.get_json()

    user_id = data.get('userId')
    address = data.get('address')
    predicted_price = data.get('predictedPrice')
    land_type = data.get('landType')

    # Ensure all required fields are provided
    if not all([user_id, address, predicted_price, land_type]):
        return jsonify({"error": "All fields (userId, address, predictedPrice, landType) are required!"}), 400

    # Prepare data to send to Node.js backend
    node_backend_url = "http://localhost:5001/api/predictions/add"


    payload = {
        'userId': user_id,
        'address': address,
        'predictedPrice': predicted_price,
        'landType': land_type
    }

    try:
        # Send POST request to Node.js backend
        response = requests.post(node_backend_url, json=payload)

        if response.status_code == 201:
            return jsonify({"message": "Prediction saved successfully to Node.js backend!"}), 201
        else:
            return jsonify({"error": f"Error from Node.js backend: {response.text}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error sending prediction to Node.js backend: {str(e)}"}), 500



@app.route("/get_addresses", methods=["GET"])
def get_addresses():
    if encoded_address is not None:
        address_list = list(encoded_address.classes_)
        return jsonify({"addresses": address_list})
    else:
        return jsonify({"error": "Address encoder not loaded"}), 500

if __name__ == "__main__":
    # Initialize the database (uncomment the line below to create tables the first time)
    # db.create_all()
    app.run(debug=True)
