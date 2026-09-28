import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use gemini-2.5-flash as the default model
try:
    model = genai.GenerativeModel('gemini-2.5-flash')
except:
    model = None

@app.route("/optimize", methods=["POST"])
def optimize():
    if not model:
        return jsonify({"error": "Gemini API key not configured or model unavailable"}), 500

    data = request.json
    climate_name = data.get("climateName", "Unknown")
    temp = data.get("temp", 0)
    humidity = data.get("humidity", 0)
    solar = data.get("solar", 0)
    wind = data.get("wind", "Unknown")

    prompt = f"""
    You are an expert architect and thermal engineer. 
    A user wants to design a climate-adaptive thermal shelter in {climate_name}.
    Current climate conditions: Temperature: {temp}°C, Humidity: {humidity}%, Solar Radiation: {solar} W/m², Wind: {wind}.

    Please suggest the optimal parameters for a shelter to minimize energy usage and maximize thermal comfort.
    Return ONLY a valid JSON object with the following keys, and no other text or formatting:
    - orientation (integer, 0-360)
    - length (float, e.g., 7.0)
    - width (float, e.g., 4.5)
    - height (float, e.g., 2.8)
    - wallMaterial (string, one of: "pcm_biowax", "aerated_concrete", "rammed_earth", "timber_frame", "brick_cavity", "galvanized_sheet")
    - roofType (string, one of: "green_roof", "cool_roof", "sloped_solar", "corrugated_iron")
    - glazingRatio (string, e.g., "15", "25", "40")
    - rationale (string, brief explanation of why these choices are best for the climate)
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        optimized_params = json.loads(text)
        return jsonify(optimized_params)
    except Exception as e:
        print("Error calling Gemini:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("AI Optimization Backend running on port 3000...")
    app.run(port=3000, debug=True)
