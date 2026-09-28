import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini if valid key provided
api_key = os.getenv("GEMINI_API_KEY", "").strip()
model = None

if api_key and api_key != "your_api_key_here":
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        for model_name in ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']:
            try:
                model = genai.GenerativeModel(model_name)
                print(f"Loaded Gemini model: {model_name}")
                break
            except Exception as e:
                print(f"Model {model_name} failed to load: {e}")
                continue
    except Exception as e:
        print(f"Gemini initialization error: {e}")
        model = None

# Smart Architectural Heuristic Engine (Autonomous fallback if Gemini key unset or quota exceeded)
def heuristic_generate(prompt_str):
    p = prompt_str.lower()
    
    # 1. Determine Biome & Climate
    if any(k in p for k in ['desert', 'sand', 'thar', 'sahara', 'jodhpur', 'arid', 'rajasthan', 'hot dry', 'dune']):
        biome = 'desert'
        style = 'courtyard'
        wall = 'rammed_earth'
        roof = 'cool_roof'
        glazing = '15'
        l, w, h = 10.0, 8.0, 3.0
        floors = 1
        rationale = "Generated Desert Thermal Shelter: Built with thick 400mm Rammed Earth walls for high thermal mass time-lag (damping 45°C peak ambient heat), a shaded central courtyard promoting stack-effect cooling, high-albedo cool roof (SRI 104), and minimal 15% glazing with deep overhangs to block direct solar radiation."
    elif any(k in p for k in ['snow', 'cold', 'mountain', 'alpine', 'winter', 'himalaya', 'shimla', 'leh', 'kashmir', 'freez', 'ice']):
        biome = 'snow'
        style = 'a_frame'
        wall = 'timber_frame'
        roof = 'sloped_solar'
        glazing = '25'
        l, w, h = 8.0, 5.5, 3.6
        floors = 2
        rationale = "Generated Cold Alpine Shelter: High-pitch A-Frame roof prevents dangerous snow loads and accommodates high-efficiency photovoltaic solar capture. Multi-layer Timber Frame envelope with aerogel vacuum insulation minimizes conductive heat loss, south-facing 25% glazing captures passive solar heat gains, and an airtight vestibule prevents draft ingress."
    elif any(k in p for k in ['tropical', 'coast', 'beach', 'humid', 'sea', 'flood', 'monsoon', 'kerala', 'chennai', 'water']):
        biome = 'tropical'
        style = 'stilted'
        wall = 'aerated_concrete'
        roof = 'green_roof'
        glazing = '40'
        l, w, h = 9.0, 6.0, 3.2
        floors = 1
        rationale = "Generated Coastal / Monsoon Thermal Shelter: Engineered on 2.0m elevated stilts to resist storm flooding and maximize low-level sea-breeze airflow beneath the floor. Breathable autoclaved aerated concrete walls prevent mold and moisture accumulation, while a living green roof lowers ceiling temperature by up to 6.8°C through evapotranspiration."
    elif any(k in p for k in ['forest', 'wood', 'hill', 'green', 'jungle', 'cabin', 'valleys', 'nature']):
        biome = 'forest'
        style = 'modern_box'
        wall = 'timber_frame'
        roof = 'green_roof'
        glazing = '30'
        l, w, h = 8.5, 5.0, 3.0
        floors = 1
        rationale = "Generated Forest Ecosystem Shelter: Blends sustainable mass timber framing with high-performance insulation, deep eaves for shading, and a living vegetation roof that absorbs rainwater and harmonizes with the surrounding forest microclimate."
    else:
        biome = 'standard'
        style = 'modern_box'
        wall = 'pcm_biowax'
        roof = 'cool_roof'
        glazing = '25'
        l, w, h = 7.5, 5.0, 3.0
        floors = 1
        rationale = "Generated High-Efficiency Composite Shelter: Utilizes cutting-edge Phase Change Material (PCM) bio-wax composite walls to absorb surplus daytime solar enthalpy and discharge it during cool evening hours, coupled with a high-reflectivity cool roof and cross-ventilation fenestration."

    # Dimensions modifications if specified in prompt
    if 'tall' in p or 'two story' in p or '2 floor' in p:
        floors = 2
        h = max(h, 3.2)
    elif 'three floor' in p or '3 floor' in p:
        floors = 3
        h = max(h, 3.4)

    if 'large' in p or 'big' in p or 'spacious' in p:
        l = max(l, 12.0)
        w = max(w, 7.5)
    elif 'compact' in p or 'small' in p or 'tiny' in p:
        l = min(l, 5.0)
        w = min(w, 3.5)

    return {
        "style": style,
        "floors": floors,
        "length": l,
        "width": w,
        "height": h,
        "wallMaterial": wall,
        "roofType": roof,
        "glazingRatio": glazing,
        "environment": biome,
        "rationale": rationale
    }

