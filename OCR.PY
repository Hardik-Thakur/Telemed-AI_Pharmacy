import pytesseract
from PIL import Image

# app.py
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
# Path to the tesseract executable (if needed)
# For Windows users
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Open an image file
# img = Image.open('prescription.jpg')

# Use pytesseract to do OCR on the image
# text = pytesseract.image_to_string(img)

# print("Extracted Text: ")
# print(text)



import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.datasets import mnist
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, MaxPooling2D, Flatten, Dropout
from emnist import extract_training_samples, extract_test_samples

# Load EMNIST dataset (handwritten characters)
# For this example, we use the "letters" subset from EMNIST
x_train, y_train = extract_training_samples('letters')
x_test, y_test = extract_test_samples('letters')

# Reshape data to fit model (28x28 pixels, 1 channel for grayscale)
x_train = x_train.reshape((x_train.shape[0], 28, 28, 1))
x_test = x_test.reshape((x_test.shape[0], 28, 28, 1))

# Normalize pixel values to range [0, 1]
x_train = x_train.astype('float32') / 255
x_test = x_test.astype('float32') / 255

# One-hot encode the labels
y_train = to_categorical(y_train - 1, 26)  # Subtract 1 because 'letters' dataset has labels starting from 1
y_test = to_categorical(y_test - 1, 26)

# Build the CNN model
model = Sequential([
    Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.25),
    
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.25),
    
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(26, activation='softmax')  # 26 classes for each letter
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(x_train, y_train, epochs=10, batch_size=128, validation_data=(x_test, y_test))

# Evaluate the model
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f'Test accuracy: {test_acc}')

# Visualize predictions on test data
def plot_image(img):
    plt.imshow(img.reshape(28, 28), cmap='gray')
    plt.axis('off')
    plt.show()

# Predict the first 5 images
predictions = model.predict(x_test[:5])
for i in range(5):
    plot_image(x_test[i])
    print(f"Predicted label: {np.argmax(predictions[i]) + 1}")
