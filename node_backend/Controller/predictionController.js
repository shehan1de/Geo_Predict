const Prediction = require("../Model/Prediction");
const Address = require("../Model/Address");
const mongoose = require('mongoose');

const getNextPredictionId = async () => {
    const lastPrediction = await Prediction.findOne().sort({ predictionId: -1 });
    return lastPrediction ? lastPrediction.predictionId + 1 : 1;
};
const getNextAddressId = async () => {
    const lastAddress = await Address.findOne().sort({ addressId: -1 });
    return lastAddress ? lastAddress.addressId + 1 : 1;
};

exports.createPrediction = async (req, res) => {
    try {
        const { address, predictedPrice, landType, userId } = req.body;

        if (!address || !predictedPrice || !landType || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let addressId;
        const existingAddress = await Address.findOne({ address });

        if (existingAddress) {
            addressId = existingAddress.addressId;
        } else {
            addressId = await getNextAddressId();
            const newAddress = new Address({ addressId, address });
            await newAddress.save();
        }

        const newPrediction = new Prediction({
            userId,
            addressId,
            predictedPrice,
            landType,
        });

        await newPrediction.save();

        res.status(201).json({
            message: "Prediction saved successfully",
            prediction: newPrediction,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getPredictionsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const predictions = await Prediction.find({ userId });

        if (!predictions.length) {
            return res.status(404).json({ message: "No predictions found for this user" });
        }

        const predictionWithAddresses = [];

        for (let prediction of predictions) {
            console.log("Prediction Data: ", prediction);

            const address = await Address.findOne({ addressId: prediction.addressId });

            console.log("Fetched Address: ", address);

            if (address) {
                prediction.address = address.address;
            } else {
                prediction.address = "Address not found";
            }

            predictionWithAddresses.push({
                predictionId: prediction.predictionId,
                userId: prediction.userId,
                address: prediction.address,
                landType: prediction.landType,
                predictedPrice: prediction.predictedPrice,
                predictedDate: prediction.predictedDate
            });
        }

        res.status(200).json(predictionWithAddresses);

    } catch (error) {
        console.error("Error occurred: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
