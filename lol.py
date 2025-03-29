import os
import cv2
import pytesseract
from flask import Flask, request, render_template_string

# Specify the path to the Tesseract executable (update this path accordingly)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)

# Create an HTML template for the upload form and result
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>AI Pharmacy - Upload Prescription</title>
</head>
<body>
    <h1>Upload Prescription</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept="image/*" required>
        <button type="submit">Upload</button>
    </form>
    {% if extracted_text %}
    <h2>Extracted Text</h2>
    <p>{{ extracted_text }}</p>
    <a href="/">Upload Another Prescription</a>
    {% endif %}
</body>
</html>
"""

def preprocess_image(image_path):
    """Preprocess the uploaded image for better OCR accuracy."""
    # Load the image
    img = cv2.imread(image_path)
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Apply thresholding
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    return thresh

def extract_text_from_image(image):
    """Extract text from the processed image using Tesseract OCR."""
    text = pytesseract.image_to_string(image)
    return text

@app.route('/')
def index():
    """Render the upload form."""
    return render_template_string(HTML_TEMPLATE)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle the uploaded file and extract text."""
    if 'file' not in request.files:
        return 'No file uploaded', 400

    file = request.files['file']
    
    if file.filename == '':
        return 'No file selected', 400

    # Save the uploaded file
    image_path = f'uploads/{file.filename}'
    os.makedirs('uploads', exist_ok=True)  # Create the uploads directory if it doesn't exist
    file.save(image_path)

    # Preprocess the image
    processed_image = preprocess_image(image_path)

    # Extract text using OCR
    extracted_text = extract_text_from_image(processed_image)

    # Render the result
    return render_template_string(HTML_TEMPLATE, extracted_text=extracted_text)

if __name__ == '__main__':
    app.run(debug=True)
