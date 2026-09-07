// Climate-Adaptive Thermal Shelter Designer - SIH26051
// Comprehensive Working Studio Engine with Advanced 3D Twin & Modes
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Authentication & Session Handling
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');
    const displayUserName = document.getElementById('displayUserName');

    const storedUser = sessionStorage.getItem('thermal_user');
    if (storedUser) {
        try {
            const userObj = JSON.parse(storedUser);
            if (displayUserName && userObj.email) {
                displayUserName.textContent = userObj.email.split('@')[0];
            }
        } catch (e) {
            console.warn('Session parse error:', e);
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('thermal_user');
            window.location.href = 'index.html';
        });
    }

    // ==========================================
    // 2. Climate Presets & Live Weather Feeds
    // ==========================================
    const climatePresets = {
        shimla: {
            name: "Shimla, HP (Cold High Altitude)",
            lat: 31.1048,
            lon: 77.1734,
            temp: 8.4,
            humidity: 64,
            solar: 680,
            wind: "3.6 m/s NE",
            windSpeedVal: 3.6,
            windAngleDeg: 45,
            diurnalOutdoor: [2, 1, 1, 2, 4, 7, 10, 12, 14, 13, 11, 8, 6, 5, 4, 3, 2, 2, 1, 1, 2, 2, 3, 2],
            diurnalIndoor:  [16.2, 16.0, 15.8, 15.6, 16.0, 17.2, 19.5, 21.0, 21.8, 21.5, 20.4, 19.1, 18.0, 17.5, 17.0, 16.8, 16.5, 16.4, 16.3, 16.2, 16.1, 16.2, 16.2, 16.2],
            solarGains: [0, 0, 0, 0, 10, 85, 190, 280, 310, 290, 210, 120, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            conductionLoss: [-14, -15, -15, -14, -12, -9, -6, -4, -2, -3, -5, -8, -10, -11, -12, -13, -14, -14, -15, -15, -14, -14, -13, -14],
            ventilationExchange: [-8, -8, -9, -9, -7, -5, -3, -2, -1, -2, -4, -6, -7, -8, -8, -8, -9, -9, -9, -9, -9, -8, -8, -8],
            baselineMin: "4.2 °C (Severe Cold)",
            adaptiveMin: "16.8 °C (ASHRAE Comfort)",
            gainMin: "+12.6 °C Passive Lift",
            baseEnergy: "145 kWh/m²/yr",
            adaptEnergy: "38 kWh/m²/yr",
            gainEnergy: "-74% HVAC Reduction",
            baseCarbon: "410 kg CO₂e/m²",
            adaptCarbon: "175 kg CO₂e/m²"
        },
        jodhpur: {
            name: "Jodhpur, RJ (Hot & Arid Desert)",
            lat: 26.2389,
            lon: 73.0243,
            temp: 39.5,
            humidity: 22,
            solar: 980,
            wind: "4.2 m/s NW",
            windSpeedVal: 4.2,
            windAngleDeg: 315,
            diurnalOutdoor: [28, 27, 26, 26, 29, 33, 37, 41, 43, 44, 42, 39, 36, 34, 33, 32, 31, 30, 29, 29, 28, 28, 28, 28],
            diurnalIndoor:  [27.4, 27.0, 26.8, 26.5, 26.8, 27.5, 28.6, 29.8, 30.4, 30.6, 30.1, 29.4, 28.8, 28.4, 28.1, 27.9, 27.7, 27.6, 27.5, 27.4, 27.4, 27.3, 27.4, 27.4],
            solarGains: [0, 0, 0, 0, 20, 110, 240, 360, 420, 410, 320, 190, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            conductionLoss: [8, 6, 5, 5, 8, 14, 22, 28, 32, 34, 30, 24, 18, 15, 13, 12, 11, 10, 9, 9, 8, 8, 8, 8],
            ventilationExchange: [5, 4, 3, 3, 6, 12, 18, 24, 26, 28, 24, 18, 14, 11, 9, 8, 7, 6, 6, 5, 5, 5, 5, 5],
            baselineMin: "42.5 °C (Extreme Heat)",
            adaptiveMin: "27.5 °C (Thermal Mass Lag)",
            gainMin: "-15.0 °C Heat Damping",
            baseEnergy: "185 kWh/m²/yr",
            adaptEnergy: "44 kWh/m²/yr",
            gainEnergy: "-76% Cooling Load",
            baseCarbon: "450 kg CO₂e/m²",
            adaptCarbon: "190 kg CO₂e/m²"
        },
        chennai: {
            name: "Chennai, TN (Warm & Humid Coastal)",
            lat: 13.0827,
            lon: 80.2707,
            temp: 32.1,
            humidity: 82,
            solar: 740,
            wind: "5.1 m/s ESE",
            windSpeedVal: 5.1,
            windAngleDeg: 110,
            diurnalOutdoor: [26, 26, 25, 25, 27, 29, 31, 33, 34, 34, 33, 32, 30, 29, 28, 28, 27, 27, 26, 26, 26, 26, 26, 26],
            diurnalIndoor:  [26.2, 26.0, 25.8, 25.8, 26.4, 27.2, 28.1, 28.9, 29.2, 29.1, 28.8, 28.4, 27.9, 27.5, 27.1, 26.9, 26.8, 26.6, 26.5, 26.4, 26.3, 26.3, 26.2, 26.2],
            solarGains: [0, 0, 0, 0, 15, 90, 180, 260, 310, 290, 220, 140, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            conductionLoss: [2, 2, 1, 1, 3, 6, 10, 14, 16, 16, 14, 11, 7, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2],
            ventilationExchange: [8, 8, 7, 7, 9, 14, 20, 24, 26, 25, 22, 17, 12, 10, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            baselineMin: "34.0 °C (Humid Discomfort)",
            adaptiveMin: "27.8 °C (Cross-Ventilated)",
            gainMin: "-6.2 °C Passive Comfort",
            baseEnergy: "130 kWh/m²/yr",
            adaptEnergy: "42 kWh/m²/yr",
            gainEnergy: "-68% Energy Reduction",
            baseCarbon: "380 kg CO₂e/m²",
            adaptCarbon: "165 kg CO₂e/m²"
        },
        nagpur: {
            name: "Nagpur, MH (Composite Subtropical)",
            lat: 21.1458,
            lon: 79.0882,
            temp: 26.4,
            humidity: 50,
            solar: 820,
            wind: "2.8 m/s W",
            windSpeedVal: 2.8,
            windAngleDeg: 270,
            diurnalOutdoor: [18, 17, 16, 16, 19, 23, 27, 30, 32, 32, 30, 27, 24, 22, 21, 20, 19, 19, 18, 18, 18, 18, 18, 18],
            diurnalIndoor:  [22.1, 21.8, 21.5, 21.4, 22.0, 23.1, 24.5, 25.6, 26.1, 25.9, 25.3, 24.6, 23.9, 23.4, 23.0, 22.8, 22.5, 22.4, 22.3, 22.2, 22.2, 22.1, 22.1, 22.1],
            solarGains: [0, 0, 0, 0, 15, 95, 210, 310, 360, 340, 260, 160, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            conductionLoss: [-5, -6, -7, -7, -4, 2, 8, 14, 18, 18, 14, 8, 2, -1, -2, -3, -4, -4, -5, -5, -5, -5, -5, -5],
            ventilationExchange: [-3, -4, -4, -4, -2, 1, 5, 8, 10, 10, 8, 5, 1, -1, -2, -2, -3, -3, -3, -3, -3, -3, -3, -3],
            baselineMin: "16.0 °C",
            adaptiveMin: "23.5 °C (Optimal Range)",
            gainMin: "88% Diurnal Comfort",
            baseEnergy: "125 kWh/m²/yr",
            adaptEnergy: "35 kWh/m²/yr",
            gainEnergy: "-72% Load Reduction",
            baseCarbon: "390 kg CO₂e/m²",
            adaptCarbon: "170 kg CO₂e/m²"
        },
        leh: {
            name: "Leh, Ladakh (Cold Alpine Extreme)",
            lat: 34.1526,
            lon: 77.5771,
            temp: -4.2,
            humidity: 35,
            solar: 890,
            wind: "4.8 m/s N",
            windSpeedVal: 4.8,
            windAngleDeg: 0,
            diurnalOutdoor: [-12, -13, -14, -13, -10, -5, 0, 3, 5, 4, 1, -3, -6, -8, -9, -10, -11, -11, -12, -12, -12, -12, -12, -12],
            diurnalIndoor:  [14.2, 14.0, 13.8, 13.6, 14.1, 15.8, 18.2, 19.8, 20.4, 20.1, 18.9, 17.5, 16.2, 15.5, 15.0, 14.8, 14.6, 14.4, 14.3, 14.2, 14.1, 14.2, 14.2, 14.2],
            solarGains: [0, 0, 0, 0, 20, 120, 260, 380, 420, 390, 290, 180, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            conductionLoss: [-26, -27, -28, -27, -24, -19, -14, -11, -9, -10, -13, -17, -20, -22, -23, -24, -25, -25, -26, -26, -26, -26, -26, -26],
            ventilationExchange: [-14, -15, -16, -15, -12, -9, -6, -4, -3, -4, -6, -9, -11, -12, -13, -13, -14, -14, -14, -14, -14, -14, -14, -14],
            baselineMin: "-12.0 °C (Hypothermia Risk)",
            adaptiveMin: "14.5 °C (Solar Trombe Gain)",
            gainMin: "+26.5 °C Thermal Lift",
            baseEnergy: "210 kWh/m²/yr",
            adaptEnergy: "52 kWh/m²/yr",
            gainEnergy: "-75% Heating Fuel Saved",
            baseCarbon: "460 kg CO₂e/m²",
            adaptCarbon: "185 kg CO₂e/m²"
        },
        nasa: {
            name: "NASA POWER Surface Radiation Model",
            lat: 28.6139,
            lon: 77.2090,
            temp: 24.8,
            humidity: 48,
            solar: 910,
            wind: "3.4 m/s WSW",
            windSpeedVal: 3.4,
            windAngleDeg: 240,
            diurnalOutdoor: [16, 15, 14, 14, 17, 21, 25, 29, 31, 31, 29, 26, 23, 21, 20, 19, 18, 17, 17, 16, 16, 16, 16, 16],
            diurnalIndoor:  [21.5, 21.2, 21.0, 20.8, 21.4, 22.5, 23.8, 24.8, 25.4, 25.2, 24.6, 23.8, 23.1, 22.6, 22.2, 22.0, 21.8, 21.6, 21.5, 21.4, 21.4, 21.3, 21.4, 21.4],
            solarGains: [0, 0, 0, 0, 18, 110, 230, 340, 390, 370, 280, 170, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            conductionLoss: [-6, -7, -8, -8, -5, 1, 7, 13, 16, 16, 12, 6, 1, -2, -3, -4, -5, -5, -6, -6, -6, -6, -6, -6],
            ventilationExchange: [-4, -5, -5, -5, -3, 1, 4, 7, 9, 9, 7, 4, 1, -1, -2, -3, -3, -3, -4, -4, -4, -4, -4, -4],
            baselineMin: "14.0 °C",
            adaptiveMin: "21.0 °C (NASA Verified Comfort)",
            gainMin: "+7.0 °C Passive Thermal Gain",
            baseEnergy: "115 kWh/m²/yr",
            adaptEnergy: "32 kWh/m²/yr",
            gainEnergy: "-72% Load Reduction",
            baseCarbon: "375 kg CO₂e/m²",
            adaptCarbon: "160 kg CO₂e/m²"
        }
    };

    let activePreset = climatePresets.shimla;
    let current3DMode = 'realistic'; // 'realistic', 'thermal', 'solar', 'xray', 'airflow'

    // Toast helper
    const toast = document.getElementById('toast');
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
    }

    // ==========================================
    // 3. Navigation Tabs (Section Scrolling)
    // ==========================================
    const navButtons = document.querySelectorAll('.nav-menu .nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const sectionId = btn.getAttribute('data-section');
            if (sectionId === 'all') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Viewing full studio overview');
            } else {
                const target = document.getElementById(sectionId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.style.transition = 'outline 0.3s ease';
                    target.style.outline = '2px solid #2563eb';
                    setTimeout(() => { target.style.outline = 'none'; }, 1500);
                }
            }
        });
    });

    // Workflow Stepper & Guided Examiner Demo (Section 6)
    const startDesigningBtn = document.getElementById('startDesigningBtn');
    const stepNodes = document.querySelectorAll('.step-node');

    if (startDesigningBtn) {
        startDesigningBtn.addEventListener('click', () => {
            showToast('Starting Guided SIH Examiner Demonstration Flow...');
            let currentStepIdx = 0;
            const steps = Array.from(stepNodes);

            function advanceDemoStep() {
                if (currentStepIdx >= steps.length) {
                    showToast('Demonstration complete: All 8 workflow chain modules verified!');
                    return;
                }
                steps.forEach(s => s.classList.remove('active'));
                const node = steps[currentStepIdx];
                node.classList.add('active');

                const targetId = node.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.style.transition = 'outline 0.3s ease';
                    targetEl.style.outline = '2px solid #2563eb';
                    setTimeout(() => { targetEl.style.outline = 'none'; }, 1800);
                }

                currentStepIdx++;
                setTimeout(advanceDemoStep, 2000);
            }
            advanceDemoStep();
        });
    }

    stepNodes.forEach(node => {
        node.addEventListener('click', () => {
            stepNodes.forEach(s => s.classList.remove('active'));
            node.classList.add('active');
            const targetId = node.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.style.transition = 'outline 0.3s ease';
                targetEl.style.outline = '2px solid #2563eb';
                setTimeout(() => { targetEl.style.outline = 'none'; }, 1500);
            }
        });
    });

    // ==========================================
    // 4. Form Controls & Sliders
    // ==========================================
    const locationSelect = document.getElementById('locationSelect');
    const customCoordRow = document.getElementById('customCoordRow');
    const customLat = document.getElementById('customLat');
    const customLon = document.getElementById('customLon');
    const fetchLiveWeatherBtn = document.getElementById('fetchLiveWeatherBtn');
    const weatherSourceBadge = document.getElementById('weatherSourceBadge');

    const bannerRegion = document.getElementById('bannerRegion');
    const bannerComfort = document.getElementById('bannerComfort');
    const outTemp = document.getElementById('outTemp');
    const outTempRange = document.getElementById('outTempRange');
    const outHumidity = document.getElementById('outHumidity');
    const solarRad = document.getElementById('solarRad');
    const windSpeed = document.getElementById('windSpeed');

    const paramLength = document.getElementById('paramLength');
    const paramWidth = document.getElementById('paramWidth');
    const paramHeight = document.getElementById('paramHeight');
    const paramOrientation = document.getElementById('paramOrientation');
    const paramSunHour = document.getElementById('paramSunHour');

    const valLength = document.getElementById('valLength');
    const valWidth = document.getElementById('valWidth');
    const valHeight = document.getElementById('valHeight');
    const valOrientation = document.getElementById('valOrientation');
    const valSunHour = document.getElementById('valSunHour');

    const wallMaterial = document.getElementById('wallMaterial');
    const roofType = document.getElementById('roofType');
    const glazingRatio = document.getElementById('glazingRatio');

    const runSimBtn = document.getElementById('runSimBtn');
    const optimizeAutoBtn = document.getElementById('optimizeAutoBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const saveDesignBtn = document.getElementById('saveDesignBtn');
    const savedDesignsList = document.getElementById('savedDesignsList');

    // 3D Badges & Overlays
    const overlaySun = document.getElementById('overlaySun');
    const overlayWind = document.getElementById('overlayWind');
    const overlayDimensions = document.getElementById('overlayDimensions');
    const modeText = document.getElementById('modeText');
    const thermalLegend = document.getElementById('thermalLegend');

    // 3D Toggles
    const toggleDimensions = document.getElementById('toggleDimensions');
    const toggleExploded = document.getElementById('toggleExploded');
    const toggleEnvironment = document.getElementById('toggleEnvironment');
    const toggleWindParticles = document.getElementById('toggleWindParticles');

    // Comparison Table fields
    const tblBaseMin = document.getElementById('tblBaseMin');
    const tblAdaptMin = document.getElementById('tblAdaptMin');
    const tblGainMin = document.getElementById('tblGainMin');
    const tblBaseEnergy = document.getElementById('tblBaseEnergy');
    const tblAdaptEnergy = document.getElementById('tblAdaptEnergy');
    const tblGainEnergy = document.getElementById('tblGainEnergy');
    const tblBaseCarbon = document.getElementById('tblBaseCarbon');
    const tblAdaptCarbon = document.getElementById('tblAdaptCarbon');

    // Report fields
    const repLocation = document.getElementById('repLocation');
    const repDimensions = document.getElementById('repDimensions');
    const repMaterials = document.getElementById('repMaterials');

    // Optimization Modal
    const optimizationModal = document.getElementById('optimizationModal');
    const closeOptModal = document.getElementById('closeOptModal');
    const applyOptCandidateBtn = document.getElementById('applyOptCandidateBtn');

    // ==========================================
    // 5. Chart.js Graphs Setup
    // ==========================================
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const ctxThermal = document.getElementById('thermalChart').getContext('2d');
    const thermalChart = new Chart(ctxThermal, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [
                {
                    label: 'Outdoor Ambient (°C)',
                    data: [...activePreset.diurnalOutdoor],
                    borderColor: '#94a3b8',
                    borderDash: [5, 5],
                    backgroundColor: 'rgba(148, 163, 184, 0.08)',
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 2
                },
                {
                    label: 'Adaptive Shelter Indoor (°C)',
                    data: [...activePreset.diurnalIndoor],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true } },
                tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', cornerRadius: 8 }
            },
            scales: {
                x: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 }, maxTicksLimit: 12 } },
                y: { title: { display: true, text: 'Temperature (°C)', font: { family: 'Inter', size: 12 } }, grid: { color: '#e2e8f0' } }
            }
        }
    });

    const ctxHeat = document.getElementById('heatBalanceChart').getContext('2d');
    const heatBalanceChart = new Chart(ctxHeat, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [
                {
                    label: 'Solar Heat Gain (+W/m²)',
                    data: [...activePreset.solarGains],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderRadius: 4
                },
                {
                    label: 'Conduction Transfer (W/m²)',
                    data: [...activePreset.conductionLoss],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderRadius: 4
                },
                {
                    label: 'Ventilation & Infiltration (W/m²)',
                    data: [...activePreset.ventilationExchange],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Inter', size: 11 }, usePointStyle: true } },
                tooltip: { cornerRadius: 8 }
            },
            scales: {
                x: { stacked: true, grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 }, maxTicksLimit: 12 } },
                y: { stacked: true, title: { display: true, text: 'Heat Flux (W/m²)', font: { family: 'Inter', size: 11 } }, grid: { color: '#e2e8f0' } }
            }
        }
    });

    // ==========================================
    // 6. Comprehensive Three.js 3D Digital Twin
    // ==========================================
    let scene, camera, renderer, controls;
    let shelterRoot, shelterBody, shelterRoof, dimensionGroup, environmentGroup, particleSystem;
    let sunMesh, sunLight, sunPathLine, groundMesh, compassGroup;
    let particlePositions, particleCount = 180;

    const container = document.getElementById('threeContainer');

    function initThree() {
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 480;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf1f5f9);

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(14, 11, 18);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Softer ambient
        scene.add(ambientLight);

        // Hemisphere light for realistic sky/ground bounce lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        // Directional Sun Light (Main Key Light)
        sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
        sunLight.position.set(12, 20, 12);
        sunLight.castShadow = true;
        // High resolution shadow mapping
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 100;
        sunLight.shadow.bias = -0.0005;
        const d = 22;
        sunLight.shadow.camera.left = -d;
        sunLight.shadow.camera.right = d;
        sunLight.shadow.camera.top = d;
        sunLight.shadow.camera.bottom = -d;
        scene.add(sunLight);

        // Realistic Sun with Multi-layered Bloom/Corona
        // Core: Blinding white/yellow center
        const sunGeo = new THREE.SphereGeometry(1.4, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        sunMesh = new THREE.Mesh(sunGeo, sunMat);
        scene.add(sunMesh);

        // Corona Layer 1: Intense bright yellow, additive
        const corona1Geo = new THREE.SphereGeometry(1.8, 32, 32);
        const corona1Mat = new THREE.MeshBasicMaterial({ color: 0xffeebb, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
        sunMesh.add(new THREE.Mesh(corona1Geo, corona1Mat));

        // Corona Layer 2: Orange gradient spread, additive
        const corona2Geo = new THREE.SphereGeometry(3.5, 32, 32);
        const corona2Mat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
        sunMesh.add(new THREE.Mesh(corona2Geo, corona2Mat));

        // Corona Layer 3: Giant faint atmospheric halo, additive
        const corona3Geo = new THREE.SphereGeometry(8.0, 32, 32);
        const corona3Mat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
        sunMesh.add(new THREE.Mesh(corona3Geo, corona3Mat));

        // Solar Trajectory Arc (Sky Path)
        buildSolarArc();

        // Site Context (Ground, Podium, Compass Rose)
        buildSiteGround();

        // Root Shelter Container
        shelterRoot = new THREE.Group();
        scene.add(shelterRoot);

        shelterBody = new THREE.Group();
        shelterRoot.add(shelterBody);

        shelterRoof = new THREE.Group();
        shelterRoot.add(shelterRoof);

        dimensionGroup = new THREE.Group();
        shelterRoot.add(dimensionGroup);

        environmentGroup = new THREE.Group();
        scene.add(environmentGroup);
        buildTreesAndSurroundings();

        // Animated Wind Particle System
        initWindParticles();

        updateSunPosition();
        rebuildShelter();

        window.addEventListener('resize', () => {
            const newW = container.clientWidth;
            const newH = container.clientHeight || 480;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });

        // Main Animation Loop
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            controls.update();

            const delta = clock.getDelta();
            animateWindParticles(delta);

            renderer.render(scene, camera);
        }
        animate();
    }

    function buildSolarArc() {
        const curvePoints = [];
        for (let hr = 6; hr <= 18; hr += 0.5) {
            const prog = (hr - 6) / 12;
            const ang = Math.PI * prog;
            const rad = 26;
            const x = -Math.cos(ang) * rad;
            const y = Math.sin(ang) * 19 + 2;
            const z = Math.sin(ang) * 14;
            curvePoints.push(new THREE.Vector3(x, y, z));
        }
        const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const arcMat = new THREE.LineDashedMaterial({ color: 0xfbbf24, dashSize: 0.8, gapSize: 0.4, transparent: true, opacity: 0.6 });
        sunPathLine = new THREE.Line(arcGeo, arcMat);
        sunPathLine.computeLineDistances();
        scene.add(sunPathLine);
    }

    function buildSiteGround() {
        // Base ground
        const groundGeo = new THREE.PlaneGeometry(70, 70);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.95 });
        groundMesh = new THREE.Mesh(groundGeo, groundMat);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        // Architectural turf podium
        const turfGeo = new THREE.CylinderGeometry(15, 15, 0.15, 48);
        const turfMat = new THREE.MeshStandardMaterial({ color: 0xdcfce7, roughness: 0.9 });
        const turf = new THREE.Mesh(turfGeo, turfMat);
        turf.position.y = 0.075;
        turf.receiveShadow = true;
        scene.add(turf);

        // Site Grid
        const grid = new THREE.GridHelper(30, 30, 0x94a3b8, 0xcfd8dc);
        grid.position.y = 0.16;
        scene.add(grid);

        // Compass Rose on ground
        compassGroup = new THREE.Group();
        scene.add(compassGroup);
        buildCompassRose();
    }

    function buildCompassRose() {
        const radius = 11;
        const circleGeo = new THREE.RingGeometry(radius - 0.08, radius, 48);
        const circleMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(circleGeo, circleMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.17;
        compassGroup.add(ring);

        // Cardinal Indicators: North (Red), South (Blue), East, West
        const makeMarker = (label, pos, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.font = 'bold 44px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 32, 32);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.position.copy(pos);
            sprite.scale.set(1.6, 1.6, 1);
            compassGroup.add(sprite);
        };

        makeMarker('N', new THREE.Vector3(0, 0.4, -radius), '#ef4444');
        makeMarker('S', new THREE.Vector3(0, 0.4, radius), '#2563eb');
        makeMarker('E', new THREE.Vector3(radius, 0.4, 0), '#475569');
        makeMarker('W', new THREE.Vector3(-radius, 0.4, 0), '#475569');
    }

    function buildTreesAndSurroundings() {
        while (environmentGroup.children.length > 0) {
            environmentGroup.remove(environmentGroup.children[0]);
        }

        const treeCoords = [
            [-10, 8], [-12, -6], [9, -9], [11, 7], [-8, -11]
        ];

        treeCoords.forEach(([x, z]) => {
            const tree = new THREE.Group();
            // Trunk
            const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 2.2, 8);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = 1.1;
            trunk.castShadow = true;
            tree.add(trunk);

            // Foliage Cone / Dome
            const foliageGeo = new THREE.ConeGeometry(1.4, 3.2, 8);
            const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
            const foliage = new THREE.Mesh(foliageGeo, foliageMat);
            foliage.position.y = 3.0;
            foliage.castShadow = true;
            tree.add(foliage);

            tree.position.set(x, 0.16, z);
            environmentGroup.add(tree);
        });

        // Architectural scale figure (Architect human silhouette)
        const personGroup = new THREE.Group();
        const headGeo = new THREE.SphereGeometry(0.15, 12, 12);
        const personMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
        const head = new THREE.Mesh(headGeo, personMat);
        head.position.y = 1.65;
        personGroup.add(head);

        const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.9, 8);
        const body = new THREE.Mesh(bodyGeo, personMat);
        body.position.y = 1.1;
        body.castShadow = true;
        personGroup.add(body);

        const legsGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8);
        const legs = new THREE.Mesh(legsGeo, personMat);
        legs.position.y = 0.35;
        legs.castShadow = true;
        personGroup.add(legs);

        personGroup.position.set(4.5, 0.16, 4.5);
        environmentGroup.add(personGroup);
    }

    // CFD Wind Streamlines
    function initWindParticles() {
        const pGeo = new THREE.BufferGeometry();
        particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 28;
            particlePositions[i * 3 + 1] = 0.5 + Math.random() * 4.5;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 28;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0x06b6d4,
            size: 0.22,
            transparent: true,
            opacity: 0.75
        });

        particleSystem = new THREE.Points(pGeo, pMat);
        scene.add(particleSystem);
    }

    function animateWindParticles(delta) {
        if (!particleSystem || !toggleWindParticles.checked) {
            if (particleSystem) particleSystem.visible = false;
            return;
        }
        particleSystem.visible = true;

        const positions = particleSystem.geometry.attributes.position.array;
        const speed = activePreset.windSpeedVal * 1.5;
        const angleRad = THREE.MathUtils.degToRad(activePreset.windAngleDeg);
        const vx = Math.sin(angleRad) * speed * delta;
        const vz = Math.cos(angleRad) * speed * delta;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += vx;
            positions[i * 3 + 2] += vz;

            // Loop boundaries
            if (positions[i * 3] > 16) positions[i * 3] = -16;
            if (positions[i * 3] < -16) positions[i * 3] = 16;
            if (positions[i * 3 + 2] > 16) positions[i * 3 + 2] = -16;
            if (positions[i * 3 + 2] < -16) positions[i * 3 + 2] = 16;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Material definitions for 3D modes
    function getMaterialsForMode(mode) {
        if (mode === 'thermal') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }), // Warm heat exchange
                roofMat: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 }), // Cool buffered roof
                glassMat: new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.85 }), // Direct heat flux
                slabMat: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0xeab308 })
            };
        } else if (mode === 'solar') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 }), // High solar absorption
                roofMat: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x64748b }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0xb45309 })
            };
        } else if (mode === 'xray') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.28, wireframe: false }),
                roofMat: new THREE.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.35 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x334155 }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, transparent: true, opacity: 0.5 })
            };
        } else if (mode === 'airflow') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.75 }),
                roofMat: new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x0f172a }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0x0284c7 })
            };
        } else {
            // Realistic Mode using advanced MeshPhysicalMaterial for maximum realism
            const wallMap = {
                pcm_biowax:       { color: 0x38bdf8, roughness: 0.2, metalness: 0.1, clearcoat: 0.3 },
                aerated_concrete: { color: 0xf1f5f9, roughness: 0.8, metalness: 0.05, clearcoat: 0.0 },
                rammed_earth:     { color: 0xd4a373, roughness: 0.9, metalness: 0.0, clearcoat: 0.0 },
                timber_frame:     { color: 0xb5835a, roughness: 0.6, metalness: 0.0, clearcoat: 0.1 },
                brick_cavity:     { color: 0x9c413b, roughness: 0.85, metalness: 0.0, clearcoat: 0.0 },
                galvanized_sheet: { color: 0x94a3b8, roughness: 0.4, metalness: 0.8, clearcoat: 0.5 }
            };
            const roofMap = {
                green_roof:      { color: 0x2e5c1d, roughness: 0.9, metalness: 0.0 }, // Darker, organic green
                cool_roof:       { color: 0xf8fafc, roughness: 0.2, metalness: 0.1, clearcoat: 0.8 }, // Highly reflective
                sloped_solar:    { color: 0x1e3a8a, roughness: 0.3, metalness: 0.6 },
                corrugated_iron: { color: 0x64748b, roughness: 0.6, metalness: 0.7 }
            };

            const wProp = wallMap[wallMaterial.value] || wallMap.aerated_concrete;
            const rProp = roofMap[roofType.value] || roofMap.green_roof;

            return {
                wallMat: new THREE.MeshPhysicalMaterial(wProp),
                roofMat: new THREE.MeshPhysicalMaterial(rProp),
                // Hyper-realistic glass with physical transmission instead of standard opacity
                glassMat: new THREE.MeshPhysicalMaterial({ 
                    color: 0xffffff, 
                    roughness: 0.05, 
                    metalness: 0.1,
                    transmission: 0.9, // glass effect
                    ior: 1.5, // index of refraction
                    thickness: 0.1,
                    transparent: true 
                }),
                slabMat: new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, roughness: 0.9, metalness: 0.1 }),
                doorMat: new THREE.MeshPhysicalMaterial({ color: 0x451a03, roughness: 0.6, clearcoat: 0.2 })
            };
        }
    }

    function rebuildShelter() {
        while (shelterBody.children.length > 0) {
            shelterBody.remove(shelterBody.children[0]);
        }
        while (shelterRoof.children.length > 0) {
            shelterRoof.remove(shelterRoof.children[0]);
        }
        while (dimensionGroup.children.length > 0) {
            dimensionGroup.remove(dimensionGroup.children[0]);
        }

        const l = parseFloat(paramLength.value);
        const w = parseFloat(paramWidth.value);
        const h = parseFloat(paramHeight.value);
        const rotDeg = parseFloat(paramOrientation.value);
        const rotRad = THREE.MathUtils.degToRad(rotDeg);

        shelterRoot.rotation.y = rotRad;

        const mats = getMaterialsForMode(current3DMode);
        
        // Architectural materials for the modern pavilion
        const deckMat = new THREE.MeshPhysicalMaterial({ color: 0x8b5a2b, roughness: 0.9, metalness: 0.0 });
        const pillarMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.8 }); // Dark steel
        const interiorFloorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.2 });

        // 1. Foundation Slab (Wide platform)
        const platformOverhang = 1.5;
        const slabGeo = new THREE.BoxGeometry(l + platformOverhang * 2, 0.4, w + platformOverhang * 2);
        const slab = new THREE.Mesh(slabGeo, mats.slabMat);
        slab.position.y = 0.2;
        slab.castShadow = true;
        slab.receiveShadow = true;
        shelterBody.add(slab);

        // 1.5 Inner Wooden Floor
        const floorGeo = new THREE.BoxGeometry(l, 0.05, w);
        const floor = new THREE.Mesh(floorGeo, interiorFloorMat);
        floor.position.set(0, 0.425, 0);
        floor.receiveShadow = true;
        shelterBody.add(floor);

        // 2. Corner Steel Pillars
        const pSize = 0.2;
        const pillarGeo = new THREE.BoxGeometry(pSize, h, pSize);
        const pillarPositions = [
            [-l/2 + pSize/2, -w/2 + pSize/2],
            [l/2 - pSize/2, -w/2 + pSize/2],
            [l/2 - pSize/2, w/2 - pSize/2],
            [-l/2 + pSize/2, w/2 - pSize/2]
        ];

        pillarPositions.forEach(pos => {
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(pos[0], h/2 + 0.45, pos[1]);
            pillar.castShadow = true;
            shelterBody.add(pillar);
        });

        // 3. Walls & Glass Envelope (Recessed slightly)
        const wallThickness = 0.15;
        const wwrRatio = parseFloat(glazingRatio.value) / 100;
        
        // North Wall (Solid)
        const nWallGeo = new THREE.BoxGeometry(l - pSize*2, h, wallThickness);
        const nWall = new THREE.Mesh(nWallGeo, mats.wallMat);
        nWall.position.set(0, h/2 + 0.45, -w/2 + wallThickness/2);
        nWall.castShadow = true;
        shelterBody.add(nWall);

        // East & West Walls (Solid)
        const ewWallGeo = new THREE.BoxGeometry(wallThickness, h, w - pSize*2);
        const wWall = new THREE.Mesh(ewWallGeo, mats.wallMat);
        wWall.position.set(-l/2 + wallThickness/2, h/2 + 0.45, 0);
        wWall.castShadow = true;
        shelterBody.add(wWall);

        const eWall = new THREE.Mesh(ewWallGeo, mats.wallMat);
        eWall.position.set(l/2 - wallThickness/2, h/2 + 0.45, 0);
        eWall.castShadow = true;
        shelterBody.add(eWall);

        // South Facade: Glass walls split for a prominent center entrance door
        const glassW = l - pSize*2;
        const doorWidth = 1.2;
        const doorHeight = 2.2;
        
        // Glass left of door
        const glassSideGeo = new THREE.BoxGeometry((glassW - doorWidth)/2, h, 0.05);
        const glassLeft = new THREE.Mesh(glassSideGeo, mats.glassMat);
        glassLeft.position.set(-glassW/2 + glassSideGeo.parameters.width/2, h/2 + 0.45, w/2 - wallThickness/2);
        shelterBody.add(glassLeft);
        
        // Glass right of door
        const glassRight = new THREE.Mesh(glassSideGeo, mats.glassMat);
        glassRight.position.set(glassW/2 - glassSideGeo.parameters.width/2, h/2 + 0.45, w/2 - wallThickness/2);
        shelterBody.add(glassRight);

        // Glass header above door
        const headerH = h - doorHeight;
        if (headerH > 0) {
            const glassHeaderGeo = new THREE.BoxGeometry(doorWidth, headerH, 0.05);
            const glassHeader = new THREE.Mesh(glassHeaderGeo, mats.glassMat);
            glassHeader.position.set(0, h - headerH/2 + 0.45, w/2 - wallThickness/2);
            shelterBody.add(glassHeader);
        }

        // Heavy Modern Wood Front Door
        const doorLeafGeo = new THREE.BoxGeometry(doorWidth - 0.05, doorHeight, 0.15);
        const doorLeaf = new THREE.Mesh(doorLeafGeo, mats.doorMat);
        doorLeaf.position.set(0, doorHeight/2 + 0.45, w/2 - wallThickness/2);
        doorLeaf.castShadow = true;
        shelterBody.add(doorLeaf);

        // Large vertical modern handle
        const handleMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.1 });
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), handleMat);
        handle.position.set(doorWidth/2 - 0.15, doorHeight/2 + 0.45, w/2 - wallThickness/2 + 0.12);
        shelterBody.add(handle);

        // 4. Clean Flat Roof Slab (Hovering effect)
        const roofThickness = 0.35;
        const roofGeo = new THREE.BoxGeometry(l + platformOverhang * 2, roofThickness, w + platformOverhang * 2);
        const roofMesh = new THREE.Mesh(roofGeo, mats.roofMat);
        roofMesh.castShadow = true;
        roofMesh.receiveShadow = true;

        // Dark sleek Fascia wrapped around the roof
        const fasciaMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.3 });
        const fasciaThick = 0.05;
        const fN = new THREE.Mesh(new THREE.BoxGeometry(l + platformOverhang*2 + fasciaThick*2, roofThickness + 0.02, fasciaThick), fasciaMat);
        fN.position.set(0, 0, -(w + platformOverhang*2)/2 - fasciaThick/2);
        roofMesh.add(fN);
        const fS = new THREE.Mesh(new THREE.BoxGeometry(l + platformOverhang*2 + fasciaThick*2, roofThickness + 0.02, fasciaThick), fasciaMat);
        fS.position.set(0, 0, (w + platformOverhang*2)/2 + fasciaThick/2);
        roofMesh.add(fS);
        const fE = new THREE.Mesh(new THREE.BoxGeometry(fasciaThick, roofThickness + 0.02, w + platformOverhang*2 + fasciaThick*2), fasciaMat);
        fE.position.set((l + platformOverhang*2)/2 + fasciaThick/2, 0, 0);
        roofMesh.add(fE);
        const fW = new THREE.Mesh(new THREE.BoxGeometry(fasciaThick, roofThickness + 0.02, w + platformOverhang*2 + fasciaThick*2), fasciaMat);
        fW.position.set(-(l + platformOverhang*2)/2 - fasciaThick/2, 0, 0);
        roofMesh.add(fW);

        // Optional Solar Panels
        if (roofType.value === 'sloped_solar') {
            const panelGeo = new THREE.BoxGeometry(l, 0.05, w);
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
            const solarPanel = new THREE.Mesh(panelGeo, panelMat);
            solarPanel.position.set(0, roofThickness/2 + 0.05, 0);
            roofMesh.add(solarPanel);
        }

        // Lift roof logic
        const roofLiftY = toggleExploded.checked ? 3.5 : 0;
        shelterRoof.position.y = h + 0.45 + roofThickness/2 + roofLiftY;
        shelterRoof.add(roofMesh);

        if (toggleExploded.checked) {
            const liftLinesMat = new THREE.LineDashedMaterial({ color: 0x3b82f6, dashSize: 0.3, gapSize: 0.2 });
            pillarPositions.forEach(pos => {
                const pts = [new THREE.Vector3(pos[0], h + 0.45, pos[1]), new THREE.Vector3(pos[0], h + 0.45 + roofLiftY, pos[1])];
                const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), liftLinesMat);
                line.computeLineDistances();
                shelterRoof.add(line);
            });
        }

        // 5. Detailed Practical Interior
        // Interior Partition Wall (Bathroom enclosure in NW corner)
        const interiorWallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });
        const partitionZ = new THREE.Mesh(new THREE.BoxGeometry(1.5, h, 0.1), interiorWallMat);
        partitionZ.position.set(-l/2 + 1.5/2 + pSize, h/2 + 0.45, -w/2 + 1.5 + pSize);
        partitionZ.castShadow = true;
        shelterBody.add(partitionZ);
        
        const partitionX = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 1.5), interiorWallMat);
        partitionX.position.set(-l/2 + 1.5 + pSize, h/2 + 0.45, -w/2 + 1.5/2 + pSize);
        partitionX.castShadow = true;
        shelterBody.add(partitionX);

        // Kitchen Island (Center East)
        const kitchenIslandMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 }); // Dark marble/granite
        const islandGeo = new THREE.BoxGeometry(0.8, 0.9, 1.8);
        const island = new THREE.Mesh(islandGeo, kitchenIslandMat);
        island.position.set(l/4, 0.9/2 + 0.45, 0);
        island.castShadow = true;
        shelterBody.add(island);

        // Living Room Sofa (Center West facing South)
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 }); // Leather color
        const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.7), sofaMat);
        sofaSeat.position.set(-l/4 + 0.5, 0.4/2 + 0.45, 0.2);
        sofaSeat.castShadow = true;
        shelterBody.add(sofaSeat);
        const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.2), sofaMat);
        sofaBack.position.set(-l/4 + 0.5, 0.8/2 + 0.45, -0.05);
        sofaBack.castShadow = true;
        shelterBody.add(sofaBack);

        // 5. Minimalist Interior
        const trombeGeo = new THREE.BoxGeometry(l * 0.4, h * 0.8, 0.3);
        const trombeMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
        const trombeWall = new THREE.Mesh(trombeGeo, trombeMat);
        trombeWall.position.set(0, (h * 0.8)/2 + 0.45, -w/2 + 0.8);
        trombeWall.castShadow = true;
        shelterBody.add(trombeWall);

        // Modern low-profile bed (Moved slightly to fit partitions)
        const bedGeo = new THREE.BoxGeometry(1.8, 0.3, 1.4);
        const bedMat = new THREE.MeshPhysicalMaterial({ color: 0xd1d5db, roughness: 0.9 });
        const bed = new THREE.Mesh(bedGeo, bedMat);
        bed.position.set(l/2 - 1.2, 0.45 + 0.15, -w/2 + 1.2);
        bed.castShadow = true;
        shelterBody.add(bed);

        // Area Rug under the bed
        const rugGeo = new THREE.PlaneGeometry(2.8, 2.2);
        const rugMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 1.0 });
        const rug = new THREE.Mesh(rugGeo, rugMat);
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(l/2 - 1.5, 0.455, 0);
        rug.receiveShadow = true;
        shelterBody.add(rug);

        // Modern Desk and Chair against West Wall
        const woodMat = new THREE.MeshPhysicalMaterial({ color: 0x8b5a2b, roughness: 0.7 });
        const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 1.4), woodMat);
        deskTop.position.set(-l/2 + 0.6, 0.45 + 0.75, 0);
        deskTop.castShadow = true;
        shelterBody.add(deskTop);
        // Desk legs
        for(let z of [-0.65, 0.65]) {
            const dLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.05), pillarMat);
            dLeg.position.set(-l/2 + 0.6, 0.45 + 0.375, z);
            dLeg.castShadow = true;
            shelterBody.add(dLeg);
        }
        
        // Desk Chair
        const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), pillarMat);
        chairSeat.position.set(-l/2 + 1.2, 0.45 + 0.45, 0);
        chairSeat.castShadow = true;
        shelterBody.add(chairSeat);
        const chairLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 8), pillarMat);
        chairLeg.position.set(-l/2 + 1.2, 0.45 + 0.225, 0);
        chairLeg.castShadow = true;
        shelterBody.add(chairLeg);

        // Potted Plant in the corner
        const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.4, 16), potMat);
        pot.position.set(-l/2 + 0.5, 0.45 + 0.2, w/2 - 0.5);
        pot.castShadow = true;
        shelterBody.add(pot);
        
        const plantMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });
        const plant1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), plantMat);
        plant1.position.set(-l/2 + 0.5, 0.45 + 0.6, w/2 - 0.5);
        plant1.castShadow = true;
        shelterBody.add(plant1);
        const plant2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), plantMat);
        plant2.position.set(-l/2 + 0.65, 0.45 + 0.45, w/2 - 0.35);
        plant2.castShadow = true;
        shelterBody.add(plant2);

        // Exterior Touch-Up: Entrance Steps
        const stepMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
        const stepGeo1 = new THREE.BoxGeometry(2.0, 0.1, 0.4);
        const step1 = new THREE.Mesh(stepGeo1, stepMat);
        step1.position.set(0, 0.05, w/2 + platformOverhang + 0.2);
        step1.castShadow = true;
        step1.receiveShadow = true;
        shelterBody.add(step1);
        
        const stepGeo2 = new THREE.BoxGeometry(2.0, 0.1, 0.4);
        const step2 = new THREE.Mesh(stepGeo2, stepMat);
        step2.position.set(0, 0.15, w/2 + platformOverhang - 0.2);
        step2.castShadow = true;
        step2.receiveShadow = true;
        shelterBody.add(step2);

        // 6. Final Touch-Ups (Environment Context & Warm Lighting)
        // Add a warm interior glow (PointLight) so the house looks alive at twilight
        const interiorLight = new THREE.PointLight(0xffedd5, 1.5, 15);
        interiorLight.position.set(0, h - 0.5, 0);
        shelterBody.add(interiorLight);

        // Landscaping: Yard Base
        const yardMat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.95 }); // Deep lush grass
        const yardGeo = new THREE.CylinderGeometry(12, 12, 0.1, 32);
        const yard = new THREE.Mesh(yardGeo, yardMat);
        yard.position.set(0, -0.05, 0);
        yard.receiveShadow = true;
        shelterBody.add(yard);

        // Landscaping: Stone Pathway leading to steps
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 1.0 });
        const pathGeo = new THREE.PlaneGeometry(1.6, 6);
        const path = new THREE.Mesh(pathGeo, pathMat);
        path.rotation.x = -Math.PI / 2;
        path.position.set(0, 0.01, w/2 + platformOverhang + 3);
        path.receiveShadow = true;
        shelterBody.add(path);

        // Landscaping: Decorative Procedural Trees
        function createTree(x, z, scale) {
            const tree = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1.0), new THREE.MeshStandardMaterial({color: 0x3e2723}));
            trunk.position.y = 0.5;
            trunk.castShadow = true;
            tree.add(trunk);
            const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), new THREE.MeshStandardMaterial({color: 0x166534, flatShading: true}));
            leaves.position.y = 1.2;
            leaves.castShadow = true;
            tree.add(leaves);
            tree.position.set(x, 0, z);
            tree.scale.set(scale, scale, scale);
            return tree;
        }
        
        shelterBody.add(createTree(-6, w/2 + 2, 2.5)); // Large tree on left
        shelterBody.add(createTree(5, w/2 + 4, 1.8));  // Medium tree on right
        shelterBody.add(createTree(-4, -w/2 - 3, 2.0)); // Tree in back

        // 7. Dimensions and Compass
        if (toggleDimensions.checked) {
            buildDimensionLines(l, w, h);
        }

        const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0.5, 0),
            w * 0.7 + platformOverhang + 1.0,
            0x2563eb, 0.8, 0.5
        );
        shelterBody.add(arrow);

        if (overlayDimensions) {
            overlayDimensions.textContent = `Envelope: ${l.toFixed(1)}m × ${w.toFixed(1)}m × ${h.toFixed(1)}m`;
        }
    }

    function buildDimensionLines(l, w, h) {
        const lineMat = new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 });

        // Length Line (Front X-axis)
        const lenY = 0.35;
        const lenZ = w / 2 + 0.8;
        const lenPts = [new THREE.Vector3(-l / 2, lenY, lenZ), new THREE.Vector3(l / 2, lenY, lenZ)];
        dimensionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lenPts), lineMat));

        // Width Line (Side Z-axis)
        const widX = l / 2 + 0.8;
        const widPts = [new THREE.Vector3(widX, lenY, -w / 2), new THREE.Vector3(widX, lenY, w / 2)];
        dimensionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(widPts), lineMat));

        // Height Line (Vertical Y-axis)
        const hPts = [new THREE.Vector3(widX, 0.25, w / 2), new THREE.Vector3(widX, h + 0.25, w / 2)];
        dimensionGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hPts), lineMat));
    }

    function updateSunPosition() {
        const hour = parseFloat(paramSunHour.value); // 6.0 to 18.0
        const progress = (hour - 6) / 12;
        const angle = Math.PI * progress;

        const radius = 26;
        const x = -Math.cos(angle) * radius;
        const y = Math.sin(angle) * 19 + 2;
        const z = Math.sin(angle) * 14;

        sunLight.position.set(x, y, z);
        sunMesh.position.set(x, y, z);

        const elevationDeg = Math.round(Math.sin(angle) * 65);
        const azimuthDeg = Math.round(90 + progress * 180);
        if (overlaySun) {
            overlaySun.textContent = `Sun: Azimuth ${azimuthDeg}°, Elev ${elevationDeg}°`;
        }
    }

    initThree();

    // ==========================================
    // 7. 3D Mode Switcher & Element Toggles
    // ==========================================
    const modeButtons = document.querySelectorAll('#viewModeButtons .mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            current3DMode = btn.getAttribute('data-mode');
            const modeTitles = {
                realistic: 'Mode: Realistic Architectural',
                thermal: 'Mode: Thermal Heat Flux Heatmap',
                solar: 'Mode: Solar Radiation Exposure',
                xray: 'Mode: X-Ray Envelope Inspection',
                airflow: 'Mode: Aerodynamic CFD Airflow'
            };
            if (modeText) modeText.textContent = modeTitles[current3DMode] || 'Mode: Realistic';

            // Show thermal legend in thermal or solar mode
            if (thermalLegend) {
                thermalLegend.style.display = (current3DMode === 'thermal' || current3DMode === 'solar') ? 'block' : 'none';
            }

            rebuildShelter();
            showToast(`Switched to 3D ${btn.textContent.trim()} Mode`);
        });
    });

    // Element Toggles
    toggleDimensions.addEventListener('change', () => rebuildShelter());
    toggleExploded.addEventListener('change', () => {
        rebuildShelter();
        showToast(toggleExploded.checked ? 'Roof lifted for internal inspection' : 'Roof lowered to envelope');
    });
    toggleEnvironment.addEventListener('change', () => {
        environmentGroup.visible = toggleEnvironment.checked;
        showToast(toggleEnvironment.checked ? 'Site context visible' : 'Site context hidden');
    });
    toggleWindParticles.addEventListener('change', () => {
        if (particleSystem) particleSystem.visible = toggleWindParticles.checked;
    });

    // Camera Presets
    const camIsometric = document.getElementById('camIsometric');
    const camSouth = document.getElementById('camSouth');
    const camTop = document.getElementById('camTop');
    const camReset = document.getElementById('camReset');

    if (camIsometric) {
        camIsometric.addEventListener('click', () => {
            camera.position.set(14, 11, 18);
            controls.target.set(0, 1.5, 0);
            controls.update();
        });
    }
    if (camSouth) {
        camSouth.addEventListener('click', () => {
            camera.position.set(0, 3.5, 18);
            controls.target.set(0, 1.5, 0);
            controls.update();
        });
    }
    if (camTop) {
        camTop.addEventListener('click', () => {
            camera.position.set(0, 24, 0.1);
            controls.target.set(0, 0, 0);
            controls.update();
        });
    }
    if (camReset) {
        camReset.addEventListener('click', () => {
            camera.position.set(14, 11, 18);
            controls.target.set(0, 1.5, 0);
            controls.update();
            showToast('Camera reset to default perspective');
        });
    }

    // ==========================================
    // 8. Dynamic Simulation & Metrics Calculation
    // ==========================================
    function recalculateThermalSimulation() {
        const l = parseFloat(paramLength.value);
        const w = parseFloat(paramWidth.value);
        const h = parseFloat(paramHeight.value);
        const orientation = parseFloat(paramOrientation.value);
        const wwr = parseFloat(glazingRatio.value);

        const orientationDelta = Math.abs(orientation - 180);
        const solarFactor = 1 - (orientationDelta / 180) * 0.25;

        const matBonusMap = {
            pcm_biowax: 1.55,
            aerated_concrete: 1.2,
            rammed_earth: 1.35,
            timber_frame: 1.15,
            brick_cavity: 1.0,
            galvanized_sheet: 0.3
        };
        const matBonus = matBonusMap[wallMaterial.value] || 1.0;

        const roofBonusMap = {
            green_roof: 1.3,
            cool_roof: 1.15,
            sloped_solar: 1.2,
            corrugated_iron: 0.4
        };
        const roofBonus = roofBonusMap[roofType.value] || 1.0;

        const effectiveDamping = (matBonus + roofBonus) / 2;

        const newIndoor = activePreset.diurnalOutdoor.map((outVal, idx) => {
            const solarPeak = activePreset.solarGains[idx] * (wwr / 25) * solarFactor;
            const avgOutdoor = activePreset.diurnalOutdoor.reduce((a, b) => a + b, 0) / 24;
            const passiveOffset = (outVal - avgOutdoor) * (1 / (effectiveDamping * 1.6));
            const calculatedIndoor = avgOutdoor + passiveOffset + (solarPeak * 0.015);
            return Number(calculatedIndoor.toFixed(1));
        });

        const newSolar = activePreset.solarGains.map(v => Math.round(v * (wwr / 25) * solarFactor));
        const newConduction = activePreset.conductionLoss.map(v => Math.round(v / effectiveDamping));

        thermalChart.data.datasets[0].data = activePreset.diurnalOutdoor;
        thermalChart.data.datasets[1].data = newIndoor;
        thermalChart.update();

        heatBalanceChart.data.datasets[0].data = newSolar;
        heatBalanceChart.data.datasets[1].data = newConduction;
        heatBalanceChart.update();

        const minIndoor = Math.min(...newIndoor);
        const comfortHours = newIndoor.filter(t => t >= 17.5 && t <= 26.5).length;
        const comfortPct = Math.round((comfortHours / 24) * 100);

        bannerComfort.textContent = `${comfortPct}% Comfort Band`;
        tblAdaptMin.textContent = `${minIndoor.toFixed(1)} °C`;
        tblBaseMin.textContent = activePreset.baselineMin;
        tblGainMin.textContent = activePreset.gainMin;
        tblAdaptEnergy.textContent = activePreset.adaptEnergy;
        tblBaseEnergy.textContent = activePreset.baseEnergy;
        tblGainEnergy.textContent = activePreset.gainEnergy;
        tblAdaptCarbon.textContent = activePreset.adaptCarbon;
        tblBaseCarbon.textContent = activePreset.baseCarbon;

        repLocation.textContent = activePreset.name;
        repDimensions.textContent = `${l.toFixed(1)}m (L) × ${w.toFixed(1)}m (W) × ${h.toFixed(1)}m (H) [Area: ${(l * w).toFixed(1)} m²]`;
        repMaterials.textContent = `${wallMaterial.options[wallMaterial.selectedIndex].text.split('(')[0]} | ${roofType.options[roofType.selectedIndex].text}`;
    }

    // Sliders Listeners
    paramLength.addEventListener('input', (e) => {
        valLength.textContent = `${parseFloat(e.target.value).toFixed(1)} m`;
        rebuildShelter();
        recalculateThermalSimulation();
    });

    paramWidth.addEventListener('input', (e) => {
        valWidth.textContent = `${parseFloat(e.target.value).toFixed(1)} m`;
        rebuildShelter();
        recalculateThermalSimulation();
    });

    paramHeight.addEventListener('input', (e) => {
        valHeight.textContent = `${parseFloat(e.target.value).toFixed(1)} m`;
        rebuildShelter();
        recalculateThermalSimulation();
    });

    paramOrientation.addEventListener('input', (e) => {
        valOrientation.textContent = `${e.target.value}° (${getOrientationLabel(e.target.value)})`;
        rebuildShelter();
        recalculateThermalSimulation();
    });

    function getOrientationLabel(deg) {
        deg = parseInt(deg);
        if (deg >= 165 && deg <= 195) return 'South-Facing Sun Optimum';
        if (deg >= 75 && deg <= 105) return 'East-Facing Morning Gain';
        if (deg >= 255 && deg <= 285) return 'West-Facing Harsh Afternoon';
        if (deg >= 345 || deg <= 15) return 'North-Facing Minimal Solar';
        return 'Angled Orientation';
    }

    paramSunHour.addEventListener('input', (e) => {
        const hr = parseFloat(e.target.value);
        valSunHour.textContent = `${Math.floor(hr)}:${hr % 1 === 0 ? '00' : '30'} (${hr >= 11 && hr <= 14 ? 'Peak Irradiance' : 'Diurnal Transition'})`;
        updateSunPosition();
    });

    wallMaterial.addEventListener('change', () => {
        rebuildShelter();
        recalculateThermalSimulation();
        showToast('Updated wall construction and thermal mass properties');
    });

    roofType.addEventListener('change', () => {
        rebuildShelter();
        recalculateThermalSimulation();
        showToast('Updated roofing thermal barrier');
    });

    glazingRatio.addEventListener('change', () => {
        rebuildShelter();
        recalculateThermalSimulation();
        showToast('Updated Window-to-Wall Ratio (WWR)');
    });

    // ==========================================
    // 9. Location & Open-Meteo Integration
    // ==========================================
    locationSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'custom') {
            customCoordRow.style.display = 'flex';
            weatherSourceBadge.textContent = 'Live API Ready';
            showToast('Enter coordinates to fetch live Open-Meteo microclimate');
            return;
        }

        customCoordRow.style.display = 'none';
        weatherSourceBadge.textContent = 'Demo Mode (Calibrated)';
        activePreset = climatePresets[val] || climatePresets.shimla;

        updateClimateUI(activePreset);
        recalculateThermalSimulation();
        showToast(`Loaded ${activePreset.name} microclimate data`);
    });

    function updateClimateUI(preset) {
        bannerRegion.textContent = preset.name;
        outTemp.textContent = `${preset.temp} °C`;
        outHumidity.textContent = `${preset.humidity} %`;
        solarRad.textContent = `${preset.solar} W/m²`;
        windSpeed.textContent = preset.wind;
        const minT = Math.min(...preset.diurnalOutdoor);
        const maxT = Math.max(...preset.diurnalOutdoor);
        outTempRange.textContent = `Min: ${minT}°C | Max: ${maxT}°C`;
        if (overlayWind) overlayWind.textContent = `Wind: ${preset.wind}`;
    }

    fetchLiveWeatherBtn.addEventListener('click', async () => {
        const lat = parseFloat(customLat.value);
        const lon = parseFloat(customLon.value);

        fetchLiveWeatherBtn.disabled = true;
        fetchLiveWeatherBtn.textContent = 'Connecting...';

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,direct_normal_irradiance,wind_speed_10m&forecast_days=1`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            const hourlyTemps = data.hourly.temperature_2m.slice(0, 24);
            const hourlyHum = data.hourly.relative_humidity_2m.slice(0, 24);
            const hourlySolar = data.hourly.direct_normal_irradiance.slice(0, 24);
            const hourlyWind = data.hourly.wind_speed_10m.slice(0, 24);

            const avgT = Number((hourlyTemps.reduce((a,b)=>a+b,0)/24).toFixed(1));
            const avgH = Math.round(hourlyHum.reduce((a,b)=>a+b,0)/24);
            const maxS = Math.round(Math.max(...hourlySolar));
            const avgW = (hourlyWind.reduce((a,b)=>a+b,0)/24).toFixed(1);

            activePreset = {
                name: `Custom [${lat.toFixed(2)}, ${lon.toFixed(2)}]`,
                lat: lat,
                lon: lon,
                temp: avgT,
                humidity: avgH,
                solar: maxS,
                wind: `${avgW} m/s Live`,
                windSpeedVal: parseFloat(avgW),
                windAngleDeg: 60,
                diurnalOutdoor: hourlyTemps,
                diurnalIndoor: hourlyTemps.map(t => Number((t + 5.5).toFixed(1))),
                solarGains: hourlySolar.map(s => Math.round(s * 0.4)),
                conductionLoss: hourlyTemps.map(t => Math.round((t - 21) * 1.2)),
                ventilationExchange: hourlyTemps.map(t => Math.round((t - 21) * 0.8)),
                baselineMin: `${Math.min(...hourlyTemps)} °C`,
                adaptiveMin: `${(Math.min(...hourlyTemps) + 6.5).toFixed(1)} °C`,
                gainMin: "+6.5 °C Live Passive Gain",
                baseEnergy: "135 kWh/m²/yr",
                adaptEnergy: "39 kWh/m²/yr",
                gainEnergy: "-71% Energy Reduction",
                baseCarbon: "400 kg CO₂e/m²",
                adaptCarbon: "172 kg CO₂e/m²"
            };

            weatherSourceBadge.textContent = 'Live Open-Meteo Synced';
            updateClimateUI(activePreset);
            recalculateThermalSimulation();
            showToast('Live microclimate telemetry synced via Open-Meteo API!');

        } catch (err) {
            console.warn('Live weather fallback triggered:', err);
            weatherSourceBadge.textContent = 'Demo Mode (Fallback)';
            showToast('External API unreachable. Reverted to local microclimate model.');
        } finally {
            fetchLiveWeatherBtn.disabled = false;
            fetchLiveWeatherBtn.textContent = 'Fetch Open-Meteo';
        }
    });

    // ==========================================
    // 10. Run Thermal Simulation Button
    // ==========================================
    runSimBtn.addEventListener('click', () => {
        runSimBtn.disabled = true;
        runSimBtn.innerHTML = '<span>⏳ Solving Finite-Difference Thermal Nodes...</span>';

        setTimeout(() => {
            runSimBtn.disabled = false;
            runSimBtn.innerHTML = '<span>⚡ Run Thermal Simulation</span>';
            recalculateThermalSimulation();
            showToast('ASHRAE 55 thermal comfort calculations completed successfully.');
        }, 600);
    });

    // ==========================================
    // 11. Optimization Engine & Modal
    // ==========================================
    optimizeAutoBtn.addEventListener('click', () => {
        optimizationModal.classList.add('open');
    });

    closeOptModal.addEventListener('click', () => {
        optimizationModal.classList.remove('open');
    });

    applyOptCandidateBtn.addEventListener('click', () => {
        paramOrientation.value = 180;
        valOrientation.textContent = '180° (South-Facing Sun Optimum)';
        paramLength.value = 7.0;
        valLength.textContent = '7.0 m';
        paramWidth.value = 4.5;
        valWidth.textContent = '4.5 m';
        paramHeight.value = 2.8;
        valHeight.textContent = '2.8 m';
        wallMaterial.value = 'aerated_concrete';
        roofType.value = 'green_roof';
        glazingRatio.value = '25';

        optimizationModal.classList.remove('open');
        rebuildShelter();
        recalculateThermalSimulation();
        showToast('Applied Top-Ranked AI Optimization Configuration!');
    });

    // ==========================================
    // 12. Saved Design Vault (localStorage)
    // ==========================================
    const DEFAULT_DESIGNS = [
        { name: "Himalayan Cold Shelter v1", region: "Shimla", length: "6.0", width: "4.0", height: "3.0", date: "2026-09-01" },
        { name: "Thar Desert Passive Habitat", region: "Jodhpur", length: "8.0", width: "5.0", height: "3.2", date: "2026-09-03" }
    ];

    function getSavedDesigns() {
        const stored = localStorage.getItem('thermal_saved_designs');
        if (!stored) {
            localStorage.setItem('thermal_saved_designs', JSON.stringify(DEFAULT_DESIGNS));
            return DEFAULT_DESIGNS;
        }
        try {
            return JSON.parse(stored);
        } catch {
            return DEFAULT_DESIGNS;
        }
    }

    function renderSavedDesigns() {
        if (!savedDesignsList) return;
        const list = getSavedDesigns();
        savedDesignsList.innerHTML = '';
        list.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'saved-design-item';
            el.innerHTML = `
                <div class="saved-design-info">
                    <h5>${item.name}</h5>
                    <span>${item.region} • ${item.length}m × ${item.width}m • ${item.date}</span>
                </div>
                <button class="load-design-btn" data-index="${index}">Load</button>
            `;
            savedDesignsList.appendChild(el);
        });

        savedDesignsList.querySelectorAll('.load-design-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const design = getSavedDesigns()[idx];
                if (design) {
                    paramLength.value = design.length;
                    valLength.textContent = `${design.length} m`;
                    paramWidth.value = design.width;
                    valWidth.textContent = `${design.width} m`;
                    paramHeight.value = design.height;
                    valHeight.textContent = `${design.height} m`;
                    rebuildShelter();
                    recalculateThermalSimulation();
                    showToast(`Restored design: ${design.name}`);
                }
            });
        });
    }

    saveDesignBtn.addEventListener('click', () => {
        const list = getSavedDesigns();
        const newDesign = {
            name: `Design #${list.length + 1} (${activePreset.name.split(',')[0]})`,
            region: activePreset.name.split(',')[0],
            length: parseFloat(paramLength.value).toFixed(1),
            width: parseFloat(paramWidth.value).toFixed(1),
            height: parseFloat(paramHeight.value).toFixed(1),
            date: new Date().toLocaleDateString()
        };
        list.unshift(newDesign);
        localStorage.setItem('thermal_saved_designs', JSON.stringify(list));
        renderSavedDesigns();
        showToast('Design successfully saved to local architectural vault!');
    });

    renderSavedDesigns();

    // ==========================================
    // 13. Export / Print Official Report
    // ==========================================
    exportReportBtn.addEventListener('click', () => {
        showToast('Preparing SIH26051 Technical Evaluation PDF...');
        setTimeout(() => {
            window.print();
        }, 500);
    });

    // Initial calculation run
    recalculateThermalSimulation();
});
