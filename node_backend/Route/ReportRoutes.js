const express = require("express");
const { generateUserReport, generatePredictionReport } = require("../Service/reportService");

const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start date and end date are required." });
    }

    const reportResult = await generateUserReport(startDate, endDate);

    if (reportResult.success) {
      return res.status(200).json({
        success: true,
        message: reportResult.message,
        filePath: reportResult.filePath
      });
    } else {
      return res.status(500).json({
        success: false,
        message: reportResult.message
      });
    }
  } catch (error) {
    console.error("Error in user report route:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/prediction", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start date and end date are required." });
    }

    const reportResult = await generatePredictionReport(startDate, endDate);
    
    // Log the result to see what is returned
    console.log("Prediction Report Result:", reportResult);

    if (reportResult.success) {
      return res.status(200).json({
        success: true,
        message: reportResult.message,
        filePath: reportResult.filePath
      });
    } else {
      return res.status(500).json({
        success: false,
        message: reportResult.message
      });
    }
  } catch (error) {
    console.error("Error in prediction report route:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/download/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '../Reports', fileName);

  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  } else {
    return res.status(404).json({
      success: false,
      message: "File not found"
    });
  }
});




router.get('/user-report', async (req, res) => {
  const { startDate, endDate } = req.query; // assuming you're passing these as query parameters

  try {
    const result = await generateUserReport(startDate, endDate);

    if (result.success) {
      const filePath = result.filePath; // Path to the generated PDF
      const absolutePath = path.join(__dirname, '..', 'generated-reports', filePath); // Adjust to match your directory structure

      // Check if file exists before trying to send it
      if (fs.existsSync(absolutePath)) {
        res.sendFile(absolutePath, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Failed to send file.");
          }
        });
      } else {
        res.status(404).send("File not found.");
      }
    } else {
      res.status(400).send(result.message); // Error message from report generation
    }
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Failed to generate report.");
  }
});

// Endpoint to generate and serve prediction report
router.get('/prediction-report', async (req, res) => {
  const { startDate, endDate } = req.query; // assuming you're passing these as query parameters

  try {
    const result = await generatePredictionReport(startDate, endDate);

    if (result.success) {
      const filePath = result.filePath; // Path to the generated PDF
      const absolutePath = path.join(__dirname, '..', 'generated-reports', filePath); // Adjust to match your directory structure

      // Check if file exists before trying to send it
      if (fs.existsSync(absolutePath)) {
        res.sendFile(absolutePath, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Failed to send file.");
          }
        });
      } else {
        res.status(404).send("File not found.");
      }
    } else {
      res.status(400).send(result.message); // Error message from report generation
    }
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Failed to generate report.");
  }
});

module.exports = router;
