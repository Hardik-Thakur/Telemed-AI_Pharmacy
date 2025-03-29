const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Allow cross-origin requests from frontend
app.use(cors());
app.use(express.static('public'));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Sample pharmacies and medicines
const samplePharmacies = [
  { name: 'Pharmacy 1', location: '123 Main St', price: '$10' },
  { name: 'Pharmacy 2', location: '456 Maple Rd', price: '$12' },
  { name: 'Pharmacy 3', location: '789 Oak Ave', price: '$11' }
];

const sampleMedicines = ['Paracetamol 500mg', 'Ibuprofen 200mg', 'Amoxicillin 250mg', 'Cetirizine 10mg'];

// POST route to handle prescription upload and OCR
app.post('/upload-prescription', upload.single('prescriptionFile'), (req, res) => {
  const filePath = req.file.path;

  // Perform OCR on the uploaded file
  Tesseract.recognize(filePath, 'eng', { logger: info => console.log(info) })
    .then(({ data: { text } }) => {
      console.log('Extracted Text:', text);

      // Mock AI logic: check if text contains any of the sample medicines
      const suggestedMedicines = sampleMedicines.filter(medicine => text.includes(medicine));

      if (suggestedMedicines.length === 0) {
        suggestedMedicines.push('No matching medicines found in the prescription');
      }

      // Send the response with suggested medicines and nearby pharmacies
      res.json({
        medicines: suggestedMedicines,
        pharmacies: samplePharmacies,
        deliveryStatus: ['Order Confirmed', 'Preparing for Dispatch', 'Out for Delivery']
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error processing the prescription');
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