def heuristic_optimize(temp, humidity, solar, wind, climate_name):
    c_lower = str(climate_name).lower()
    
    # Analyze thermal condition
    if temp < 15 or 'cold' in c_lower or 'shimla' in c_lower or 'leh' in c_lower:
        # Cold mountain climate: maximize southern exposure, high insulation, steep sloped solar roof
        return {
            "orientation": 180, # True South for maximum solar gain
            "length": 8.0,
            "width": 5.0,
            "height": 3.2,
            "wallMaterial": "timber_frame",
            "roofType": "sloped_solar",
            "glazingRatio": "25",
            "rationale": "Cold climate optimization: 180° South orientation captures peak low-angle solar irradiance. Timber-frame envelope provides exceptional thermal resistance (U=0.22 W/m²K), sloped solar roof sheds heavy snow while generating passive energy, and airtight fenestration prevents heat leakage."
        }
    elif temp > 32 or 'hot' in c_lower or 'jodhpur' in c_lower or 'desert' in c_lower:
        # Hot & Arid: minimize east-west facades, thick mass, cool roof, small glazing
        return {
            "orientation": 0, # North-South alignment minimizes harsh morning/afternoon low-angle sun
            "length": 9.5,
            "width": 7.0,
            "height": 2.8,
            "wallMaterial": "rammed_earth",
            "roofType": "cool_roof",
            "glazingRatio": "15",
            "rationale": "Hot & arid climate optimization: North-South orientation reduces solar radiation on east/west facades. 400mm Rammed Earth provides 10-hour thermal lag, high-albedo cool roof reflects 85% of solar radiation, and reduced 15% glazing with deep louvers minimizes greenhouse heat buildup."
        }
    elif humidity > 65 or 'humid' in c_lower or 'chennai' in c_lower or 'coastal' in c_lower:
        # Warm & Humid: maximize cross-ventilation with prevailing wind, green roof
        return {
            "orientation": 90, # Perpendicular to coastal wind for cross-flow
            "length": 8.5,
            "width": 5.0,
            "height": 3.0,
            "wallMaterial": "aerated_concrete",
            "roofType": "green_roof",
            "glazingRatio": "40",
            "rationale": "Warm & humid coastal optimization: Orientation aligned perpendicular to sea breezes maximizes natural cross-ventilation. 40% operable glazing creates cross-drafts, breathable aerated concrete resists mold, and an extensive green roof dissipates heat through evapotranspiration."
        }
    else:
        # Composite / Subtropical
        return {
            "orientation": 165,
            "length": 7.0,
            "width": 4.5,
            "height": 2.8,
            "wallMaterial": "pcm_biowax",
            "roofType": "cool_roof",
            "glazingRatio": "25",
            "rationale": "Composite climate optimization: Phase-Change Material (PCM) bio-wax composite buffers wide diurnal temperature swings (day/night delta > 14°C). Orientation at 165° balances seasonal solar gain and natural ventilation."
        }

@app.route("/optimize", methods=["POST"])
def optimize():
    data = request.json or {}
    climate_name = data.get("climateName", "Unknown")
    temp = float(data.get("temp", 20.0))
    humidity = float(data.get("humidity", 50.0))
    solar = float(data.get("solar", 500.0))
    wind = str(data.get("wind", "Unknown"))

    # Try Gemini if model is configured
    if model:
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
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                text = match.group(0)
            optimized_params = json.loads(text)
            return jsonify(optimized_params)
        except Exception as e:
            print("Gemini API call failed, falling back to autonomous thermal engine:", e)

    # Autonomous architectural heuristic fallback
    return jsonify(heuristic_optimize(temp, humidity, solar, wind, climate_name))

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json or {}
    user_prompt = data.get("prompt", "")

    # Try Gemini if model is configured
    if model:
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
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                text = match.group(0)
            generated_params = json.loads(text)
            return jsonify(generated_params)
        except Exception as e:
            print("Gemini API call failed in /generate, falling back to autonomous thermal engine:", e)

    # Autonomous architectural heuristic fallback
    return jsonify(heuristic_generate(user_prompt))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "gemini_active": model is not None,
        "engine": "Gemini AI" if model else "Autonomous Architectural Heuristic Engine"
    })

if __name__ == "__main__":
    print("AI Optimization Backend running on port 3000...")
    app.run(port=3000, debug=True)
