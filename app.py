from flask import Flask, request, jsonify
from services.model_training import predict

app = Flask(__name__)

@app.route('/api/predict', methods=['POST'])
def predict_stock():
    data = request.json
    predictions = predict(data['stockSymbol'], data['period'])
    return jsonify(predictions)

if __name__ == "__main__":
    app.run(port=5001)
