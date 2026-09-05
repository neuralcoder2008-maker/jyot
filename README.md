# Climate-Adaptive Thermal Shelter Designer
### Smart India Hackathon 2026 • Problem Statement ID: SIH26051
**Software Based Model Development for Design of Area Specific Shelter for Thermal Comfort Maintenance**  
**Team:** Neural Coder  
**GitHub Account:** [neuralcoder2008-maker](https://github.com/neuralcoder2008-maker)

---

## 📖 Overview
The **Climate-Adaptive Thermal Shelter Designer** is an interactive software platform that enables architects, disaster-relief planners, and engineers to configure area-specific shelters optimized for thermal comfort across diverse microclimates. Instead of relying on generic one-size-fits-all shelters, this tool computes diurnal thermal fluctuations, solar heat gains, and envelope insulation to maintain indoor comfort according to **ASHRAE Standard 55**.

---

## 🌟 Key Features

### 1. Interactive 3D Digital Twin (Three.js)
- **5 Visualization Modes**:
  - 🏢 **Realistic Architectural**: Natural materials, timber/AAC finishes, realistic lighting.
  - 🔥 **Thermal Heatmap**: False-color thermography showing surface heat fluxes.
  - ☀️ **Solar Exposure**: Evaluates direct solar radiation across south vs north facades.
  - 🩻 **X-Ray Structure**: Translucent envelope revealing the interior Trombe thermal mass wall.
  - 💨 **CFD Airflow**: Animated wind particle streamlines modeling cross-ventilation.
- **Architectural Elements**: Doors, dual-pane windows, internal basalt thermal mass wall, ground compass rose, and trees.
- **Dynamic Sun & Shadows**: Real-time solar azimuth and elevation tracking from 6:00 to 18:00.
- **Exploded View / Roof Lift**: Inspect interior partitions and envelope layers.

### 2. Location & Microclimate Intelligence
- **Calibrated Regions**: Shimla (Cold High Altitude), Jodhpur (Hot & Arid), Chennai (Humid Coastal), Nagpur (Subtropical), Leh (Cold Alpine Extreme).
- **Live Open-Meteo API Sync**: Custom latitude & longitude input for live terrestrial weather forecasts.
- **NASA POWER Model**: Surface solar radiation and atmospheric temperature feeds.
- **Offline Demo Mode**: Calibrated local datasets for examiner demonstrations.

### 3. Dual Thermal Simulation Engines (Chart.js)
- **24-Hour Diurnal Temperature Curve**: Hourly outdoor ambient vs indoor passive response with **ASHRAE 55** comfort percentage scoring.
- **Hourly Heat Balance Breakdown**: Stacked bar chart detailing solar heat gains (+W/m²), conduction loss/gain, and ventilation exchange.

### 4. AI Multi-Objective Optimization Engine
- Evaluates multi-parameter trade-offs between thermal mass, insulation depth, and orientation.
- 1-click **"Apply This Configuration"** to calibrate all sliders and 3D meshes.

### 5. Benchmark Design Comparison & Sustainability
- Side-by-side comparison matrix comparing standard uninsulated shelters vs adaptive designs (+12.6°C passive lift, 72% thermal damping, -74% HVAC reduction).
- **Vulnerable Population Protection Index** (Grade A+).
- **Passive Cooling Economics** (₹18,400 / yr saved).

### 6. Official SIH26051 Project Report & Export
- Formatted technical evaluation summary dossier with 1-click print/PDF export styling.

---

## 🚀 Getting Started

### Local Preview
You can run this project locally using Python's built-in web server:

```bash
# Clone or navigate to the repository
git clone https://github.com/neuralcoder2008-maker/climate-adaptive-thermal-shelter.git
cd climate-adaptive-thermal-shelter

# Start local server on port 8000
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🌐 Deploy to GitHub Pages

1. Create a repository named `climate-adaptive-thermal-shelter` on your GitHub profile: [https://github.com/new](https://github.com/new).
2. Push this codebase to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial release: Climate-Adaptive Thermal Shelter Designer (SIH26051)"
   git branch -M main
   git remote add origin https://github.com/neuralcoder2008-maker/climate-adaptive-thermal-shelter.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Choose `main` branch and `/ (root)` folder, then click **Save**.
4. Your website will be live at:
   `https://neuralcoder2008-maker.github.io/climate-adaptive-thermal-shelter/`

---

## 📁 Repository Structure
```
├── index.html        # Entrypoint login & authentication page
├── styles.css        # Clean light-mode design system & glassmorphism styles
├── script.js         # Authentication, validation, and redirection logic
├── dashboard.html    # Main SIH studio workspace, 3D canvas, charts, reports
├── dashboard.css     # Studio layout, 3D toolbar, simulation & responsive styles
├── dashboard.js      # Core Three.js twin, Chart.js simulation & optimization engine
├── background.jpg    # Architectural backdrop asset
├── .gitignore        # Git ignore specifications
└── README.md         # Documentation & setup guide
```

---

## 📜 Standards & Research References
- **ASHRAE Standard 55**: Thermal Environmental Conditions for Human Occupancy
- **Open-Meteo & NASA POWER APIs**: Meteorological & Solar Radiation Data
- **EnergyPlus & CBE Thermal Comfort Tool**: Passive Building Climatology & Diurnal Calculations
- **Phase-Change Materials (PCMs)**: Latent Heat Thermal Energy Storage
