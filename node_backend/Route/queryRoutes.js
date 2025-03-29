const express = require("express");
const router = express.Router();
const { getAllQueries, submitQuery, answerQuery, deleteQuery } = require("../Controller/queryContorller");

router.post("/submit", submitQuery);

router.put('/answer/:queryId', answerQuery);

router.get("/queries", getAllQueries);

router.delete("/:queryId", deleteQuery);

module.exports = router;
