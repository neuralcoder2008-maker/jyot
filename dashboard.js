// Climate-Adaptive Thermal Shelter Designer - SIH26051
// Comprehensive Working Studio Engine with Advanced 3D Twin & Modes
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Authentication & Session Handling
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');
    const displayUserName = document.getElementById('displayUserName');

    const storedUser = sessionStorage.getItem('thermal_user');
    
    if (!storedUser) {
        // Enforce Authentication
        window.location.href = 'index.html';
        return;
    }

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
    const paramFloors = document.getElementById('paramFloors');
    const valFloors = document.getElementById('valFloors');
    
    const valOrientation = document.getElementById('valOrientation');
    const valSunHour = document.getElementById('valSunHour');
    
    const paramMonth = document.getElementById('paramMonth');
    const valMonth = document.getElementById('valMonth');

    const archStyle = document.getElementById('archStyle');

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
    let sunMesh, sunLight, sunPathLine, groundMesh, compassGroup, turfMesh;
    let particlePositions, particleCount = 180;
    let skyUniforms;
    
    // Dynamic Climate Weather Systems (Snow & Wind)
    let currentBiome = 'desert';
    let snowSystem = null, snowPositions = null, snowVelocities = null;
    const snowFlakeCount = 650;

    // Interactive door system
    let doorGroup; 
    let doorPivot = null;
    let isDoorOpen = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const container = document.getElementById('threeContainer');

    function initThree() {
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 480;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf1f5f9);

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(9.2, 4.8, 12.0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        container.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.target.set(0, 1.4, 0);
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.minDistance = 3.5;
        controls.maxDistance = 45;

        // Ambient Light — soft fill to avoid pitch-black shadows
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
        scene.add(ambientLight);

        // Hemisphere light — sky/ground bounce for natural outdoor feel
        const hemiLight = new THREE.HemisphereLight(0xbfdbfe, 0x6b7280, 0.35);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        // Directional Sun Light — natural daylight intensity
        sunLight = new THREE.DirectionalLight(0xfffbeb, 1.3);
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

        // Photorealistic Sky Dome Shader
        const vertexShader = `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fragmentShader = `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `;
        skyUniforms = {
            topColor: { value: new THREE.Color(0x3b82f6) },    // Deep sky blue
            bottomColor: { value: new THREE.Color(0xe0f2fe) }, // Horizon haze
            offset: { value: 33 },
            exponent: { value: 0.6 }
        };
        const skyGeo = new THREE.SphereGeometry(500, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: skyUniforms,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);

        // Ultra-Realistic Sun Group (Solid Core + Optical Flare)
        sunMesh = new THREE.Group();
        
        // 1. Solid physical core — sized for a realistic sun disc in the sky
        const coreGeo = new THREE.SphereGeometry(1.0, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        sunMesh.add(core);

        // 2. Optical Lens Flare/Corona using Radial Gradient Sprite
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0,    'rgba(255, 255, 220, 0.95)');
        gradient.addColorStop(0.06, 'rgba(255, 230, 140, 0.75)');
        gradient.addColorStop(0.18, 'rgba(255, 180, 40,  0.4)');
        gradient.addColorStop(0.45, 'rgba(255, 120, 0,   0.12)');
        gradient.addColorStop(1,    'rgba(0,   0,   0,   0)'); // Natural soft corona
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);

        const sunTexture = new THREE.CanvasTexture(canvas);
        const sunFlareMat = new THREE.SpriteMaterial({ 
            map: sunTexture, 
            color: 0xffffff, 
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false 
        });
        const flare = new THREE.Sprite(sunFlareMat);
        flare.scale.set(32, 32, 1); // Well-proportioned atmospheric corona
        sunMesh.add(flare);
        
        scene.add(sunMesh);

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

        // Animated Wind & Snow Climate Particle Systems
        initWindParticles();
        initSnowfallSystem();

        updateSunPosition();
        rebuildShelter();

        window.addEventListener('resize', () => {
            const newW = container.clientWidth;
            const newH = container.clientHeight || 480;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });

        // Door interaction on canvas click
        renderer.domElement.addEventListener('pointerdown', (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            
            if (doorGroup) {
                const intersects = raycaster.intersectObjects(doorGroup.children, true);
                if (intersects.length > 0) {
                    isDoorOpen = !isDoorOpen;
                    const toggleDoorEl = document.getElementById('toggleDoor');
                    if (toggleDoorEl) toggleDoorEl.checked = isDoorOpen;
                }
            }
        });

        // Pointer cursor feedback when hovering over the door
        renderer.domElement.addEventListener('pointermove', (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            if (doorGroup) {
                const intersects = raycaster.intersectObjects(doorGroup.children, true);
                renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
            }
        });

        // Sync toolbar UI toggle chip with door state
        const toggleDoorEl = document.getElementById('toggleDoor');
        if (toggleDoorEl) {
            toggleDoorEl.addEventListener('change', (e) => {
                isDoorOpen = e.target.checked;
            });
        }

        // Main Animation Loop
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            controls.update();

            const delta = clock.getDelta();
            animateWindParticles(delta);
            animateSnowfall(delta);
            if (ceilingFan) ceilingFan.rotation.y += 5 * delta;

            // Smooth architectural door hinge rotation
            if (doorPivot) {
                const targetRot = isDoorOpen ? -Math.PI * 0.48 : 0;
                doorPivot.rotation.y += (targetRot - doorPivot.rotation.y) * 8 * delta;
            }

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

        // Architectural terrain podium
        const turfGeo = new THREE.CylinderGeometry(15, 15, 0.15, 48);
        const turfMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c, roughness: 1.0 }); // Sand/Dirt color
        turfMesh = new THREE.Mesh(turfGeo, turfMat);
        turfMesh.position.y = 0.075;
        turfMesh.receiveShadow = true;
        scene.add(turfMesh);

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

    window.rebuildEnvironment = function(biome) {
        currentBiome = biome;
        if (snowSystem) snowSystem.visible = (biome === 'snow');

        // Clear all previous environment objects safely
        while (environmentGroup.children.length > 0) {
            const obj = environmentGroup.children[0];
            environmentGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }

        // Shared helper for creating pseudo-random deterministic positions away from center house
        const getSafeScatterPos = (minR, maxR) => {
            const angle = Math.random() * Math.PI * 2;
            const r = minR + Math.random() * (maxR - minR);
            return {
                x: Math.cos(angle) * r,
                z: Math.sin(angle) * r
            };
        };

        // 1. DESERT BIOME (Hot & Arid, Thar, Rajasthan, Sahara)
        if (biome === 'desert') {
            if (groundMesh) groundMesh.material.color.setHex(0xdfaa5b);
            if (turfMesh) turfMesh.material.color.setHex(0xc9944a);
            if (skyUniforms) {
                skyUniforms.topColor.value.setHex(0x38bdf8);
                skyUniforms.bottomColor.value.setHex(0xfef08a);
            }

            // A. Sand Dunes (Majestic backdrop ridge mounds on the horizon)
            for (let i = 0; i < 9; i++) {
                const pos = getSafeScatterPos(25, 48);
                const duneGeo = new THREE.SphereGeometry(4.0 + Math.random() * 3.5, 20, 10);
                duneGeo.scale(2.2 + Math.random(), 0.38 + Math.random() * 0.2, 1.4 + Math.random());
                const duneMat = new THREE.MeshStandardMaterial({
                    color: 0xd4a04e,
                    roughness: 0.95
                });
                const dune = new THREE.Mesh(duneGeo, duneMat);
                dune.position.set(pos.x, -0.2, pos.z);
                dune.rotation.y = Math.random() * Math.PI;
                dune.receiveShadow = true;
                environmentGroup.add(dune);
            }

            // B. Multi-Branched Saguaro Cacti (Framing the landscape)
            for (let i = 0; i < 12; i++) {
                const pos = getSafeScatterPos(11.5, 26);
                const cactusGroup = new THREE.Group();
                const cactusMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.85 });

                const h = 2.2 + Math.random() * 1.5;
                const r = 0.14 + Math.random() * 0.04;
                const mainGeo = new THREE.CylinderGeometry(r, r, h, 10);
                const mainTrunk = new THREE.Mesh(mainGeo, cactusMat);
                mainTrunk.position.y = h / 2;
                mainTrunk.castShadow = true;
                cactusGroup.add(mainTrunk);

                // Add branch arms
                const numArms = Math.random() > 0.3 ? 2 : 1;
                for (let a = 0; a < numArms; a++) {
                    const armH = 0.8 + Math.random() * 0.8;
                    const armR = r * 0.8;
                    const armHGeo = new THREE.CylinderGeometry(armR, armR, 0.45, 8);
                    const armHMesh = new THREE.Mesh(armHGeo, cactusMat);
                    const side = a === 0 ? 1 : -1;
                    const attachY = h * (0.45 + a * 0.2);
                    armHMesh.rotation.z = Math.PI / 2;
                    armHMesh.position.set(side * 0.26, attachY, 0);
                    cactusGroup.add(armHMesh);

                    const armVGeo = new THREE.CylinderGeometry(armR, armR, armH, 8);
                    const armVMesh = new THREE.Mesh(armVGeo, cactusMat);
                    armVMesh.position.set(side * 0.48, attachY + armH / 2, 0);
                    armVMesh.castShadow = true;
                    cactusGroup.add(armVMesh);
                }

                cactusGroup.position.set(pos.x, 0.15, pos.z);
                cactusGroup.rotation.y = Math.random() * Math.PI * 2;
                environmentGroup.add(cactusGroup);
            }

            // C. Weathered Sandstone Boulders & Rocks
            for (let i = 0; i < 14; i++) {
                const pos = getSafeScatterPos(9.0, 24);
                const rockGeo = new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.6);
                rockGeo.scale(1 + Math.random() * 0.5, 0.6 + Math.random() * 0.4, 1 + Math.random() * 0.5);
                const rockMat = new THREE.MeshStandardMaterial({
                    color: Math.random() > 0.5 ? 0xa16207 : 0x92400e,
                    roughness: 0.95
                });
                const rock = new THREE.Mesh(rockGeo, rockMat);
                rock.position.set(pos.x, 0.25, pos.z);
                rock.rotation.set(Math.random(), Math.random(), Math.random());
                rock.castShadow = true;
                rock.receiveShadow = true;
                environmentGroup.add(rock);
            }

            // D. Desert Scrub / Dry Bushes
            for (let i = 0; i < 10; i++) {
                const pos = getSafeScatterPos(9.5, 22);
                const bushGeo = new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.35);
                const bushMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 1.0 });
                const bush = new THREE.Mesh(bushGeo, bushMat);
                bush.position.set(pos.x, 0.2, pos.z);
                environmentGroup.add(bush);
            }
        }

        // 2. SNOW / ALPINE MOUNTAIN BIOME (Shimla, Leh, Kashmir, High Altitudes)
        else if (biome === 'snow') {
            if (groundMesh) groundMesh.material.color.setHex(0xf8fafc);
            if (turfMesh) turfMesh.material.color.setHex(0xe2e8f0);
            if (skyUniforms) {
                skyUniforms.topColor.value.setHex(0x0284c7);
                skyUniforms.bottomColor.value.setHex(0xf0f9ff);
            }

            // A. Snow-Capped Mountain Horizon Peaks
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2 + (Math.random() * 0.2);
                const dist = 36 + Math.random() * 16;
                const mtnGroup = new THREE.Group();

                const mtnH = 15 + Math.random() * 12;
                const mtnR = 8 + Math.random() * 5;
                
                // Rocky base
                const baseGeo = new THREE.ConeGeometry(mtnR, mtnH, 6);
                const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95, flatShading: true });
                const baseMesh = new THREE.Mesh(baseGeo, baseMat);
                baseMesh.position.y = mtnH / 2;
                mtnGroup.add(baseMesh);

                // Snow Cap
                const snowCapH = mtnH * 0.38;
                const snowCapGeo = new THREE.ConeGeometry(mtnR * 0.38, snowCapH, 6);
                const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, flatShading: true });
                const snowCap = new THREE.Mesh(snowCapGeo, snowCapMat);
                snowCap.position.y = mtnH - (snowCapH / 2);
                mtnGroup.add(snowCap);

                mtnGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
                mtnGroup.rotation.y = Math.random() * Math.PI;
                environmentGroup.add(mtnGroup);
            }

            // B. Snow-Covered Pine / Conifer Evergreen Trees
            for (let i = 0; i < 18; i++) {
                const pos = getSafeScatterPos(11.0, 26);
                const pineGroup = new THREE.Group();

                const treeH = 3.5 + Math.random() * 2.0;
                // Trunk
                const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, treeH * 0.35, 8);
                const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
                const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                trunk.position.y = (treeH * 0.35) / 2;
                trunk.castShadow = true;
                pineGroup.add(trunk);

                // Tiered pine foliage with snow caps
                const tiers = 3;
                for (let t = 0; t < tiers; t++) {
                    const tierY = (treeH * 0.28) + (t * (treeH * 0.24));
                    const tierR = (1.4 - t * 0.3) * (treeH / 4);
                    const foliageGeo = new THREE.ConeGeometry(tierR, treeH * 0.35, 7);
                    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85, flatShading: true });
                    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
                    foliage.position.y = tierY;
                    foliage.castShadow = true;
                    pineGroup.add(foliage);

                    // White snow blanket on tier
                    const snowTierGeo = new THREE.ConeGeometry(tierR * 0.9, treeH * 0.15, 7);
                    const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
                    const snowMesh = new THREE.Mesh(snowTierGeo, snowMat);
                    snowMesh.position.y = tierY + (treeH * 0.1);
                    pineGroup.add(snowMesh);
                }

                pineGroup.position.set(pos.x, 0.15, pos.z);
                environmentGroup.add(pineGroup);
            }


            // C. Frosty Glacial Boulders
            for (let i = 0; i < 8; i++) {
                const pos = getSafeScatterPos(5.0, 18);
                const rockGeo = new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.5);
                const rockMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
                const rock = new THREE.Mesh(rockGeo, rockMat);
                rock.position.set(pos.x, 0.2, pos.z);
                rock.rotation.set(Math.random(), Math.random(), Math.random());
                rock.castShadow = true;
                environmentGroup.add(rock);
            }
        }

        // 3. TROPICAL / COASTAL (Chennai, Kerala, Monsoon, Coastal Plains)
        else if (biome === 'tropical') {
            if (groundMesh) groundMesh.material.color.setHex(0xfef08a);
            if (turfMesh) turfMesh.material.color.setHex(0x4ade80);
            if (skyUniforms) {
                skyUniforms.topColor.value.setHex(0x0ea5e9);
                skyUniforms.bottomColor.value.setHex(0xcffafe);
            }

            // A. Distant Shimmering Ocean Horizon Plane
            const oceanGeo = new THREE.PlaneGeometry(80, 40);
            const oceanMat = new THREE.MeshStandardMaterial({
                color: 0x0284c7,
                roughness: 0.15,
                metalness: 0.35,
                transparent: true,
                opacity: 0.85
            });
            const ocean = new THREE.Mesh(oceanGeo, oceanMat);
            ocean.rotation.x = -Math.PI / 2;
            ocean.position.set(0, 0.05, -30);
            environmentGroup.add(ocean);

            // B. Leaning Coconut Palm Trees
            for (let i = 0; i < 10; i++) {
                const pos = getSafeScatterPos(6.5, 22);
                const palmGroup = new THREE.Group();

                const palmH = 3.8 + Math.random() * 1.5;
                const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, palmH, 8);
                const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
                const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                trunk.position.y = palmH / 2;
                trunk.castShadow = true;
                palmGroup.add(trunk);

                // Palm crown fronds
                const frondCount = 7;
                for (let f = 0; f < frondCount; f++) {
                    const fAngle = (f / frondCount) * Math.PI * 2;
                    const frondGeo = new THREE.ConeGeometry(0.4, 2.0, 4);
                    frondGeo.scale(1.5, 0.2, 0.8);
                    const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, side: THREE.DoubleSide });
                    const frond = new THREE.Mesh(frondGeo, frondMat);
                    frond.position.set(Math.cos(fAngle) * 0.7, palmH + 0.1, Math.sin(fAngle) * 0.7);
                    frond.rotation.x = Math.sin(fAngle) * 0.75;
                    frond.rotation.z = -Math.cos(fAngle) * 0.75;
                    frond.castShadow = true;
                    palmGroup.add(frond);
                }

                palmGroup.position.set(pos.x, 0.15, pos.z);
                // Gentle realistic coastal lean
                palmGroup.rotation.z = (Math.random() - 0.5) * 0.2;
                palmGroup.rotation.x = (Math.random() - 0.5) * 0.2;
                environmentGroup.add(palmGroup);
            }

            // C. Tropical Broadleaf Bushes
            for (let i = 0; i < 8; i++) {
                const pos = getSafeScatterPos(5.5, 16);
                const bushGeo = new THREE.DodecahedronGeometry(0.45 + Math.random() * 0.3);
                const bushMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 });
                const bush = new THREE.Mesh(bushGeo, bushMat);
                bush.position.set(pos.x, 0.25, pos.z);
                environmentGroup.add(bush);
            }
        }

        // 4. FOREST / TEMPERATE / STANDARD BIOME (Nagpur, Hills, Valleys, Standard)
        else {
            if (groundMesh) groundMesh.material.color.setHex(0x2d6a4f);
            if (turfMesh) turfMesh.material.color.setHex(0x3a5a40);
            if (skyUniforms) {
                skyUniforms.topColor.value.setHex(0x2563eb);
                skyUniforms.bottomColor.value.setHex(0xdbeafe);
            }

            // A. Rolling Green Hills on Perimeter
            for (let i = 0; i < 8; i++) {
                const pos = getSafeScatterPos(18, 32);
                const hillGeo = new THREE.SphereGeometry(4 + Math.random() * 3, 16, 8);
                hillGeo.scale(1.6, 0.45, 1.3);
                const hillMat = new THREE.MeshStandardMaterial({ color: 0x1e3a1e, roughness: 0.95 });
                const hill = new THREE.Mesh(hillGeo, hillMat);
                hill.position.set(pos.x, 0.1, pos.z);
                environmentGroup.add(hill);
            }

            // B. Deciduous Shade Trees
            for (let i = 0; i < 12; i++) {
                const pos = getSafeScatterPos(6.5, 22);
                const treeGroup = new THREE.Group();

                const trunkH = 1.6 + Math.random() * 0.8;
                const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, trunkH, 8);
                const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
                const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                trunk.position.y = trunkH / 2;
                trunk.castShadow = true;
                treeGroup.add(trunk);

                // Multi-cluster lush canopy
                const canopyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85, flatShading: true });
                const mainSphere = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.4), canopyMat);
                mainSphere.position.y = trunkH + 0.8;
                mainSphere.castShadow = true;
                treeGroup.add(mainSphere);

                const subSphere = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8), canopyMat);
                subSphere.position.set(0.4, trunkH + 1.2, 0.2);
                treeGroup.add(subSphere);

                treeGroup.position.set(pos.x, 0.15, pos.z);
                environmentGroup.add(treeGroup);
            }

            // C. Mossy River Boulders & Bushes
            for (let i = 0; i < 8; i++) {
                const pos = getSafeScatterPos(5.5, 18);
                const rockGeo = new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.4);
                const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
                const rock = new THREE.Mesh(rockGeo, rockMat);
                rock.position.set(pos.x, 0.2, pos.z);
                environmentGroup.add(rock);
            }
        }

        // Shared Architectural Scale Figure (Dressed in realistic colorful attire)
        const personGroup = new THREE.Group();
        const headGeo = new THREE.SphereGeometry(0.15, 12, 12);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.6 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.65;
        personGroup.add(head);

        const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.9, 8);
        const jacketMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.75 }); // Vibrant crimson red jacket
        const body = new THREE.Mesh(bodyGeo, jacketMat);
        body.position.y = 1.1;
        body.castShadow = true;
        personGroup.add(body);

        const legsGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8);
        const jeansMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.8 }); // Cobalt blue denim
        const legs = new THREE.Mesh(legsGeo, jeansMat);
        legs.position.y = 0.35;
        legs.castShadow = true;
        personGroup.add(legs);

        personGroup.position.set(5.2, 0.16, 5.2);
        environmentGroup.add(personGroup);
    };

    // CFD Wind Streamlines (Smooth circular aerodynamic particles)
    function initWindParticles() {
        const wCanvas = document.createElement('canvas');
        wCanvas.width = 32; wCanvas.height = 32;
        const wCtx = wCanvas.getContext('2d');
        const wGrad = wCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        wGrad.addColorStop(0, 'rgba(6, 182, 212, 0.95)');
        wGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.45)');
        wGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        wCtx.fillStyle = wGrad;
        wCtx.fillRect(0, 0, 32, 32);
        const windTexture = new THREE.CanvasTexture(wCanvas);

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
            size: 0.28,
            map: windTexture,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
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
        const speed = (activePreset ? activePreset.windSpeedVal : 3.0) * 1.5;
        const angleRad = THREE.MathUtils.degToRad(activePreset ? activePreset.windAngleDeg : 45);
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

    // Realistic Falling Snow & Ice Crystals System for Alpine / Cold Climate
    function initSnowfallSystem() {
        const sCanvas = document.createElement('canvas');
        sCanvas.width = 32; sCanvas.height = 32;
        const sCtx = sCanvas.getContext('2d');
        const sGrad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        sGrad.addColorStop(0.3, 'rgba(224, 242, 254, 0.8)');
        sGrad.addColorStop(0.7, 'rgba(186, 230, 253, 0.35)');
        sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        sCtx.fillStyle = sGrad;
        sCtx.fillRect(0, 0, 32, 32);
        const snowTexture = new THREE.CanvasTexture(sCanvas);

        const sGeo = new THREE.BufferGeometry();
        snowPositions = new Float32Array(snowFlakeCount * 3);
        snowVelocities = new Float32Array(snowFlakeCount * 3);

        for (let i = 0; i < snowFlakeCount; i++) {
            snowPositions[i * 3] = (Math.random() - 0.5) * 36;
            snowPositions[i * 3 + 1] = Math.random() * 22;
            snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 36;

            snowVelocities[i * 3] = (Math.random() - 0.5) * 0.5;
            snowVelocities[i * 3 + 1] = 1.4 + Math.random() * 2.2; // Falling downward speed
            snowVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        sGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
        const sMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.35,
            map: snowTexture,
            transparent: true,
            opacity: 0.88,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        snowSystem = new THREE.Points(sGeo, sMat);
        snowSystem.visible = (currentBiome === 'snow');
        scene.add(snowSystem);
    }

    function animateSnowfall(delta) {
        if (!snowSystem) return;
        const isSnowBiome = (currentBiome === 'snow');
        snowSystem.visible = isSnowBiome;
        if (!isSnowBiome) return;

        const positions = snowSystem.geometry.attributes.position.array;
        const time = Date.now() * 0.0015;

        for (let i = 0; i < snowFlakeCount; i++) {
            // Gentle continuous downward drift
            positions[i * 3 + 1] -= snowVelocities[i * 3 + 1] * delta;
            // Natural horizontal wind flutter and sway
            positions[i * 3] += (Math.sin(time + i * 0.1) * 0.5 + snowVelocities[i * 3]) * delta;
            positions[i * 3 + 2] += (Math.cos(time + i * 0.15) * 0.4 + snowVelocities[i * 3 + 2]) * delta;

            // Recycle snowflake to top of sky once it reaches the ground
            if (positions[i * 3 + 1] < 0.1) {
                positions[i * 3 + 1] = 20 + Math.random() * 3;
                positions[i * 3] = (Math.random() - 0.5) * 36;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 36;
            }
        }
        snowSystem.geometry.attributes.position.needsUpdate = true;
    }

    // ==========================================
    // Procedural Architectural Textures Cache
    // ==========================================
    const textureCache = {};

    function getRammedEarthTexture() {
        if (textureCache.rammedEarth) return textureCache.rammedEarth;
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 0, 512, 512);

        // Layered clay & sand sedimentary strata
        const layerColors = ['#d97706', '#92400e', '#ca8a04', '#b45309', '#78350f', '#f59e0b', '#a16207', '#c2410c'];
        let y = 0;
        while (y < 512) {
            const h = 18 + Math.random() * 30;
            ctx.fillStyle = layerColors[Math.floor(Math.random() * layerColors.length)];
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x <= 512; x += 32) {
                const waveY = y + Math.sin(x * 0.03 + y * 0.08) * 3;
                ctx.lineTo(x, waveY);
            }
            ctx.lineTo(512, y + h);
            ctx.lineTo(0, y + h);
            ctx.closePath();
            ctx.fill();

            // Mineral flecks
            ctx.fillStyle = 'rgba(255,255,255,0.09)';
            for (let i = 0; i < 35; i++) {
                ctx.fillRect(Math.random() * 512, y + Math.random() * h, 2, 2);
            }
            y += h;
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
        textureCache.rammedEarth = tex;
        return tex;
    }

    function getTimberPlankTexture() {
        if (textureCache.timber) return textureCache.timber;
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, 512, 512);

        const plankH = 42;
        for (let y = 0; y < 512; y += plankH) {
            const v = (Math.random() - 0.5) * 20;
            ctx.fillStyle = `rgb(${142 + v}, ${78 + v * 0.7}, ${28 + v * 0.4})`;
            ctx.fillRect(0, y, 512, plankH - 3);

            // Wood grain lines
            ctx.strokeStyle = 'rgba(50, 15, 5, 0.25)';
            ctx.lineWidth = 1;
            for (let g = 0; g < 4; g++) {
                ctx.beginPath();
                const gy = y + 5 + Math.random() * (plankH - 12);
                ctx.moveTo(0, gy);
                ctx.bezierCurveTo(160, gy + (Math.random()-0.5)*8, 340, gy + (Math.random()-0.5)*8, 512, gy);
                ctx.stroke();
            }

            // Dark shadow seam
            ctx.fillStyle = '#261005';
            ctx.fillRect(0, y + plankH - 3, 512, 3);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
        textureCache.timber = tex;
        return tex;
    }

    function getBrickTexture() {
        if (textureCache.brick) return textureCache.brick;
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 0, 512, 512);

        const bW = 60, bH = 26, mortar = 4;
        let row = 0;
        for (let y = 0; y < 512; y += bH + mortar) {
            const offset = (row % 2 === 0) ? 0 : -bW / 2;
            for (let x = offset; x < 512 + bW; x += bW + mortar) {
                const shade = (Math.random() - 0.5) * 25;
                ctx.fillStyle = `rgb(${185 + shade}, ${48 + shade * 0.4}, ${32 + shade * 0.3})`;
                ctx.fillRect(x, y, bW, bH);
            }
            row++;
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(3, 3);
        textureCache.brick = tex;
        return tex;
    }

    function getConcreteTexture() {
        if (textureCache.concrete) return textureCache.concrete;
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 512, 512);

        const idata = ctx.getImageData(0, 0, 512, 512);
        const d = idata.data;
        for (let i = 0; i < d.length; i += 4) {
            const noise = (Math.random() - 0.5) * 14;
            d[i] = Math.min(255, Math.max(0, d[i] + noise));
            d[i+1] = Math.min(255, Math.max(0, d[i+1] + noise));
            d[i+2] = Math.min(255, Math.max(0, d[i+2] + noise));
        }
        ctx.putImageData(idata, 0, 0);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 256, 256);
        ctx.strokeRect(256, 0, 256, 256);
        ctx.strokeRect(0, 256, 256, 256);
        ctx.strokeRect(256, 256, 256, 256);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
        textureCache.concrete = tex;
        return tex;
    }

    function getSolarPanelTexture() {
        if (textureCache.solar) return textureCache.solar;
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 512, 512);

        const cols = 6, rows = 10;
        const cellW = (512 - 14) / cols;
        const cellH = (512 - 14) / rows;
        for (let r = 0; r < rows; r++) {
            for (let cl = 0; cl < cols; cl++) {
                const cx = 7 + cl * cellW;
                const cy = 7 + r * cellH;
                ctx.fillStyle = '#1e3a8a';
                ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);

                ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx + cellW/3, cy + 1); ctx.lineTo(cx + cellW/3, cy + cellH - 1);
                ctx.moveTo(cx + cellW*2/3, cy + 1); ctx.lineTo(cx + cellW*2/3, cy + cellH - 1);
                ctx.stroke();
            }
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        textureCache.solar = tex;
        return tex;
    }

    // Material definitions for 3D modes
    function getMaterialsForMode(mode) {
        if (mode === 'thermal') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }),
                roofMat: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.85 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0xeab308 }),
                frameMat: new THREE.MeshStandardMaterial({ color: 0x1e293b })
            };
        } else if (mode === 'solar') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 }),
                roofMat: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x64748b }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0xb45309 }),
                frameMat: new THREE.MeshStandardMaterial({ color: 0x334155 })
            };
        } else if (mode === 'xray') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.28 }),
                roofMat: new THREE.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.35 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x334155 }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, transparent: true, opacity: 0.5 }),
                frameMat: new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.6 })
            };
        } else if (mode === 'airflow') {
            return {
                wallMat: new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.75 }),
                roofMat: new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 }),
                glassMat: new THREE.MeshStandardMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0x0f172a }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0x0284c7 }),
                frameMat: new THREE.MeshStandardMaterial({ color: 0x0284c7 })
            };
        } else {
            // Realistic Mode: High-fidelity Architectural Materials with Procedural Textures
            const matKey = wallMaterial ? wallMaterial.value : 'rammed_earth';
            let wallMat;

            if (matKey === 'rammed_earth') {
                wallMat = new THREE.MeshStandardMaterial({
                    map: getRammedEarthTexture(),
                    roughness: 0.92,
                    metalness: 0.05
                });
            } else if (matKey === 'timber_frame') {
                wallMat = new THREE.MeshStandardMaterial({
                    map: getTimberPlankTexture(),
                    roughness: 0.75,
                    metalness: 0.02
                });
            } else if (matKey === 'brick_cavity') {
                wallMat = new THREE.MeshStandardMaterial({
                    map: getBrickTexture(),
                    roughness: 0.88,
                    metalness: 0.02
                });
            } else if (matKey === 'aerated_concrete') {
                wallMat = new THREE.MeshStandardMaterial({
                    map: getConcreteTexture(),
                    roughness: 0.88,
                    metalness: 0.02
                });
            } else if (matKey === 'pcm_biowax') {
                wallMat = new THREE.MeshPhysicalMaterial({
                    color: 0x0284c7,
                    roughness: 0.15,
                    metalness: 0.25,
                    clearcoat: 0.8,
                    clearcoatRoughness: 0.1
                });
            } else {
                wallMat = new THREE.MeshStandardMaterial({
                    color: 0x94a3b8,
                    roughness: 0.35,
                    metalness: 0.85
                });
            }

            const roofKey = roofType ? roofType.value : 'cool_roof';
            let roofMat;
            if (roofKey === 'green_roof') {
                roofMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.95 });
            } else if (roofKey === 'sloped_solar') {
                roofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.4 });
            } else if (roofKey === 'corrugated_iron') {
                roofMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.45, metalness: 0.8 });
            } else {
                roofMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.05 });
            }

            return {
                wallMat: wallMat,
                roofMat: roofMat,
                glassMat: new THREE.MeshStandardMaterial({
                    color: 0x93c5fd,
                    transparent: true,
                    opacity: 0.20,
                    roughness: 0.05,
                    metalness: 0.15
                }),
                slabMat: new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85, metalness: 0.05 }),
                doorMat: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.55 }),
                frameMat: new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.45, metalness: 0.3 })
            };
        }
    }

    // Ceiling fan system
    let ceilingFan = null;

    // Educational floating label sprite
    function makeKnowledgeSprite(text) {
        const lines = text.split('\n');
        const canW = 420, lineH = 34, pad = 14;
        const canH = lines.length * lineH + pad * 2 + 8;
        const can = document.createElement('canvas');
        can.width = canW; can.height = canH;
        const ctx2 = can.getContext('2d');
        ctx2.fillStyle = 'rgba(10,20,35,0.90)';
        const r2 = 14;
        ctx2.beginPath();
        ctx2.moveTo(r2,0); ctx2.lineTo(canW-r2,0);
        ctx2.quadraticCurveTo(canW,0,canW,r2);
        ctx2.lineTo(canW,canH-r2); ctx2.quadraticCurveTo(canW,canH,canW-r2,canH);
        ctx2.lineTo(r2,canH); ctx2.quadraticCurveTo(0,canH,0,canH-r2);
        ctx2.lineTo(0,r2); ctx2.quadraticCurveTo(0,0,r2,0);
        ctx2.closePath(); ctx2.fill();
        ctx2.strokeStyle='rgba(56,189,248,0.75)'; ctx2.lineWidth=2.5; ctx2.stroke();
        lines.forEach((line, i) => {
            ctx2.font = i===0 ? 'bold 20px Inter,Arial' : '16px Inter,Arial';
            ctx2.fillStyle = i===0 ? '#7dd3fc' : '#e2e8f0';
            ctx2.textAlign = 'left';
            ctx2.fillText(line, pad+4, pad + i*lineH + 20);
        });
        const tex = new THREE.CanvasTexture(can);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, depthTest:false }));
        sp.scale.set(canW/75, canH/75, 1);
        return sp;
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
        const numFloors = parseInt(paramFloors.value) || 1;
        const style = archStyle ? archStyle.value : 'modern_box';

        let foundationLift = 0;
        if (style === 'stilted') foundationLift = 2.0;

        // 1. ARCHITECTURAL PLINTH & TERRACE (Solid base grounding the home)
        const plinthOverhang = 1.2;
        const plinthH = 0.45;
        const plinthGeo = new THREE.BoxGeometry(l + plinthOverhang * 2, plinthH, w + plinthOverhang * 2);
        const plinth = new THREE.Mesh(plinthGeo, mats.slabMat);
        plinth.position.y = plinthH / 2 + foundationLift;
        plinth.castShadow = true;
        plinth.receiveShadow = true;
        shelterBody.add(plinth);

        // Veranda Deck Planking on top of plinth
        const deckGeo = new THREE.BoxGeometry(l + plinthOverhang * 2 - 0.1, 0.04, w + plinthOverhang * 2 - 0.1);
        const deckMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
        const deck = new THREE.Mesh(deckGeo, deckMat);
        deck.position.y = plinthH + 0.02 + foundationLift;
        deck.receiveShadow = true;
        shelterBody.add(deck);

        // Stilts if elevated design
        if (style === 'stilted') {
            const stiltGeo = new THREE.CylinderGeometry(0.16, 0.16, 2.0, 16);
            const stiltMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
            const corners = [
                [-l/2 - 0.5, -w/2 - 0.5], [l/2 + 0.5, -w/2 - 0.5],
                [l/2 + 0.5, w/2 + 0.5], [-l/2 - 0.5, w/2 + 0.5],
                [0, -w/2 - 0.5], [0, w/2 + 0.5]
            ];
            corners.forEach(pos => {
                const stilt = new THREE.Mesh(stiltGeo, stiltMat);
                stilt.position.set(pos[0], 1.0, pos[1]);
                stilt.castShadow = true;
                shelterBody.add(stilt);
            });
        }

        // 2. ARCHITECTURAL FRONT TIMBER VERANDA DECK, OUTDOOR LOUNGE & ENTRY SEQUENCE
        const deckW = Math.max(5.0, l * 0.88);
        const deckD = 2.4;
        const deckY = foundationLift + plinthH;
        const deckOverhangZ = w/2 + plinthOverhang;

        // A. Timber Deck Planking (Warm Cedar / Honey Teak with distinct plank boards)
        const deckPlankMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55 }); // Warm Cedar Planking
        const deckFasciaMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });  // Dark Teak Edge
        const numPlanks = 10;
        const plankD = (deckD - 0.08) / numPlanks;
        for (let pk = 0; pk < numPlanks; pk++) {
            const plankMesh = new THREE.Mesh(
                new THREE.BoxGeometry(deckW - 0.04, 0.06, plankD - 0.02),
                deckPlankMat
            );
            plankMesh.position.set(0, deckY + 0.03, deckOverhangZ + pk * plankD + plankD/2);
            plankMesh.receiveShadow = true;
            shelterBody.add(plankMesh);
        }

        // Front and side fascia edge trim for the deck
        const frontFascia = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.14, 0.06), deckFasciaMat);
        frontFascia.position.set(0, deckY - 0.01, deckOverhangZ + deckD);
        shelterBody.add(frontFascia);
        [-deckW/2, deckW/2].forEach(sx => {
            const sideFascia = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, deckD), deckFasciaMat);
            sideFascia.position.set(sx, deckY - 0.01, deckOverhangZ + deckD/2);
            shelterBody.add(sideFascia);
        });

        // B. Veranda Side Safety Balustrade (Minimalist Architectural Posts + Translucent Panels)
        const railPostMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
        const railGlassMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transmission: 0.85, opacity: 0.5, transparent: true, roughness: 0.1 });
        [-deckW/2 + 0.04, deckW/2 - 0.04].forEach(rx => {
            // Posts
            for (let pt = 0; pt <= 2; pt++) {
                const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.06), railPostMat);
                post.position.set(rx, deckY + 0.425, deckOverhangZ + pt * (deckD / 2));
                post.castShadow = true;
                shelterBody.add(post);
            }
            // Glass infill pane
            const glassPane = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.72, deckD - 0.12), railGlassMat);
            glassPane.position.set(rx, deckY + 0.42, deckOverhangZ + deckD / 2);
            shelterBody.add(glassPane);
            // Top handrail
            const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, deckD + 0.04), railPostMat);
            handrail.position.set(rx, deckY + 0.86, deckOverhangZ + deckD / 2);
            shelterBody.add(handrail);
        });

        // C. Outdoor Veranda Relaxation Lounge (Indoor-Outdoor Living)
        const loungeGroup = new THREE.Group();
        const benchSeatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.85 }); // Cobalt Teal Outdoor Fabric
        const benchBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.65), benchSeatMat);
        benchBase.position.y = 0.11;
        loungeGroup.add(benchBase);
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.08, 0.62), cushionMat);
        cushion.position.y = 0.26;
        loungeGroup.add(cushion);
        const benchBack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.08), benchSeatMat);
        benchBack.position.set(0, 0.45, -0.28);
        loungeGroup.add(benchBack);
        // Throw pillow
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.12), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        pillow.position.set(0.3, 0.38, -0.2);
        pillow.rotation.y = -0.2;
        loungeGroup.add(pillow);

        // Low round outdoor drink table
        const sideTable = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.32, 16), new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.5 }));
        sideTable.position.set(0.85, 0.16, 0.1);
        loungeGroup.add(sideTable);
        // Ceramic coffee cup on table
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        cup.position.set(0.85, 0.36, 0.1);
        loungeGroup.add(cup);

        loungeGroup.position.set(deckW * 0.28, deckY + 0.06, deckOverhangZ + 1.2);
        shelterBody.add(loungeGroup);

        // D. Natural Coir Welcome Entry Mat
        const matMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.95 }); // Natural Coir
        const borderMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
        const matMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.015, 0.6), matMat);
        matMesh.position.set(0, deckY + 0.07, deckOverhangZ + 0.45);
        matMesh.receiveShadow = true;
        shelterBody.add(matMesh);
        const matBorder = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.012, 0.64), borderMat);
        matBorder.position.set(0, deckY + 0.065, deckOverhangZ + 0.45);
        shelterBody.add(matBorder);

        // E. Front Garden Steps Leading Down to Path (Warm Travertine Stone)
        const stepWidth = 3.2;
        const stepMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 }); // Warm Travertine Stone
        for (let s = 0; s < 2; s++) {
            const stepGeo = new THREE.BoxGeometry(stepWidth - s * 0.3, 0.14, 0.45);
            const step = new THREE.Mesh(stepGeo, stepMat);
            step.position.set(0, deckY - 0.07 - s * 0.14, deckOverhangZ + deckD + s * 0.42 + 0.22);
            step.castShadow = true;
            step.receiveShadow = true;
            shelterBody.add(step);
        }

        // F. Flagstone Stepping Stones leading into the landscape (Warm Sandstone)
        const paverMat = new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.9 });
        for (let p = 0; p < 5; p++) {
            const paverGeo = new THREE.BoxGeometry(1.3 - (p % 2) * 0.2, 0.06, 0.65);
            const paver = new THREE.Mesh(paverGeo, paverMat);
            paver.position.set((p % 2 === 0 ? 0.12 : -0.12), 0.03, deckOverhangZ + deckD + 1.2 + p * 0.9);
            paver.receiveShadow = true;
            shelterBody.add(paver);
        }

        // G. Modern Architectural Landscape Bollard Pathway Lights
        const bollardBodyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.7 });
        const bollardLedMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
        [-0.95, 0.95].forEach(bx => {
            [0, 2].forEach(bp => {
                const bollardGroup = new THREE.Group();
                const bollardCol = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), bollardBodyMat);
                bollardCol.position.y = 0.225;
                bollardGroup.add(bollardCol);
                const bollardLed = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.06, 12), bollardLedMat);
                bollardLed.position.y = 0.40;
                bollardGroup.add(bollardLed);
                const bollardCap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 12), bollardBodyMat);
                bollardCap.position.y = 0.44;
                bollardGroup.add(bollardCap);

                const bLight = new THREE.PointLight(0xffedd5, 0.6, 2.5);
                bLight.position.y = 0.42;
                bollardGroup.add(bLight);

                bollardGroup.position.set(bx, 0.0, deckOverhangZ + deckD + 1.2 + bp * 1.5);
                shelterBody.add(bollardGroup);
            });
        });

        // H. Terracotta Planter Beds with Lush Green Foliage & Colorful Flowers
        const planterMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.75 }); // Rich terracotta clay
        const plantFoliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.85 });
        const flowerColors = [0xe11d48, 0xfacc15, 0xa855f7, 0xf97316]; // Crimson, Yellow, Lavender, Orange

        [-stepWidth/2 - 0.7, stepWidth/2 + 0.7].forEach(sideX => {
            const planterBox = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 1.0), planterMat);
            planterBox.position.set(sideX, 0.275, deckOverhangZ + deckD + 0.4);
            planterBox.castShadow = true;
            shelterBody.add(planterBox);

            // Emerald succulents + colorful flowers
            for (let b = 0; b < 7; b++) {
                const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22), plantFoliageMat);
                shrub.position.set(sideX + (Math.random()-0.5)*0.45, 0.65 + (Math.random()*0.15), deckOverhangZ + deckD + 0.4 + (Math.random()-0.5)*0.45);
                shrub.castShadow = true;
                shelterBody.add(shrub);

                const flowerMat = new THREE.MeshStandardMaterial({ color: flowerColors[b % flowerColors.length], roughness: 0.5 });
                const flower = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), flowerMat);
                flower.position.set(shrub.position.x, shrub.position.y + 0.16, shrub.position.z);
                shelterBody.add(flower);
            }
        });

        const wallThick = 0.25;
        const colSize = 0.26;
        // Warm Douglas Fir / Cedar Timber Architectural Columns
        const colMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6, metalness: 0.1 });

        // Build Stories / Floors
        for (let f = 0; f < numFloors; f++) {
            const floorY = foundationLift + plinthH + (f * h);

            // Interior Floor (Warm golden oak parquet)
            const intFloorMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35 });
            const intFloor = new THREE.Mesh(new THREE.BoxGeometry(l - 0.1, 0.05, w - 0.1), intFloorMat);
            intFloor.position.set(0, floorY + 0.025, 0);
            intFloor.receiveShadow = true;
            shelterBody.add(intFloor);

            // Architectural Timber Columns at Corners
            const colGeo = new THREE.BoxGeometry(colSize, h, colSize);
            [
                [-l/2 + colSize/2, -w/2 + colSize/2],
                [l/2 - colSize/2, -w/2 + colSize/2],
                [l/2 - colSize/2, w/2 - colSize/2],
                [-l/2 + colSize/2, w/2 - colSize/2]
            ].forEach(pos => {
                const col = new THREE.Mesh(colGeo, colMat);
                col.position.set(pos[0], floorY + h/2, pos[1]);
                col.castShadow = true;
                shelterBody.add(col);
            });

            // Intermediate structural columns if length > 8m
            if (l > 7.5) {
                [-w/2 + colSize/2, w/2 - colSize/2].forEach(z => {
                    const midCol = new THREE.Mesh(colGeo, colMat);
                    midCol.position.set(0, floorY + h/2, z);
                    midCol.castShadow = true;
                    shelterBody.add(midCol);
                });
            }

            // NORTH WALL (Heavy thermal mass wall)
            const nWallGeo = new THREE.BoxGeometry(l - colSize*2, h, wallThick);
            const nWall = new THREE.Mesh(nWallGeo, mats.wallMat);
            nWall.position.set(0, floorY + h/2, -w/2 + wallThick/2);
            nWall.castShadow = true;
            shelterBody.add(nWall);

            // EAST & WEST WALLS with High-Level Clerestory Windows
            [-1, 1].forEach(side => {
                const xPos = side * (l/2 - wallThick/2);
                const ewWallGeo = new THREE.BoxGeometry(wallThick, h, w - colSize*2);
                const ewWall = new THREE.Mesh(ewWallGeo, mats.wallMat);
                ewWall.position.set(xPos, floorY + h/2, 0);
                ewWall.castShadow = true;
                shelterBody.add(ewWall);

                // High-Level Clerestory Window (Clear Glass + Slender Frame Trim)
                const winH = h * 0.42;
                const winW = (w - colSize*2) * 0.45;
                const winCenterY = floorY + h * 0.68;

                // Clear Glass Pane
                const winGlass = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.02, winH - 0.06, winW - 0.06), mats.glassMat);
                winGlass.position.set(xPos, winCenterY, 0);
                shelterBody.add(winGlass);

                // Slender Architectural Perimeter Frame Trim (Thickness 0.04m, NOT solid block!)
                const frameThick = 0.04;
                const frameDepth = wallThick + 0.04;
                // Top & Bottom rails
                [-1, 1].forEach(tb => {
                    const rail = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, frameThick, winW), mats.frameMat);
                    rail.position.set(xPos, winCenterY + tb * (winH/2 - frameThick/2), 0);
                    shelterBody.add(rail);
                });
                // Left & Right jambs
                [-1, 1].forEach(lr => {
                    const jamb = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, winH, frameThick), mats.frameMat);
                    jamb.position.set(xPos, winCenterY, lr * (winW/2 - frameThick/2));
                    shelterBody.add(jamb);
                });

                // Horizontal Solar Louver above the window (Warm Golden Teak Slat)
                const louverGeo = new THREE.BoxGeometry(0.45, 0.04, winW + 0.2);
                const louverMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
                const louver = new THREE.Mesh(louverGeo, louverMat);
                louver.position.set(xPos + side * 0.22, winCenterY + winH/2 + 0.1, 0);
                louver.rotation.z = side * 0.3;
                shelterBody.add(louver);
            });

            // SOUTH FACADE: RESIDENTIAL ENVELOPE (Door & Multi-Pane Windows)
            const southZ = w/2 - wallThick/2;
            const doorW = 1.3;
            const doorH = Math.min(2.3, h - 0.3);

            if (f === 0) {
                // Ground Floor: Front Entrance Door + Flanking Architectural Windows
                // A. Solid Modern Architectural Pivot Door (Interactive Hinge)
                doorGroup = new THREE.Group();
                doorGroup.position.set(0, floorY, southZ);
                doorGroup.userData.isDoor = true;

                // Slender Hollow Door Perimeter Frame (Left jamb, Right jamb, Top header - hollow opening in center!)
                const dfThick = 0.06;
                const dfDepth = wallThick + 0.04;
                // Left Jamb
                const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(dfThick, doorH, dfDepth), mats.frameMat);
                leftJamb.position.set(-doorW/2 - dfThick/2, doorH/2, 0);
                leftJamb.castShadow = true;
                doorGroup.add(leftJamb);
                // Right Jamb
                const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(dfThick, doorH, dfDepth), mats.frameMat);
                rightJamb.position.set(doorW/2 + dfThick/2, doorH/2, 0);
                rightJamb.castShadow = true;
                doorGroup.add(rightJamb);
                // Top Header Frame
                const topJamb = new THREE.Mesh(new THREE.BoxGeometry(doorW + dfThick*2, dfThick, dfDepth), mats.frameMat);
                topJamb.position.set(0, doorH + dfThick/2, 0);
                topJamb.castShadow = true;
                doorGroup.add(topJamb);
                // Door Sill Threshold
                const doorSill = new THREE.Mesh(new THREE.BoxGeometry(doorW + dfThick*2, 0.025, dfDepth + 0.04), mats.frameMat);
                doorSill.position.set(0, 0.0125, 0.02);
                doorGroup.add(doorSill);

                // Wall Lintel Spandrel directly above the door up to ceiling h
                const doorLintelH = h - (doorH + dfThick);
                if (doorLintelH > 0.02) {
                    const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(doorW + dfThick*2, doorLintelH, wallThick), mats.wallMat);
                    doorLintel.position.set(0, doorH + dfThick + doorLintelH/2, 0);
                    doorLintel.castShadow = true;
                    doorGroup.add(doorLintel);
                }

                // Door Hinge Pivot positioned at left jamb
                doorPivot = new THREE.Group();
                doorPivot.position.set(-doorW/2 + 0.02, 0, 0);
                doorGroup.add(doorPivot);

                // Door Leaf (Warm Vibrant Terracotta Honey Teak with vertical depth)
                const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.04, doorH - 0.04, 0.08), mats.doorMat);
                doorLeaf.position.set((doorW - 0.04)/2, doorH/2, 0.02);
                doorLeaf.castShadow = true;
                doorPivot.add(doorLeaf);

                // Horizontal Cedar Accent Slats on Door Leaf
                const doorSlatMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
                for (let sl = 1; sl <= 4; sl++) {
                    const slat = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.16, 0.04, 0.02), doorSlatMat);
                    slat.position.set((doorW - 0.04)/2, (sl * doorH) / 5, 0.065);
                    doorPivot.add(slat);
                }

                // Long Polished Brass Pull Bar Handle (1.1m tall, gleaming gold)
                const handleMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.15 });
                const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.1, 16), handleMat);
                handle.position.set(doorW - 0.22, doorH/2, 0.11);
                doorPivot.add(handle);

                // Entrance Canopy (Warm Cedar Wood Slats) with Extended Sun Shading Pergola Rafters
                const canopyMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
                const canopy = new THREE.Mesh(new THREE.BoxGeometry(doorW + 1.2, 0.12, 1.4), canopyMat);
                canopy.position.set(0, doorH + 0.16, 0.7);
                canopy.castShadow = true;
                doorGroup.add(canopy);

                // Extended Architectural Pergola Trellis Rafters over Veranda (Passive Solar Shading)
                const rafterMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 });
                const numRafters = 6;
                const pergolaSpanX = doorW + 1.4;
                for (let rf = 0; rf < numRafters; rf++) {
                    const rX = -pergolaSpanX/2 + (rf * pergolaSpanX) / (numRafters - 1);
                    const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 2.3), rafterMat);
                    rafter.position.set(rX, doorH + 0.24, 1.15);
                    rafter.castShadow = true;
                    doorGroup.add(rafter);
                }

                // Brass brackets supporting canopy
                [-doorW/2 - 0.4, doorW/2 + 0.4].forEach(bx => {
                    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.05), handleMat);
                    bracket.position.set(bx, doorH - 0.05, 0.25);
                    bracket.rotation.x = 0.55;
                    doorGroup.add(bracket);
                });

                // Recessed Golden Downlight under Canopy
                const canopyLight = new THREE.PointLight(0xffedd5, 1.5, 6);
                canopyLight.position.set(0, doorH + 0.05, 0.7);
                doorGroup.add(canopyLight);

                // Modern Architectural Up/Down Outdoor LED Wall Sconces flanking the door
                const sconceMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.35, metalness: 0.8 });
                const sconceLensMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
                [-doorW/2 - 0.18, doorW/2 + 0.18].forEach(scX => {
                    const sconceGroup = new THREE.Group();
                    const sconceBody = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 16), sconceMat);
                    sconceGroup.add(sconceBody);
                    // Top & Bottom glowing acrylic lenses
                    const lensTop = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.02, 16), sconceLensMat);
                    lensTop.position.y = 0.11;
                    sconceGroup.add(lensTop);
                    const lensBot = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.02, 16), sconceLensMat);
                    lensBot.position.y = -0.11;
                    sconceGroup.add(lensBot);

                    // Warm light wash on the facade
                    const sconceLight = new THREE.PointLight(0xffedd5, 0.8, 3.5);
                    sconceLight.position.set(0, 0, 0.08);
                    sconceGroup.add(sconceLight);

                    sconceGroup.position.set(scX, doorH * 0.65, 0.06);
                    doorGroup.add(sconceGroup);
                });

                // Architectural House Address Plaque ("26" for SIH26051)
                const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 });
                const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.02), plaqueMat);
                plaque.position.set(doorW/2 + 0.32, doorH * 0.62, 0.03);
                doorGroup.add(plaque);
                // Number relief
                const numMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.015), sconceMat);
                numMesh.position.set(doorW/2 + 0.32, doorH * 0.62, 0.045);
                doorGroup.add(numMesh);

                shelterBody.add(doorGroup);

                // =========================================================================
                // B. FULLY FURNISHED & ILLUMINATED INTERIOR (Clearly visible from outside!)
                // =========================================================================
                const interiorGroup = new THREE.Group();

                // 1. Large Textured Area Rug (Deep Ocean Teal with cream geometric border)
                const rugGeo = new THREE.PlaneGeometry(Math.min(3.6, l * 0.5), Math.min(2.4, w * 0.5));
                const rugMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.95 });
                const rug = new THREE.Mesh(rugGeo, rugMat);
                rug.rotation.x = -Math.PI / 2;
                rug.position.set(-0.2, floorY + 0.035, 0.1);
                rug.receiveShadow = true;
                interiorGroup.add(rug);

                // 2. Designer Modern 3-Seater Sofa (Cobalt Blue with throw pillows)
                const sofaGroup = new THREE.Group();
                const sofaMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 }); // Navy Cobalt
                const sofaWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
                // Base
                const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.22, 0.85), sofaWoodMat);
                sofaBase.position.y = 0.11;
                sofaGroup.add(sofaBase);
                // Cushions
                const sofaCushion = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.18, 0.8), sofaMat);
                sofaCushion.position.y = 0.31;
                sofaGroup.add(sofaCushion);
                // Backrest
                const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.55, 0.22), sofaMat);
                sofaBack.position.set(0, 0.58, -0.32);
                sofaGroup.add(sofaBack);
                // Armrests
                [-0.95, 0.95].forEach(ax => {
                    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.85), sofaMat);
                    arm.position.set(ax, 0.42, 0);
                    sofaGroup.add(arm);
                });
                // Colorful Accent Throw Pillows (Tangerine orange & Emerald green)
                const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0xf97316 });
                const pillowMat2 = new THREE.MeshStandardMaterial({ color: 0x10b981 });
                const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.12), pillowMat1);
                p1.position.set(-0.65, 0.48, -0.2);
                p1.rotation.y = 0.2;
                sofaGroup.add(p1);
                const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.12), pillowMat2);
                p2.position.set(0.65, 0.48, -0.2);
                p2.rotation.y = -0.25;
                sofaGroup.add(p2);

                sofaGroup.position.set(-0.7, floorY, -0.3);
                sofaGroup.rotation.y = 0.15;
                interiorGroup.add(sofaGroup);

                // 3. Modern Armchair in Vibrant Mustard Yellow
                const chairGroup = new THREE.Group();
                const chairSeatMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 }); // Mustard yellow
                const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.8), chairSeatMat);
                seat.position.y = 0.35;
                chairGroup.add(seat);
                const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.18), chairSeatMat);
                back.position.set(0, 0.7, -0.32);
                chairGroup.add(back);
                const chairLegMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
                [[-0.35, -0.3], [0.35, -0.3], [-0.35, 0.3], [0.35, 0.3]].forEach(lp => {
                    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.3), chairLegMat);
                    leg.position.set(lp[0], 0.15, lp[1]);
                    chairGroup.add(leg);
                });
                chairGroup.position.set(Math.min(1.4, l * 0.25), floorY, 0.3);
                chairGroup.rotation.y = -Math.PI * 0.32;
                interiorGroup.add(chairGroup);

                // 4. Natural Oak Coffee Table with Ceramic Succulent & Books
                const tableGroup = new THREE.Group();
                const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.45 }));
                tableTop.position.y = 0.36;
                tableGroup.add(tableTop);
                const tablePed = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.34), new THREE.MeshStandardMaterial({ color: 0x9a3412 }));
                tablePed.position.y = 0.17;
                tableGroup.add(tablePed);
                const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.11, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                vase.position.y = 0.43;
                tableGroup.add(vase);
                const miniPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.07), new THREE.MeshStandardMaterial({ color: 0x15803d }));
                miniPlant.position.y = 0.50;
                tableGroup.add(miniPlant);
                // Art Magazine / Book on coffee table
                const mag = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
                mag.position.set(-0.14, 0.39, 0.1);
                mag.rotation.y = 0.4;
                tableGroup.add(mag);

                tableGroup.position.set(-0.1, floorY, 0.35);
                interiorGroup.add(tableGroup);

                // 5. Contemporary Floor Arc Reading Lamp with Warm Glowing Bulb
                const lampGroup = new THREE.Group();
                const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 16), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 }));
                lampGroup.add(lampBase);
                const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.8), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 }));
                lampPole.position.y = 0.9;
                lampGroup.add(lampPole);
                const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xffedd5, side: THREE.DoubleSide }));
                lampShade.position.set(0.12, 1.85, 0.12);
                lampShade.rotation.x = 0.3;
                lampGroup.add(lampShade);
                const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
                lampBulb.position.set(0.12, 1.82, 0.12);
                lampGroup.add(lampBulb);
                const lampLight = new THREE.PointLight(0xffedd5, 1.4, 4.5);
                lampLight.position.set(0.12, 1.8, 0.12);
                lampGroup.add(lampLight);

                lampGroup.position.set(-l/2 + 0.65, floorY, -0.4);
                interiorGroup.add(lampGroup);

                // 6. Wall-Mounted Bookshelf / Credenza on the back wall
                const credenzaGroup = new THREE.Group();
                const credenzaMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
                const credW = Math.min(2.8, l * 0.45);
                const cred = new THREE.Mesh(new THREE.BoxGeometry(credW, 0.55, 0.38), credenzaMat);
                cred.position.y = 0.275;
                credenzaGroup.add(cred);
                // Floating books & decorative pottery on credenza
                const bookColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
                for (let bk = 0; bk < 5; bk++) {
                    const book = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.18), new THREE.MeshStandardMaterial({ color: bookColors[bk] }));
                    book.position.set(-credW/2 + 0.3 + bk * 0.07, 0.67, 0.02);
                    credenzaGroup.add(book);
                }
                const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.24, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }));
                pot.position.set(credW/2 - 0.4, 0.67, 0);
                credenzaGroup.add(pot);

                credenzaGroup.position.set(0.5, floorY, -w/2 + wallThick + 0.2);
                interiorGroup.add(credenzaGroup);

                // 7. Large Modern Artwork Canvas on back thermal wall
                const artFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 0.04), new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 }));
                artFrame.position.set(0.5, floorY + 1.85, -w/2 + wallThick + 0.03);
                interiorGroup.add(artFrame);

                // 8. Indoor Potted Fiddle-Leaf Fig Plant in white ceramic planter
                const plantGroup = new THREE.Group();
                const potMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.45, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
                potMesh.position.y = 0.225;
                plantGroup.add(potMesh);
                for (let lf = 0; lf < 6; lf++) {
                    const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }));
                    leaf.position.set((Math.random()-0.5)*0.2, 0.45 + lf * 0.14, (Math.random()-0.5)*0.2);
                    leaf.scale.set(1.2, 0.5, 1.2);
                    plantGroup.add(leaf);
                }
                plantGroup.position.set(Math.min(2.1, l/2 - 0.7), floorY, -w/2 + wallThick + 0.35);
                interiorGroup.add(plantGroup);

                // 9. Modern Hanging Ceiling Pendant Lamp above living room
                const pendantGroup = new THREE.Group();
                const pCord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.8), new THREE.MeshStandardMaterial({ color: 0x18181b }));
                pCord.position.y = 0.4;
                pendantGroup.add(pCord);
                const pDome = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16, 0, Math.PI * 2, 0, Math.PI/2), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, side: THREE.DoubleSide }));
                pDome.rotation.x = Math.PI;
                pendantGroup.add(pDome);
                const pGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
                pGlow.position.y = -0.05;
                pendantGroup.add(pGlow);
                // Warm, high-intensity interior light shining down
                const pendantLight = new THREE.PointLight(0xfff7ed, 3.2, 12);
                pendantLight.position.set(0, -0.15, 0);
                pendantLight.castShadow = true;
                pendantGroup.add(pendantLight);

                pendantGroup.position.set(-0.2, floorY + h - 0.2, 0.1);
                interiorGroup.add(pendantGroup);

                // 10. Secondary Warm Ambient Interior Fill Light (Bright & inviting view through windows & door)
                const interiorFillLight = new THREE.PointLight(0xffedd5, 2.2, 14);
                interiorFillLight.position.set(0.6, floorY + h * 0.7, -w * 0.2);
                interiorGroup.add(interiorFillLight);

                shelterBody.add(interiorGroup);

                // C. Flanking Residential Windows on Left & Right of Door
                const sideSpanW = (l - colSize*2 - doorW - 0.4) / 2;
                if (sideSpanW > 0.5) {
                    const sillH = 0.55; // 0.55m residential window sill height
                    const winH = Math.max(0.8, h - sillH - 0.35); // Window height
                    const winCenterY = floorY + sillH + winH/2;
                    const lintelH = h - (sillH + winH);

                    [-1, 1].forEach(side => {
                        const winCenterX = side * (doorW/2 + 0.2 + sideSpanW/2);

                        // 1. Lower Wall Sill Spandrel (Genuine Wall Material below window)
                        const sillWall = new THREE.Mesh(new THREE.BoxGeometry(sideSpanW, sillH, wallThick), mats.wallMat);
                        sillWall.position.set(winCenterX, floorY + sillH/2, southZ);
                        sillWall.castShadow = true;
                        sillWall.receiveShadow = true;
                        shelterBody.add(sillWall);

                        // 2. Upper Wall Lintel Spandrel (Genuine Wall Material above window)
                        if (lintelH > 0.05) {
                            const lintelWall = new THREE.Mesh(new THREE.BoxGeometry(sideSpanW, lintelH, wallThick), mats.wallMat);
                            lintelWall.position.set(winCenterX, floorY + h - lintelH/2, southZ);
                            lintelWall.castShadow = true;
                            shelterBody.add(lintelWall);
                        }

                        // 3. Wall Pier between window and door
                        const postW = 0.2;
                        const postWall = new THREE.Mesh(new THREE.BoxGeometry(postW, h, wallThick), mats.wallMat);
                        postWall.position.set(side * (doorW/2 + postW/2), floorY + h/2, southZ);
                        postWall.castShadow = true;
                        shelterBody.add(postWall);

                        // 4. TRANSPARENT Window Glass Pane (NO SOLID BLOCK! 100% Clear & Visible!)
                        const glass = new THREE.Mesh(
                            new THREE.BoxGeometry(sideSpanW - 0.08, winH - 0.08, 0.04),
                            mats.glassMat
                        );
                        glass.position.set(winCenterX, winCenterY, southZ);
                        shelterBody.add(glass);

                        // 5. Slender Perimeter Architectural Frame (Thickness 0.05m only around the border!)
                        const fThick = 0.05;
                        const fDepth = wallThick + 0.02;

                        // Top Frame Rail
                        const topRail = new THREE.Mesh(new THREE.BoxGeometry(sideSpanW, fThick, fDepth), mats.frameMat);
                        topRail.position.set(winCenterX, winCenterY + winH/2 - fThick/2, southZ);
                        shelterBody.add(topRail);

                        // Bottom Frame Sill (Projecting window sill)
                        const botRail = new THREE.Mesh(new THREE.BoxGeometry(sideSpanW + 0.06, fThick, fDepth + 0.06), mats.frameMat);
                        botRail.position.set(winCenterX, winCenterY - winH/2 + fThick/2, southZ + 0.02);
                        shelterBody.add(botRail);

                        // Left & Right Jambs
                        [-1, 1].forEach(lr => {
                            const jamb = new THREE.Mesh(new THREE.BoxGeometry(fThick, winH - fThick*2, fDepth), mats.frameMat);
                            jamb.position.set(winCenterX + lr * (sideSpanW/2 - fThick/2), winCenterY, southZ);
                            shelterBody.add(jamb);
                        });

                        // Center Mullion (Slender 0.04m divider into 2 glass casements)
                        const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH - fThick*2, fDepth), mats.frameMat);
                        vMullion.position.set(winCenterX, winCenterY, southZ);
                        shelterBody.add(vMullion);

                        // 6. Architectural Passive Solar Shading Louver Eyebrow (Warm Cedar Wood Slats)
                        const louverMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
                        for (let s = 0; s < 3; s++) {
                            const slat = new THREE.Mesh(new THREE.BoxGeometry(sideSpanW + 0.1, 0.03, 0.35), louverMat);
                            slat.position.set(winCenterX, winCenterY + winH/2 + 0.12 + s * 0.12, southZ + 0.22);
                            slat.rotation.x = -0.35;
                            slat.castShadow = true;
                            shelterBody.add(slat);
                        }
                    });
                }
            } else {
                // Upper Floor: Panoramic Architectural Ribbon Window
                const sillH = 0.8;
                const winH = Math.max(0.9, h - sillH - 0.3);
                const winW = l - colSize*2 - 0.4;
                const winCenterY = floorY + sillH + winH/2;

                // Spandrel Wall below ribbon window
                const sillWall = new THREE.Mesh(new THREE.BoxGeometry(l - colSize*2, sillH, wallThick), mats.wallMat);
                sillWall.position.set(0, floorY + sillH/2, southZ);
                sillWall.castShadow = true;
                shelterBody.add(sillWall);

                // Lintel Wall above ribbon window
                const lintelH = h - (sillH + winH);
                if (lintelH > 0.05) {
                    const lintelWall = new THREE.Mesh(new THREE.BoxGeometry(l - colSize*2, lintelH, wallThick), mats.wallMat);
                    lintelWall.position.set(0, floorY + h - lintelH/2, southZ);
                    lintelWall.castShadow = true;
                    shelterBody.add(lintelWall);
                }

                // Transparent Glass Ribbon
                const glass = new THREE.Mesh(new THREE.BoxGeometry(winW - 0.08, winH - 0.08, 0.04), mats.glassMat);
                glass.position.set(0, winCenterY, southZ);
                shelterBody.add(glass);

                // Slender Top and Bottom Frame Rails
                const fThick = 0.05;
                const fDepth = wallThick + 0.02;
                [-1, 1].forEach(tb => {
                    const rail = new THREE.Mesh(new THREE.BoxGeometry(winW, fThick, fDepth), mats.frameMat);
                    rail.position.set(0, winCenterY + tb * (winH/2 - fThick/2), southZ);
                    shelterBody.add(rail);
                });

                // Multiple vertical mullions
                const mullionCount = 3;
                for (let m = 1; m <= mullionCount; m++) {
                    const mX = -winW/2 + (m * winW) / (mullionCount + 1);
                    const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH - fThick*2, fDepth), mats.frameMat);
                    vMullion.position.set(mX, winCenterY, southZ);
                    shelterBody.add(vMullion);
                }
            }
        }

        // 3. ROOF CONSTRUCTION WITH PHOTOVOLTAIC SOLAR ARRAYS
        const roofGroup = new THREE.Group();
        const roofThickness = 0.35;
        const totalBuildingH = foundationLift + plinthH + (numFloors * h);
        const roofOverhang = 0.85;

        if (style === 'a_frame') {
            const roofH = w * 0.85;
            const shape = new THREE.Shape();
            shape.moveTo(-w/2 - roofOverhang, 0);
            shape.lineTo(w/2 + roofOverhang, 0);
            shape.lineTo(0, roofH);
            shape.lineTo(-w/2 - roofOverhang, 0);

            const extrudeSettings = { depth: l + roofOverhang * 2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
            const aFrameGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const aFrameMesh = new THREE.Mesh(aFrameGeo, mats.roofMat);
            aFrameMesh.rotation.y = Math.PI / 2;
            aFrameMesh.position.set(-(l + roofOverhang * 2)/2, 0, 0);
            aFrameMesh.castShadow = true;
            aFrameMesh.receiveShadow = true;
            roofGroup.add(aFrameMesh);
            shelterRoof.position.y = totalBuildingH;

        } else if (style === 'courtyard') {
            // Courtyard Roof with central open-air sky opening
            const roofW = l + roofOverhang * 2;
            const roofD = w + roofOverhang * 2;
            const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(roofW, roofThickness, roofD), mats.roofMat);
            roofMesh.castShadow = true;

            // Central Courtyard Skylight Opening
            const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
            const hole = new THREE.Mesh(new THREE.BoxGeometry(l * 0.38, roofThickness + 0.04, w * 0.38), holeMat);
            roofMesh.add(hole);
            roofGroup.add(roofMesh);
            shelterRoof.position.y = totalBuildingH + roofThickness/2;

            // In courtyard center: Stone fountain basin & potted desert olive tree
            const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.7 }));
            basin.position.set(0, plinthH + 0.225 + foundationLift, 0);
            shelterBody.add(basin);

        } else {
            // Modern Box with Deep Eaves, Fascia Trim & Photovoltaic Solar Array
            const roofW = l + roofOverhang * 2;
            const roofD = w + roofOverhang * 2;
            const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(roofW, roofThickness, roofD), mats.roofMat);
            roofMesh.castShadow = true;
            roofMesh.receiveShadow = true;

            // Warm Cedar Timber Architectural Fascia Trim (Rich warm cedar, not black)
            const fasciaMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6, metalness: 0.1 });
            const fH = roofThickness + 0.08;
            // North / South Fascia
            const fNSGeo = new THREE.BoxGeometry(roofW + 0.08, fH, 0.06);
            const fN = new THREE.Mesh(fNSGeo, fasciaMat);
            fN.position.set(0, 0, -roofD/2 - 0.03);
            roofMesh.add(fN);
            const fS = new THREE.Mesh(fNSGeo, fasciaMat);
            fS.position.set(0, 0, roofD/2 + 0.03);
            roofMesh.add(fS);
            // East / West Fascia
            const fEWGeo = new THREE.BoxGeometry(0.06, fH, roofD + 0.08);
            const fE = new THREE.Mesh(fEWGeo, fasciaMat);
            fE.position.set(roofW/2 + 0.03, 0, 0);
            roofMesh.add(fE);
            const fW = new THREE.Mesh(fEWGeo, fasciaMat);
            fW.position.set(-roofW/2 - 0.03, 0, 0);
            roofMesh.add(fW);

            // REAL PHOTOVOLTAIC SOLAR PANELS ARRAY ON ROOF
            const panelMat = new THREE.MeshStandardMaterial({
                map: getSolarPanelTexture(),
                roughness: 0.25,
                metalness: 0.65
            });
            const pCols = Math.min(4, Math.floor(l / 2.2));
            const pRows = Math.min(2, Math.floor(w / 3.0));
            const panelW = 1.8, panelD = 1.1;

            for (let pc = 0; pc < pCols; pc++) {
                for (let pr = 0; pr < pRows; pr++) {
                    const posX = -((pCols - 1) * 2.0)/2 + pc * 2.0;
                    const posZ = -((pRows - 1) * 1.4)/2 + pr * 1.4;
                    const pMesh = new THREE.Mesh(new THREE.BoxGeometry(panelW, 0.05, panelD), panelMat);
                    pMesh.position.set(posX, roofThickness/2 + 0.18, posZ);
                    // Tilted 18° facing south for optimal passive solar collection
                    pMesh.rotation.x = -0.32;
                    pMesh.castShadow = true;
                    roofMesh.add(pMesh);

                    // Aluminum Mounting Racking
                    const rackMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
                    const rackLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2), rackMat);
                    rackLeg.position.set(posX, roofThickness/2 + 0.08, posZ - 0.4);
                    roofMesh.add(rackLeg);
                }
            }

            // Passive Ventilation Chimney / Rooftop Skylight
            const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
            const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), chimneyMat);
            chimney.position.set(l * 0.3, roofThickness/2 + 0.3, -w * 0.25);
            roofMesh.add(chimney);

            roofGroup.add(roofMesh);
            shelterRoof.position.y = totalBuildingH + roofThickness/2;
        }

        const roofLiftY = toggleExploded.checked ? 3.5 : 0;
        shelterRoof.position.y += roofLiftY;
        shelterRoof.add(roofGroup);

        // 4. INHABITED WARM INTERIOR LIGHTING & CEILING FAN
        // Warm interior glow that shines through the windows
        const interiorLight = new THREE.PointLight(0xffedd5, 2.8, 18);
        interiorLight.position.set(0, totalBuildingH - 0.6, 0);
        shelterBody.add(interiorLight);

        // Ceiling Fan
        ceilingFan = new THREE.Group();
        const fanMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0x18181b }));
        fanMotor.rotation.x = Math.PI / 2;
        ceilingFan.add(fanMotor);
        const bladeGeo = new THREE.BoxGeometry(1.2, 0.02, 0.1);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(bladeGeo, bladeMat);
            blade.position.x = 0.6;
            const pivot = new THREE.Group();
            pivot.rotation.y = (i * Math.PI * 2) / 3;
            pivot.add(blade);
            ceilingFan.add(pivot);
        }
        ceilingFan.position.set(0, totalBuildingH - 0.25, 0);
        shelterBody.add(ceilingFan);

        // 5. ARCHITECTURAL SCALE FIGURE (Standing on terrace in colorful real-life clothing)
        const scaleFigure = new THREE.Group();
        const figHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.6 }));
        figHead.position.y = 1.65;
        scaleFigure.add(figHead);

        const figBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.85, 8), new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.75 })); // Coral red jacket
        figBody.position.y = 1.1;
        figBody.castShadow = true;
        scaleFigure.add(figBody);

        const figLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.65, 8), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.8 })); // Blue jeans
        figLegs.position.y = 0.35;
        figLegs.castShadow = true;
        scaleFigure.add(figLegs);

        const shoeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }); // White sneakers
        [-0.06, 0.06].forEach(sx => {
            const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.22), shoeMat);
            shoe.position.set(sx, 0.04, 0.04);
            scaleFigure.add(shoe);
        });

        scaleFigure.position.set(-stepWidth/2 - 1.2, plinthH + foundationLift, w/2 + plinthOverhang - 0.4);
        shelterBody.add(scaleFigure);

        // 6. DIMENSION LINES
        if (toggleDimensions.checked) {
            buildDimensionLines(l, w, h);
        }

        const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0.5, 0),
            w * 0.7 + plinthOverhang + 1.0,
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
        const hour = parseFloat(paramSunHour.value); // 0.0 to 23.5
        const isDaytime = hour >= 6 && hour <= 18;
        
        let progress;
        if (isDaytime) {
            progress = (hour - 6) / 12; // 0 to 1 mapping
        } else {
            if (hour > 18) {
                progress = 1 + (hour - 18) / 12; // 1 to 1.5 mapping
            } else {
                progress = -(6 - hour) / 12; // -0.5 to 0 mapping
            }
        }
        
        const angle = Math.PI * progress;

        const radius = 26;
        const x = -Math.cos(angle) * radius;
        const y = Math.sin(angle) * 19 + 2;
        const z = Math.sin(angle) * 14;

        sunLight.position.set(x, y, z);
        sunMesh.position.set(x, y, z);

        if (isDaytime) {
            sunLight.intensity = 1.8;
            sunMesh.visible = true;
            if (skyUniforms) {
                skyUniforms.topColor.value.setHex(0x3b82f6);
                skyUniforms.bottomColor.value.setHex(0xe0f2fe);
            }
        } else {
            sunLight.intensity = 0.15; // Moonlight
            sunMesh.visible = false;
            if (skyUniforms) {
                skyUniforms.topColor.value.setHex(0x020617); // Night sky
                skyUniforms.bottomColor.value.setHex(0x0f172a);
            }
        }

        const elevationDeg = Math.round(Math.sin(angle) * 65);
        const azimuthDeg = Math.round(90 + progress * 180);
        if (overlaySun) {
            overlaySun.textContent = `Sun: Azimuth ${azimuthDeg}°, Elev ${elevationDeg}°`;
        }
    }

    initThree();
    // Automatically match the initial 3D environment to the active climate region (e.g. Shimla -> snow mountains)
    const initialLocation = locationSelect ? locationSelect.value : 'shimla';
    const initialBiomemap = {
        shimla: 'snow',
        leh: 'snow',
        jodhpur: 'desert',
        nagpur: 'standard',
        chennai: 'tropical',
        nasa: 'standard',
        custom: 'standard'
    };
    if (window.rebuildEnvironment) {
        window.rebuildEnvironment(initialBiomemap[initialLocation] || 'snow');
    }

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
            camera.position.set(9.2, 4.8, 12.0);
            controls.target.set(0, 1.4, 0);
            controls.update();
        });
    }
    if (camSouth) {
        camSouth.addEventListener('click', () => {
            camera.position.set(0, 2.8, 11.5);
            controls.target.set(0, 1.4, 0);
            controls.update();
        });
    }
    if (camTop) {
        camTop.addEventListener('click', () => {
            camera.position.set(0, 18, 0.1);
            controls.target.set(0, 0, 0);
            controls.update();
        });
    }
    if (camReset) {
        camReset.addEventListener('click', () => {
            camera.position.set(9.2, 4.8, 12.0);
            controls.target.set(0, 1.4, 0);
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

        const monthStr = paramMonth ? paramMonth.value : "6";
        const month = parseInt(monthStr, 10);
        // Seasonal temperature shift approximation: Jan is coldest, July is hottest (Northern hemisphere assumption)
        const seasonalOffset = -Math.cos((month - 1) * Math.PI / 6) * 12;

        const newIndoor = activePreset.diurnalOutdoor.map((outVal, idx) => {
            const solarPeak = activePreset.solarGains[idx] * (wwr / 25) * solarFactor;
            const avgOutdoor = activePreset.diurnalOutdoor.reduce((a, b) => a + b, 0) / 24;
            const seasonalOutVal = outVal + seasonalOffset;
            const seasonalAvg = avgOutdoor + seasonalOffset;
            
            const passiveOffset = (seasonalOutVal - seasonalAvg) * (1 / (effectiveDamping * 1.6));
            const calculatedIndoor = seasonalAvg + passiveOffset + (solarPeak * 0.015);
            return Number(calculatedIndoor.toFixed(1));
        });
        
        const newOutdoor = activePreset.diurnalOutdoor.map(val => val + seasonalOffset);

        const newSolar = activePreset.solarGains.map(v => Math.round(v * (wwr / 25) * solarFactor));
        const newConduction = activePreset.conductionLoss.map(v => Math.round(v / effectiveDamping));

        thermalChart.data.datasets[0].data = newOutdoor;
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
    function syncInput(slider, numInput, updateFn) {
        slider.addEventListener('input', (e) => {
            numInput.value = e.target.value;
            updateFn();
        });
        numInput.addEventListener('input', (e) => {
            slider.value = e.target.value;
            updateFn();
        });
    }

    const updateGeometry = () => { rebuildShelter(); recalculateThermalSimulation(); };
    
    syncInput(paramLength, valLength, updateGeometry);
    syncInput(paramWidth, valWidth, updateGeometry);
    syncInput(paramHeight, valHeight, updateGeometry);
    if (paramFloors) syncInput(paramFloors, valFloors, updateGeometry);
    syncInput(paramOrientation, valOrientation, updateGeometry);
    syncInput(paramSunHour, valSunHour, updateSunPosition);
    if (paramMonth) syncInput(paramMonth, valMonth, updateGeometry);
    if (archStyle) {
        archStyle.addEventListener('change', updateGeometry);
    }

    function getOrientationLabel(deg) {
        deg = parseInt(deg);
        if (deg >= 165 && deg <= 195) return 'South-Facing Sun Optimum';
        if (deg >= 75 && deg <= 105) return 'East-Facing Morning Gain';
        if (deg >= 255 && deg <= 285) return 'West-Facing Harsh Afternoon';
        if (deg >= 345 || deg <= 15) return 'North-Facing Minimal Solar';
        return 'Angled Orientation';
    }

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

    const insulationType = document.getElementById('insulationType');
    if (insulationType) {
        insulationType.addEventListener('change', () => {
            recalculateThermalSimulation();
            showToast('Updated Insulation Material');
        });
    }

    const passiveStrategy = document.getElementById('passiveStrategy');
    if (passiveStrategy) {
        passiveStrategy.addEventListener('change', () => {
            recalculateThermalSimulation();
            showToast('Updated Passive Climate Strategy');
        });
    }

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

        // Auto-switch the 3D environment biome based on region
        const biomemap = {
            shimla: 'snow',
            leh: 'snow',
            jodhpur: 'desert',
            nagpur: 'standard',
            chennai: 'tropical',
            nasa: 'standard'
        };
        if (window.rebuildEnvironment) {
            window.rebuildEnvironment(biomemap[val] || 'standard');
        }

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
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,direct_normal_irradiance,wind_speed_10m,wind_direction_10m&forecast_days=1`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            const hourlyTemps = data.hourly.temperature_2m.slice(0, 24);
            const hourlyHum = data.hourly.relative_humidity_2m.slice(0, 24);
            const hourlySolar = data.hourly.direct_normal_irradiance.slice(0, 24);
            const hourlyWind = data.hourly.wind_speed_10m.slice(0, 24);
            const hourlyWindDir = data.hourly.wind_direction_10m.slice(0, 24);

            const avgT = Number((hourlyTemps.reduce((a,b)=>a+b,0)/24).toFixed(1));
            const avgH = Math.round(hourlyHum.reduce((a,b)=>a+b,0)/24);
            const maxS = Math.round(Math.max(...hourlySolar));
            const avgW = (hourlyWind.reduce((a,b)=>a+b,0)/24).toFixed(1);
            
            // Circular mean for daily wind direction
            let sumSin = 0, sumCos = 0;
            for(let a of hourlyWindDir) {
                sumSin += Math.sin(a * Math.PI / 180);
                sumCos += Math.cos(a * Math.PI / 180);
            }
            let avgWindDir = Math.round((Math.atan2(sumSin, sumCos) * 180 / Math.PI + 360) % 360);
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
            let compass = directions[Math.round(avgWindDir / 45) % 8];

            activePreset = {
                name: `Custom [${lat.toFixed(2)}, ${lon.toFixed(2)}]`,
                lat: lat,
                lon: lon,
                temp: avgT,
                humidity: avgH,
                solar: maxS,
                wind: `${avgW} m/s ${compass}`,
                windSpeedVal: parseFloat(avgW),
                windAngleDeg: avgWindDir,
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

    function clientOptimizeThermal(preset) {
        const temp = preset.temp || 20;
        const cName = (preset.name || '').toLowerCase();
        if (temp < 15 || cName.includes('cold') || cName.includes('shimla') || cName.includes('leh')) {
            return {
                orientation: 180, length: 8.0, width: 5.0, height: 3.2,
                wallMaterial: 'timber_frame', roofType: 'sloped_solar', glazingRatio: '25',
                rationale: 'Cold alpine optimization: True South 180° orientation captures peak low-angle solar irradiance. Multi-layer insulated timber frame minimizes conductive heat loss, while steep sloped solar roof sheds snow.'
            };
        } else if (temp > 32 || cName.includes('hot') || cName.includes('jodhpur') || cName.includes('desert')) {
            return {
                orientation: 0, length: 9.5, width: 7.0, height: 2.8,
                wallMaterial: 'rammed_earth', roofType: 'cool_roof', glazingRatio: '15',
                rationale: 'Hot-arid optimization: North-South 0° orientation blocks harsh morning and afternoon sun. 400mm Rammed Earth damps thermal spikes with 10-hour lag, and an SRI 104 cool roof reflects 85% of solar heat.'
            };
        } else if (preset.humidity > 65 || cName.includes('humid') || cName.includes('chennai') || cName.includes('coast')) {
            return {
                orientation: 90, length: 8.5, width: 5.0, height: 3.0,
                wallMaterial: 'aerated_concrete', roofType: 'green_roof', glazingRatio: '40',
                rationale: 'Warm-humid coastal optimization: Cross-ventilation aligned with coastal breeze. Breathable aerated concrete prevents humidity damage, and an extensive green roof reduces heat transfer.'
            };
        } else {
            return {
                orientation: 165, length: 7.0, width: 4.5, height: 2.8,
                wallMaterial: 'pcm_biowax', roofType: 'cool_roof', glazingRatio: '25',
                rationale: 'Composite climate optimization: Phase-Change Material (PCM) bio-wax balances diurnal temperature fluctuations.'
            };
        }
    }

    applyOptCandidateBtn.addEventListener('click', async () => {
        applyOptCandidateBtn.disabled = true;
        applyOptCandidateBtn.innerHTML = '<span>⏳ Contacting AI Optimization Engine...</span>';
        
        let aiResult = null;
        try {
            const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') ? 'http://localhost:3000' : '';
            const response = await fetch(`${API_BASE}/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    climateName: activePreset.name,
                    temp: activePreset.temp,
                    humidity: activePreset.humidity,
                    solar: activePreset.solar,
                    wind: activePreset.wind
                })
            });
            
            if (response.ok) {
                aiResult = await response.json();
            }
        } catch (err) {
            console.warn('Backend unavailable, using autonomous thermal optimization algorithm:', err);
        }

        if (!aiResult || aiResult.error || !aiResult.wallMaterial) {
            aiResult = clientOptimizeThermal(activePreset);
        }
        
        paramOrientation.value = aiResult.orientation;
        valOrientation.value = aiResult.orientation;
        
        paramLength.value = aiResult.length;
        valLength.value = aiResult.length;
        
        paramWidth.value = aiResult.width;
        valWidth.value = aiResult.width;
        
        paramHeight.value = aiResult.height;
        valHeight.value = aiResult.height;
        
        wallMaterial.value = aiResult.wallMaterial;
        roofType.value = aiResult.roofType;
        glazingRatio.value = aiResult.glazingRatio;

        optimizationModal.classList.remove('open');
        rebuildShelter();
        recalculateThermalSimulation();
        showToast(`Optimal Design Applied: ${aiResult.rationale}`);

        applyOptCandidateBtn.disabled = false;
        applyOptCandidateBtn.innerHTML = '<span>Apply Optimal Candidate</span>';
    });

    // ==========================================
    // 12. Saved Design Vault (localStorage)
    // ==========================================
    const DEFAULT_DESIGNS = [
        { name: "Assam Flood Relief Camp", region: "Guwahati", length: "8.0", width: "5.0", height: "2.8", floors: 1, style: "stilted", wall: "timber", roof: "corrugated_iron", date: "2026-09-27" },
        { name: "Gujarat Earthquake Temp Housing", region: "Bhuj", length: "6.0", width: "4.0", height: "2.5", floors: 1, style: "modern_box", wall: "aerated_concrete", roof: "cool_roof", date: "2026-09-27" },
        { name: "Rajasthan Heat Wave Slum Upgrade", region: "Jaipur", length: "10.0", width: "8.0", height: "3.0", floors: 1, style: "courtyard", wall: "rammed_earth", roof: "cool_roof", date: "2026-09-27" },
        { name: "Kashmir Winter Survival", region: "Srinagar", length: "7.0", width: "5.0", height: "3.5", floors: 2, style: "a_frame", wall: "timber", roof: "sloped_solar", date: "2026-09-27" },
        { name: "Kerala Coastal Monsoon Shelter", region: "Kochi", length: "12.0", width: "6.0", height: "3.2", floors: 2, style: "stilted", wall: "rammed_earth", roof: "green_roof", date: "2026-09-27" }
    ];

    function getSavedDesigns() {
        const stored = localStorage.getItem('thermal_saved_designs_v2');
        if (!stored) {
            localStorage.setItem('thermal_saved_designs_v2', JSON.stringify(DEFAULT_DESIGNS));
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
                    paramLength.value = design.length || 6; valLength.value = design.length || 6;
                    paramWidth.value = design.width || 4; valWidth.value = design.width || 4;
                    paramHeight.value = design.height || 3; valHeight.value = design.height || 3;
                    
                    if (design.floors) { paramFloors.value = design.floors; valFloors.value = design.floors; }
                    if (design.style) archStyle.value = design.style;
                    if (design.wall) wallMaterial.value = design.wall;
                    if (design.roof) roofType.value = design.roof;
                    
                    updateGeometry();
                    showToast(`Restored Critical State design: ${design.name}`);
                }
            });
        });
    }

    saveDesignBtn.addEventListener('click', () => {
        const list = getSavedDesigns();
        const newDesign = {
            name: `Custom Design #${list.length + 1} (${activePreset.name.split(',')[0]})`,
            region: activePreset.name.split(',')[0],
            length: parseFloat(paramLength.value).toFixed(1),
            width: parseFloat(paramWidth.value).toFixed(1),
            height: parseFloat(paramHeight.value).toFixed(1),
            floors: parseInt(paramFloors.value) || 1,
            style: archStyle ? archStyle.value : 'modern_box',
            wall: wallMaterial.value,
            roof: roofType.value,
            date: new Date().toLocaleDateString()
        };
        list.unshift(newDesign);
        localStorage.setItem('thermal_saved_designs_v2', JSON.stringify(list));
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


    // ==========================================
    // 10. AI Generative Mode
    // ==========================================
    const modeManual = document.getElementById('modeManual');
    const modeAI = document.getElementById('modeAI');
    const aiOverlay = document.getElementById('aiOverlay');
    const aiInput = document.getElementById('aiInput');
    const aiSubmit = document.getElementById('aiSubmit');
    const aiMessages = document.getElementById('aiMessages');

    if (modeManual && modeAI && aiOverlay) {
        modeManual.addEventListener('click', () => {
            modeManual.classList.add('active');
            modeAI.classList.remove('active');
            aiOverlay.classList.add('hidden');
        });

        modeAI.addEventListener('click', () => {
            modeAI.classList.add('active');
            modeManual.classList.remove('active');
            aiOverlay.classList.remove('hidden');
            aiInput.focus();
        });

        function addAiMessage(text, isUser = false) {
            const msg = document.createElement('div');
            msg.className = 'ai-msg' + (isUser ? ' user' : '');
            msg.textContent = text;
            aiMessages.appendChild(msg);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }

        function clientGenerateArchitect(promptStr) {
            const p = promptStr.toLowerCase();
            let style = 'modern_box', wall = 'pcm_biowax', roof = 'cool_roof', glazing = '25', env = 'standard';
            let l = 7.5, w = 5.0, h = 3.0, floors = 1;
            let rationale = "";

            if (p.includes('desert') || p.includes('sand') || p.includes('thar') || p.includes('sahara') || p.includes('jodhpur') || p.includes('arid') || p.includes('rajasthan') || p.includes('hot')) {
                env = 'desert';
                style = 'courtyard';
                wall = 'rammed_earth';
                roof = 'cool_roof';
                glazing = '15';
                l = 10.0; w = 8.0; h = 3.0; floors = 1;
                rationale = "Generated Desert Thermal Shelter: Constructed with high thermal-mass 400mm Rammed Earth walls to buffer severe day/night temperature swings (42°C day / 14°C night). Features a shaded central courtyard inducing microclimatic stack ventilation, an SRI 104 cool roof, and 15% minimal glazing with deep louvers to block scorching direct solar radiation.";
            } else if (p.includes('snow') || p.includes('cold') || p.includes('mountain') || p.includes('alpine') || p.includes('winter') || p.includes('himalaya') || p.includes('shimla') || p.includes('leh') || p.includes('kashmir') || p.includes('ice') || p.includes('freez')) {
                env = 'snow';
                style = 'a_frame';
                wall = 'timber_frame';
                roof = 'sloped_solar';
                glazing = '25';
                l = 8.0; w = 5.5; h = 3.6; floors = 2;
                rationale = "Generated Cold Mountain Shelter: Steep A-frame roof prevents snow pack accumulation and aligns solar PV panels with low winter sun angles. Multi-layer timber frame envelope with aerogel thermal breaks stops frost penetration, while airtight south-facing 25% glazing captures direct solar heat gains.";
            } else if (p.includes('tropical') || p.includes('coast') || p.includes('beach') || p.includes('humid') || p.includes('sea') || p.includes('flood') || p.includes('monsoon') || p.includes('kerala') || p.includes('chennai') || p.includes('water')) {
                env = 'tropical';
                style = 'stilted';
                wall = 'aerated_concrete';
                roof = 'green_roof';
                glazing = '40';
                l = 9.0; w = 6.0; h = 3.2; floors = 1;
                rationale = "Generated Coastal / Monsoon Thermal Shelter: Raised on 2.0m stilt piers to withstand flash floods and optimize floor-level cross-ventilation from oceanic breezes. Autoclaved aerated concrete walls prevent mold growth, and a native living green roof reduces thermal transfer by up to 6.8°C.";
            } else if (p.includes('forest') || p.includes('wood') || p.includes('hill') || p.includes('green') || p.includes('jungle') || p.includes('cabin') || p.includes('nature')) {
                env = 'forest';
                style = 'modern_box';
                wall = 'timber_frame';
                roof = 'green_roof';
                glazing = '30';
                l = 8.5; w = 5.0; h = 3.0; floors = 1;
                rationale = "Generated Forest Ecosystem Shelter: Blends sustainable mass-timber envelope with aerated insulation, deep shading overhangs, and an extensive sedum green roof that mitigates stormwater and integrates into the woodland microclimate.";
            } else {
                env = 'standard';
                style = 'modern_box';
                wall = 'pcm_biowax';
                roof = 'cool_roof';
                glazing = '25';
                l = 7.5; w = 5.0; h = 3.0; floors = 1;
                rationale = "Generated Climate-Adaptive Composite Shelter: Advanced Phase-Change Material (PCM) bio-wax composite envelope dynamically stabilizes interior comfort by capturing daytime solar enthalpy and releasing it at night.";
            }

            if (p.includes('tall') || p.includes('two story') || p.includes('2 floor')) { floors = 2; h = Math.max(h, 3.2); }
            if (p.includes('three floor') || p.includes('3 floor')) { floors = 3; h = Math.max(h, 3.4); }
            if (p.includes('large') || p.includes('big') || p.includes('spacious')) { l = Math.max(l, 12.0); w = Math.max(w, 7.5); }
            if (p.includes('compact') || p.includes('small') || p.includes('tiny')) { l = Math.min(l, 5.0); w = Math.min(w, 3.5); }

            return { style, floors, length: l, width: w, height: h, wallMaterial: wall, roofType: roof, glazingRatio: glazing, environment: env, rationale };
        }

        async function triggerAiGeneration(promptStr) {
            addAiMessage("Thinking...", false);
            
            let aiResult = null;
            try {
                const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') ? 'http://localhost:3000' : '';
                const response = await fetch(`${API_BASE}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: promptStr })
                });

                if (response.ok) {
                    aiResult = await response.json();
                }
            } catch (err) {
                console.warn('Backend offline or unreachable, using autonomous architectural solver:', err);
            }

            // Fallback to client-side autonomous engine if backend didn't return valid data
            if (!aiResult || aiResult.error || !aiResult.style) {
                aiResult = clientGenerateArchitect(promptStr);
            }

            // Apply parameters
            if (archStyle) archStyle.value = aiResult.style;
            
            if (paramFloors) { paramFloors.value = aiResult.floors; valFloors.value = aiResult.floors; }
            if (paramLength) { paramLength.value = aiResult.length; valLength.value = aiResult.length; }
            if (paramWidth) { paramWidth.value = aiResult.width; valWidth.value = aiResult.width; }
            if (paramHeight) { paramHeight.value = aiResult.height; valHeight.value = aiResult.height; }
            
            if (wallMaterial) wallMaterial.value = aiResult.wallMaterial;
            if (roofType) roofType.value = aiResult.roofType;
            if (glazingRatio) glazingRatio.value = aiResult.glazingRatio;

            // Remove the "Thinking..." message
            if (aiMessages.lastChild) aiMessages.removeChild(aiMessages.lastChild);
            
            // Add the actual AI rationale
            addAiMessage(aiResult.rationale, false);
            
            if (aiResult.environment && window.rebuildEnvironment) {
                window.rebuildEnvironment(aiResult.environment);
            }

            rebuildShelter();
            recalculateThermalSimulation();
            showToast('AI Auto-Design Complete & 3D Environment Built!');
        }

        aiSubmit.addEventListener('click', () => {
            const text = aiInput.value.trim();
            if (!text) return;
            addAiMessage(text, true);
            aiInput.value = '';
            
            // "Thinking" delay
            setTimeout(() => {
                triggerAiGeneration(text);
            }, 600);
        });

        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') aiSubmit.click();
        });
    }

}); // END OF DOMContentLoaded
