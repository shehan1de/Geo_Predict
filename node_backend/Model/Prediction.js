const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const predictionSchema = new mongoose.Schema({
  predictionId: {
    type: Number,
    unique: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  addressId: {
    type: Number,
    required: true,
  },
  landType: {
    type: String,
    required: true,
  },
  predictedPrice: {
    type: Number,
    required: true,
  },
  predictedDate: {
    type: Date,
    default: Date.now,
  },
});

predictionSchema.plugin(AutoIncrement, { inc_field: 'predictionId' });

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
