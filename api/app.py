# ── FLASK REST API ────────────────────────────────────────
# This is the backend server that:
# 1. Loads the trained XGBoost model
# 2. Receives prediction requests from the mobile app
# 3. Returns predicted gross income as JSON

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

# ── Initialize Flask app ──────────────────────────────────
app = Flask(__name__)
CORS(app)  # allows mobile app to call this API

# ── Load trained model and pipeline objects ───────────────
print("Loading model and pipeline...")

with open('../model/xgb_tuned.pkl', 'rb') as f:
    model = pickle.load(f)

with open('../model/encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

with open('../model/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

print("✓ Model loaded successfully")

# ── Encoding maps (for reference) ────────────────────────
BRANCH_MAP = {'A': 0, 'B': 1, 'C': 2}
CUSTOMER_MAP = {'Member': 0, 'Normal': 1}
GENDER_MAP = {'Female': 0, 'Male': 1}
PRODUCT_MAP = {
    'Electronic accessories': 0,
    'Fashion accessories'   : 1,
    'Food and beverages'    : 2,
    'Health and beauty'     : 3,
    'Home and lifestyle'    : 4,
    'Sports and travel'     : 5
}
PAYMENT_MAP = {'Cash': 0, 'Credit card': 1, 'Ewallet': 2}

# ── Helper function ───────────────────────────────────────
def prepare_features(data):
    """Convert raw input into model-ready feature vector"""
    
    branch       = BRANCH_MAP.get(data.get('branch', 'A'), 0)
    customer_type= CUSTOMER_MAP.get(data.get('customer_type', 'Normal'), 1)
    gender       = GENDER_MAP.get(data.get('gender', 'Female'), 0)
    product_line = PRODUCT_MAP.get(data.get('product_line', 'Health and beauty'), 3)
    unit_price   = float(data.get('unit_price', 50.0))
    quantity     = int(data.get('quantity', 5))
    payment      = PAYMENT_MAP.get(data.get('payment', 'Ewallet'), 2)
    rating       = float(data.get('rating', 7.0))
    hour         = int(data.get('hour', 14))
    is_weekend   = int(data.get('is_weekend', 0))
    day_num      = int(data.get('day_num', 2))
    month_num    = int(data.get('month_num', 6))

    # Calculate derived features
    total          = unit_price * quantity * 1.05
    price_quantity = unit_price * quantity

    # Build feature array in same order as training
    features = pd.DataFrame([[
        branch, customer_type, gender, product_line,
        unit_price, quantity, total, payment, rating,
        hour, is_weekend, day_num, month_num, price_quantity
    ]], columns=[
        'Branch', 'Customer type', 'Gender', 'Product line',
        'Unit price', 'Quantity', 'Total', 'Payment', 'Rating',
        'hour', 'is_weekend', 'day_num', 'month_num', 'price_quantity'
    ])

    # Scale features using same scaler from Phase 3
    features_scaled = scaler.transform(features)
    return features_scaled

# ── API Routes ────────────────────────────────────────────

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status' : 'running',
        'message': 'Supermarket Sales Forecasting API',
        'version': '1.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    Expects JSON: {branch, customer_type, gender, product_line,
                   unit_price, quantity, payment, rating,
                   hour, is_weekend, day_num, month_num}
    Returns JSON: {predicted_gross_income, input_summary}
    """
    try:
        data     = request.get_json()
        features = prepare_features(data)
        prediction = float(model.predict(features)[0])

        return jsonify({
            'success'              : True,
            'predicted_gross_income': round(prediction, 2),
            'currency'             : 'USD',
            'input_summary'        : {
                'branch'      : data.get('branch'),
                'product_line': data.get('product_line'),
                'quantity'    : data.get('quantity'),
                'unit_price'  : data.get('unit_price'),
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/products', methods=['GET'])
def get_products():
    """Returns list of available product lines"""
    return jsonify({
        'product_lines': list(PRODUCT_MAP.keys()),
        'branches'     : list(BRANCH_MAP.keys()),
        'payments'     : list(PAYMENT_MAP.keys())
    })

@app.route('/history', methods=['GET'])
def get_history():
    """Returns sample historical data for the History screen"""
    sample_data = [
        {'date': '2019-03-01', 'branch': 'A', 'product_line': 'Health and beauty',
         'actual': 35.57, 'predicted': 34.20},
        {'date': '2019-03-02', 'branch': 'B', 'product_line': 'Food and beverages',
         'actual': 87.32, 'predicted': 89.10},
        {'date': '2019-03-03', 'branch': 'C', 'product_line': 'Fashion accessories',
         'actual': 62.14, 'predicted': 60.80},
        {'date': '2019-03-04', 'branch': 'A', 'product_line': 'Sports and travel',
         'actual': 124.50, 'predicted': 121.30},
        {'date': '2019-03-05', 'branch': 'B', 'product_line': 'Electronic accessories',
         'actual': 45.20, 'predicted': 47.60},
        {'date': '2019-03-06', 'branch': 'C', 'product_line': 'Home and lifestyle',
         'actual': 98.75, 'predicted': 95.40},
        {'date': '2019-03-07', 'branch': 'A', 'product_line': 'Health and beauty',
         'actual': 156.30, 'predicted': 158.90},
    ]
    return jsonify({'history': sample_data})

# ── Run server ────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)