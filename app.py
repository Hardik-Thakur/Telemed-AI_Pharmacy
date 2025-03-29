from flask import Flask, request, jsonify
from recommendation_model import recommend_drugs

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    drug_name = request.args.get('drug_name')
    if not drug_name:
        return jsonify({'error': 'Drug name is required'}), 400
    
    recommendations = recommend_drugs(drug_name)
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)
