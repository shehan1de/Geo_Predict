// const express = require("express");
// const mongoose = require("mongoose");
// const axios = require("axios");
// const Prediction = require("../Model/Prediction");
// const router = express.Router();

// router.post("/predict", async (req, res) => {
//   try {
//     const { address, price_category, userId } = req.body;

//     console.log(req.body);

//     if (!address || !price_category || !userId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Check if address exists in Addresses collection
//     const addressDoc = await mongoose.connection.db.collection("Addresses").findOne({ name: address });

//     if (!addressDoc) {
//       return res.status(404).json({ error: "Address not found in database" });
//     }

//     // Call Flask API for prediction
//     const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", {
//       address,
//       price_category,
//     });

//     if (!flaskResponse.data || typeof flaskResponse.data.predicted_price !== "number") {
//       return res.status(500).json({ error: "Invalid response from prediction model" });
//     }

//     const predictedPrice = flaskResponse.data.predicted_price;

//     // Create new prediction document
//     const newPrediction = new Prediction({
//       addressId: addressDoc._id,
//       userId,
//       areaType: price_category,
//       predictedPrice,
//       predictedDate: new Date(), // Automatically set the current date
//     });

//     // Save the prediction to the database
//     await newPrediction.save();

//     // Return the prediction response
//     res.json({
//       predictionId: newPrediction._id,
//       address,
//       addressId: addressDoc._id,
//       price_category,
//       predicted_price: predictedPrice,
//       predictedDate: newPrediction.predictedDate, // Return the predictedDate
//     });
//   } catch (error) {
//     console.error("Prediction error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
