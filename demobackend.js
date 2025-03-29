// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { exec } = require('child_process'); // To run Python scripts

const app = express();
app.use(cors());
app.use(fileUpload());

app.post('/ocr', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }
  
  let file = req.files.file;
  file.mv(`./uploads/${file.name}`, async (err) => {
    if (err) return res.status(500).send(err);

    // Call Python OCR script
    exec(`python3 ocr_script.py ./uploads/${file.name}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${stderr}`);
        return res.status(500).send('Error in OCR processing');
      }
      res.send({ text: stdout });
    });
  });
});

app.listen(5000, () => console.log('Server started on http://localhost:5000'));
