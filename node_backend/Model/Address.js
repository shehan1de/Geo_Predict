const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressId: {
      type: Number,
      unique: true,
      required: true,
  },
  address: {
      type: String,
      required: true,
  },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;