# dr_care_model.py
from flask import Flask, request, jsonify
import tensorflow as tf

app = Flask(__name__)

# Load pre-trained model
model = tf.keras.models.load_model('dr_care_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    symptoms = request.json['symptoms']
    
    # Process input and predict (this is simplified, real models need proper preprocessing)
    predictions = model.predict([symptoms])
    
    response = {
        'diagnosis': predictions.argmax(),
        'confidence': max(predictions[0])
    }
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(port=5001)
