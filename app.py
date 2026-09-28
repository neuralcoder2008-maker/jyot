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

# Try latest Gemini models in priority order
model = None
if api_key:
    for model_name in ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-pro']:
        try:
            model = genai.GenerativeModel(model_name)
            print(f"Using model: {model_name}")
            break
        except Exception as e:
            print(f"Model {model_name} unavailable: {e}")
            continue

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

@app.route("/generate", methods=["POST"])
def generate():
    if not model:
        return jsonify({"error": "Gemini API key not configured or model unavailable"}), 500

    data = request.json
    user_prompt = data.get("prompt", "")

    prompt = f"""
    You are an expert architect and thermal engineer. 
    The user has given you the following design prompt for a climate-adaptive thermal shelter:
    "{user_prompt}"

    Based on their prompt, determine the optimal architectural parameters. For example, if they mention a "cold side" or cold climate, choose thick timber frames and sloped solar roofs. If they mention a "hot side" or desert, choose rammed earth, courtyard style, and cool roofs.

    Return ONLY a valid JSON object with the following keys, and no other text or formatting:
    - style (string, one of: "modern_box", "courtyard", "a_frame", "stilted")
    - floors (integer, 1-3)
    - length (float, e.g., 10.0)
    - width (float, e.g., 8.0)
    - height (float, e.g., 3.0)
    - wallMaterial (string, one of: "pcm_biowax", "aerated_concrete", "rammed_earth", "timber_frame", "brick_cavity", "galvanized_sheet")
    - roofType (string, one of: "green_roof", "cool_roof", "sloped_solar", "corrugated_iron")
    - glazingRatio (string, e.g., "15", "25", "40")
    - environment (string, one of: "desert", "snow", "forest", "tropical", "standard")
    - rationale (string, explain how your design fulfills the user's prompt)
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        generated_params = json.loads(text)
        return jsonify(generated_params)
    except Exception as e:
        print("Error calling Gemini in /generate:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("AI Optimization Backend running on port 3000...")
    app.run(port=3000, debug=True)
