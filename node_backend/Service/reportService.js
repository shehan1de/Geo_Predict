const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');
const User = require('../Model/User');
const Prediction = require('../Model/Prediction');

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

// Create a single PdfPrinter instance
const printer = new PdfPrinter(fonts);

// Function to generate the User Report
const generateUserReport = async (startDate, endDate) => {
  try {
    const users = await User.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).select('userId email createdAt');

    if (!users || users.length === 0) {
      throw new Error('No users found for the given date range');
    }

    const totalUsers = users.length;

    const domainCount = {};
    users.forEach(user => {
      const domain = user.email.split('@')[1];
      domainCount[domain] = (domainCount[domain] || 0) + 1;
    });
    const domainStats = Object.entries(domainCount)
      .map(([domain, count]) => `${domain}: ${count} users`)
      .join('\n');

    const registrationHours = {};
    users.forEach(user => {
      const hour = new Date(user.createdAt).getHours();
      registrationHours[hour] = (registrationHours[hour] || 0) + 1;
    });
    const peakHour = Object.entries(registrationHours).sort((a, b) => b[1] - a[1])[0][0];

    const logoPath = path.join(__dirname, '../image/logo.png');

    const docDefinition = {
      header: {
        columns: [
          {
            image: logoPath,
            width: 80
          },
          {
            text: 'GeoPredict - User Report',
            style: 'header',
            alignment: 'center',
            margin: [10, 10, 10, 10]
          }
        ]
      },
      footer: (currentPage, pageCount) => ({
        columns: [
          { text: `Generated on: ${new Date().toLocaleString()}`, style: 'footer', alignment: 'left' },
          { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', margin: [0, 0, 10, 0] }
        ]
      }),
      content: [
        { text: `Date Range: ${startDate} to ${endDate}`, style: 'subheader' },
        { text: `Total Users Registered: ${totalUsers}`, style: 'summary' },
        { text: 'Most Common Email Domains:', style: 'subheader' },
        { text: domainStats, margin: [0, 0, 0, 10] },
        { text: `Peak Registration Hour: ${peakHour}:00 - ${peakHour + 1}:00`, style: 'subheader' },
        { text: 'User Details:', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: [
              [
                { text: 'User ID', style: 'tableHeader' },
                { text: 'Email', style: 'tableHeader' },
                { text: 'Created At', style: 'tableHeader' }
              ],
              ...users.map(user => [
                user.userId,
                user.email,
                user.createdAt.toISOString().split('T')[0]
              ])
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] },
        subheader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
        summary: { fontSize: 14, bold: true, margin: [0, 10, 0, 10] },
        tableHeader: { bold: true, fillColor: '#16A085', color: 'white', fontSize: 12, alignment: 'center' },
        footer: { fontSize: 10, margin: [10, 0, 10, 0] }
      }
    };

    const reportsDir = path.join(__dirname, '../Reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(reportsDir, `user_report_${Date.now()}.pdf`);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve({ success: true, message: "User Report Generated", filePath }));
      writeStream.on('error', (error) => reject({ success: false, message: `Failed to generate user report: ${error.message}` }));
    });

  } catch (error) {
    console.error("Error generating user report:", error);
    return { success: false, message: `Failed to generate user report: ${error.message}` };
  }
};

// Function to generate the Prediction Report
// Function to generate the Prediction Report
const generatePredictionReport = async (startDate, endDate) => {
  try {
    const predictions = await Prediction.find({
      predictedDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).select('predictionId userId addressId landType predictedPrice predictedDate');

    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions found for the given date range');
    }

    // Define totalPredictions as the count of predictions
    const totalPredictions = predictions.length;

    console.log("Predictions Found:", totalPredictions);

    const landTypeCount = {};
    predictions.forEach(prediction => {
      landTypeCount[prediction.landType] = (landTypeCount[prediction.landType] || 0) + 1;
    });

    const landTypeStats = Object.entries(landTypeCount)
      .map(([landType, count]) => `${landType}: ${count} predictions`)
      .join('\n');

    const logoPath = path.join(__dirname, '../image/logo.png');

    const docDefinition = {
      header: {
        columns: [
          {
            image: logoPath,
            width: 80
          },
          {
            text: 'GeoPredict - Prediction Report',
            style: 'header',
            alignment: 'center',
            margin: [10, 10, 10, 10]
          }
        ]
      },
      footer: (currentPage, pageCount) => ({
        columns: [
          { text: `Generated on: ${new Date().toLocaleString()}`, style: 'footer', alignment: 'left' },
          { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', margin: [0, 0, 10, 0] }
        ]
      }),
      content: [
        { text: `Date Range: ${startDate} to ${endDate}`, style: 'subheader' },
        { text: `Total Predictions Made: ${predictions.length}`, style: 'summary' },
        { text: 'Predictions Breakdown by Land Type:', style: 'subheader' },
        { text: landTypeStats, margin: [0, 0, 0, 10] },
        { text: 'Prediction Details:', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Prediction ID', style: 'tableHeader' },
                { text: 'User ID', style: 'tableHeader' },
                { text: 'Address ID', style: 'tableHeader' },
                { text: 'Land Type', style: 'tableHeader' },
                { text: 'Predicted Price', style: 'tableHeader' },
                { text: 'Predicted Date', style: 'tableHeader' }
              ],
              ...predictions.map(prediction => [
                prediction.predictionId || 'N/A',
                prediction.userId || 'N/A',
                prediction.addressId || 'N/A',
                prediction.landType || 'N/A',
                prediction.predictedPrice || 'N/A',
                prediction.predictedDate ? prediction.predictedDate.toISOString().split('T')[0] : 'Unknown'
              ])
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] },
        subheader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
        summary: { fontSize: 14, bold: true, margin: [0, 10, 0, 10] },
        tableHeader: { bold: true, fillColor: '#16A085', color: 'white', fontSize: 12, alignment: 'center' },
        footer: { fontSize: 10, margin: [10, 0, 10, 0] }
      }
    };
    

    const reportsDir = path.join(__dirname, '../Reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(reportsDir, `prediction_report_${Date.now()}.pdf`);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve({ success: true, message: "Prediction Report Generated", filePath }));
      writeStream.on('error', (error) => reject({ success: false, message: `Failed to generate prediction report: ${error.message}` }));
    });

  } catch (error) {
    console.error("Error generating prediction report:", error);
    return { success: false, message: `Failed to generate prediction report: ${error.message}` };
  }
};


module.exports = { generateUserReport, generatePredictionReport };
