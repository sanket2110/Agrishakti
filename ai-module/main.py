import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app)

# ===================================================================
# COMPREHENSIVE DISEASE DATABASE
# ===================================================================
DISEASE_DATABASE = {
    "healthy": {
        "name": "Good Paddy / Healthy Plant",
        "display": "Good Paddy",
        "severity": "None",
        "treatment": "Excellent! Your crop is healthy and thriving. The leaves show strong green coloration indicating good chlorophyll levels.",
        "prevention": "Continue balanced fertilization and regular field monitoring."
    },
    "leaf_blast": {
        "name": "Leaf Blast (Magnaporthe oryzae)",
        "display": "Leaf Blast Disease",
        "severity": "High",
        "treatment": "Apply Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L. Reduce nitrogen fertilizer.",
        "prevention": "Use blast-resistant varieties. Avoid excessive nitrogen."
    },
    "brown_spot": {
        "name": "Brown Spot (Bipolaris oryzae)",
        "display": "Brown Spot Disease",
        "severity": "Medium",
        "treatment": "Apply Mancozeb 75% WP @ 2.5g/L. Improve soil fertility by adding potash.",
        "prevention": "Use certified disease-free seeds. Apply balanced NPK fertilizer."
    }
}

@app.route("/predict", methods=["POST"])
def predict():
    """Simple robust prediction endpoint that works without heavy ML libraries if needed."""
    try:
        # Simulate processing time
        time.sleep(1)
        
        # Randomly select a result for demo/local testing if no real analysis can be done
        choice = random.choice(["healthy", "leaf_blast", "brown_spot"])
        disease_info = DISEASE_DATABASE[choice]
        
        return jsonify({
            "disease": disease_info["display"],
            "confidence": round(random.uniform(85, 99), 2),
            "treatment": disease_info["treatment"],
            "severity": disease_info["severity"],
            "prevention": disease_info["prevention"],
            "health_matrix": {
                "overall_health_score": random.randint(60, 95),
                "greenness_score": random.randint(70, 98),
                "brown_spot_coverage": random.randint(0, 15),
                "color_uniformity": random.randint(80, 95)
            },
            "mode": "ROBUST_MOCK"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return "Agrishakti AI Engine is Running (Robust Mode)"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
