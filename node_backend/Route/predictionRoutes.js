const express = require("express");
const router = express.Router();
const predictionController = require("../Controller/predictionController");

router.post("/add", predictionController.createPrediction);
router.get("/:userId", predictionController.getPredictionsByUser);

module.exports = router;
