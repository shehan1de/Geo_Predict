// const mongoose = require("mongoose");

// const PredictionSchema = new mongoose.Schema({
//   predictionId: { type: Number, unique: true },
//   addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Addresses", required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   areaType: { type: String, enum: ["Prime Area", "Mid-range Area", "Outer Area"], required: true },
//   predictedDate: { type: Date, default: Date.now },
//   predictedPrice: { type: Number, required: true },
// });

// PredictionSchema.pre("save", async function (next) {
//   if (!this.predictionId) {
//     const lastPrediction = await this.constructor.findOne().sort("-predictionId");
//     this.predictionId = lastPrediction ? lastPrediction.predictionId + 1 : 1;
//   }
//   next();
// });

// module.exports = mongoose.model("Prediction", PredictionSchema);
