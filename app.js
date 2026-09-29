/**
 * A.E.G.I.S. SYSTEM INTERFACE ENGINE
 * Handles: Hexagonal drifting background, 3D wireframe core rendering, SPA transitions, live metrics, clocks.
 */

let testInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initSPARouting();
  initSkillsGrid();
  initResearchModule();
  initProjectLightbox();
  initHomeTerminal();
  initContactValidationModule();
  initWordLimitCounters();
  initEngineeringCanvas();
});

function handleTabSwitch(tabId) {
    if (tabId === 'research') {
        const cards = document.querySelectorAll(".log-card");
        cards.forEach(card => {
            card.style.display = "flex";
        });
    }
}

/**
 * 1. SPA Navigation & Section Crossfade
 * Smooth native scrolling keeping layout responsive and instantaneous
 */
window.scrollToSection = function(sectionId) {
  if (sectionId === 'projects') sectionId = 'proj-01';
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      history.pushState(null, null, `#${sectionId}`);
    } catch (e) {}
  }
};

function initSPARouting() {
  const routerElements = document.querySelectorAll('.nav-link, .nav-link-logo, .circular-link-btn');

  routerElements.forEach(element => {
    element.addEventListener('click', (e) => {
      if (element.hasAttribute('download')) return;
      
      e.preventDefault();
      
      let targetSectionId = element.getAttribute('data-section');
      if (targetSectionId === 'projects') {
        targetSectionId = 'proj-01';
      }
      
      window.scrollToSection(targetSectionId);
    });
  });

  // IntersectionObserver for dynamic active navbar and side-nav updating on scroll
  const sections = document.querySelectorAll('.cinematic-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const sideNavItems = document.querySelectorAll('.side-nav-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let sectionId = entry.target.getAttribute('id');
        let category = entry.target.getAttribute('data-section') || sectionId;
        if (sectionId.startsWith('proj-')) category = 'projects';

        // Update top navbar
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === category) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update SpaceX-style side dot nav
        sideNavItems.forEach(item => {
          if (item.getAttribute('data-target') === sectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.25
  });

  sections.forEach(section => observer.observe(section));

  const currentHash = window.location.hash.substring(1);
  if (currentHash) {
    setTimeout(() => {
      window.scrollToSection(currentHash);
    }, 50);
  }
}

/**
 * 2. Zero-Overhead Static Engineering CAD Blueprint Grid
 * Renders once on load and resize (0% CPU/GPU usage during scroll).
 */
function initEngineeringCanvas() {
  const canvas = document.getElementById('engineering-canvas') || document.getElementById('hex-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const gridSize = 60;

  function drawStaticGrid() {
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    // 1. Crisp White Base
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Precision CAD Grid Lines
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.035)';
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 3. Precision Engineering Crosshair Intersections (+)
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.22)';
    ctx.beginPath();
    const crossSize = 3;
    for (let x = gridSize; x < width; x += gridSize * 2) {
      for (let y = gridSize; y < height; y += gridSize * 2) {
        ctx.moveTo(x - crossSize, y);
        ctx.lineTo(x + crossSize, y);
        ctx.moveTo(x, y - crossSize);
        ctx.lineTo(x, y + crossSize);
      }
    }
    ctx.stroke();
  }

  drawStaticGrid();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawStaticGrid, 150);
  }, { passive: true });
}



/**
 * 4. Technical Readout & Interactive Pulsing Calibration
 * Updates live system temperatures and core calibrations
 */
function initMetricsFluctuation() {
  const jarvisCore = document.getElementById('jarvis-trigger');

  // Calibration triggering event on J.A.R.V.I.S. Core click
  if (jarvisCore) {
    jarvisCore.addEventListener('click', () => {
      if (jarvisCore.classList.contains('calibrating')) return;

      jarvisCore.classList.add('calibrating');

      // Highly reactive 2.5-second neural recalibration sequence
      setTimeout(() => {
        jarvisCore.classList.remove('calibrating');
      }, 2500);
    });
  }
}

/**
 * 5. System Clock Loop
 * Continuously pushes exact real-time IST strings into the header clock
 */
function initSystemClock() {
  const timeEl = document.getElementById('system-time');
  if (!timeEl) return;

  function setTime() {
    const d = new Date();
    
    // Convert current time to India Standard Time (IST) in 24h format
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    const istString = d.toLocaleTimeString('en-US', options);
    timeEl.textContent = `${istString} IST`;
  }

  setTime();
  setInterval(setTime, 1000);
}

/**
 * 6. Tactical Page Interactions (Bento Terminals & Contact Uplinks)
 */
function initTacticalFeatures() {
  // Bento box terminal triggers
  const bentoBoxes = document.querySelectorAll('.bento-box');
  bentoBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      // If close button was clicked, don't open
      if (e.target.classList.contains('term-close')) {
        return;
      }
      
      // Close all other terminals first for clean interface
      bentoBoxes.forEach(b => {
        if (b !== box) b.classList.remove('terminal-open');
      });
      
      box.classList.add('terminal-open');
    });

    const closeBtn = box.querySelector('.term-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering parent bento-box click
        box.classList.remove('terminal-open');
      });
    }
  });

  // Contact form submission simulator and validation
  const contactForm = document.getElementById('uplink-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.uplink-btn');
    const inputs = contactForm.querySelectorAll('.input-field');

    // Dynamic clear mechanics: clear error instantly when user types
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl && errorEl.classList.contains('show')) {
          errorEl.classList.remove('show');
          errorEl.textContent = '';
        }
      });
    });
    
    // Add custom validation and submission handling
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let hasError = false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      inputs.forEach(input => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (input.value.trim() === '') {
          hasError = true;
          if (errorEl) {
            errorEl.textContent = '* This field is required';
            errorEl.classList.add('show');
          }
          
          // Terminal shake micro-interaction
          input.classList.add('shake-input');
          setTimeout(() => {
            input.classList.remove('shake-input');
          }, 200);
        } else if (input.type === 'email' && !emailRegex.test(input.value.trim())) {
          hasError = true;
          if (errorEl) {
            errorEl.textContent = '* Enter a valid email address';
            errorEl.classList.add('show');
          }
          
          // Terminal shake micro-interaction
          input.classList.add('shake-input');
          setTimeout(() => {
            input.classList.remove('shake-input');
          }, 200);
        } else {
          // Already filled and valid, make sure error is hidden
          if (errorEl) {
            errorEl.classList.remove('show');
            errorEl.textContent = '';
          }
        }
      });

      if (hasError) {
        if (submitBtn) {
          // Flash the button text to warning
          const originalBtnText = submitBtn.textContent;
          submitBtn.textContent = 'ERROR: INVALID FORM DATA';
          submitBtn.style.color = 'var(--color-accent-crimson)';
          setTimeout(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.style.color = '';
          }, 2000);
        }
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'TRANSMITTING...';
      submitBtn.disabled = true;
      submitBtn.style.color = 'var(--color-accent-crimson)';

      // Construct mailto link and trigger redirection
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('msg-purpose').value.trim();
      const message = document.getElementById('trans-body').value.trim();
      
      // Save submission data locally in localStorage (as backup/fallback database)
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newContact = { timestamp, name, email, subject, message };
      try {
        const contactsList = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
        contactsList.push(newContact);
        localStorage.setItem('portfolio_contacts', JSON.stringify(contactsList));
      } catch (err) {
        console.error('Error saving contact to localStorage:', err);
      }

      // Transmission request to system-level server (appends to contacts.csv)
      fetch('http://localhost:8000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      }).catch(err => {
        console.warn('Local HTTP server is not running or unreachable. Submission saved locally.', err);
      });
      
      const mailtoUrl = `mailto:harshalgadekar72@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;

      setTimeout(() => {
        submitBtn.textContent = 'SUCCESSFUL';
        submitBtn.style.color = '#10B981'; // Cybernetic green
        
        // Open native email client pre-filled
        window.location.href = mailtoUrl;

        // Clear form values
        contactForm.reset();
        
        // Clear validation classes
        inputs.forEach(input => {
          input.classList.remove('field-success', 'field-fault');
        });
        
        // Reset dynamic word count label as well
        const transCounter = document.getElementById('trans-body-counter');
        if (transCounter) {
          transCounter.textContent = '[ WORDS: 00 / 100 ]';
        }

        // Reset error text
        const errors = contactForm.querySelectorAll('.error-msg, .validation-message');
        errors.forEach(err => {
          err.classList.remove('show');
          err.textContent = '';
        });
      }, 1500);

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.color = '';
      }, 4000);
    });
  }

  // Email copy-to-clipboard backup
  const emailLink = document.getElementById('contact-email-link');
  const copiedNotification = document.getElementById('copied-notification');
  if (emailLink) {
    emailLink.addEventListener('click', () => {
      navigator.clipboard.writeText('harshalgadekar72@gmail.com')
        .then(() => {
          // Trigger minimal HUD notification
          if (copiedNotification) {
            copiedNotification.classList.add('show');
            setTimeout(() => {
              copiedNotification.classList.remove('show');
            }, 2000);
          }

          // Also keep in-bracket email label swap feedback
          const textSpan = emailLink.querySelector('.contact-link-text');
          if (textSpan) {
            const originalText = textSpan.textContent;
            textSpan.textContent = 'COPIED!';
            setTimeout(() => {
              textSpan.textContent = originalText;
            }, 1500);
          }
        })
        .catch(err => {
          console.error('Failed to copy email to clipboard:', err);
        });
    });
  }
}

/**
 * Utility to download contact submissions as a CSV (Excel-compatible) file
 */
function downloadContactsCSV() {
  const contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
  if (contacts.length === 0) {
    return false;
  }
  
  // RFC 4180 compliant CSV cell formatting
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    let str = val.toString();
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const headers = ['Timestamp', 'Name', 'Email', 'Subject', 'Message'];
  const rows = [headers.join(',')];

  contacts.forEach(c => {
    const row = [
      escapeCSV(c.timestamp),
      escapeCSV(c.name),
      escapeCSV(c.email),
      escapeCSV(c.subject),
      escapeCSV(c.message)
    ];
    rows.push(row.join(','));
  });

  const csvContent = rows.join('\r\n');
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "contacts.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

/**
 * 7. Strict Word Count Limit Enforcer for Input Boxes
 */
function initWordLimitCounters() {
  enforceWordLimit('sender-name', 10);
  enforceWordLimit('sender-email', 5);
  enforceWordLimit('msg-purpose', 20);
  enforceWordLimit('trans-body', 100);
}

function enforceWordLimit(elementId, limit) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  const updateCounter = () => {
    const counterEl = document.getElementById(`${elementId}-counter`);
    if (counterEl) {
      const value = el.value.trim();
      const words = value === '' ? [] : value.split(/\s+/);
      const count = words.length;
      counterEl.textContent = `[ WORDS: ${String(count).padStart(2, '0')} / ${limit} ]`;
    }
  };

  el.addEventListener('input', () => {
    const value = el.value;
    const segments = value.split(/(\s+)/);
    let wordCount = 0;
    let truncatedValue = '';
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.trim() !== '') {
        wordCount++;
      }
      if (wordCount > limit) {
        break;
      }
      truncatedValue += segment;
    }
    
    if (el.value !== truncatedValue) {
      el.value = truncatedValue;
    }
    updateCounter();
  });

  // Initial update
  updateCounter();
}

// Telemetry Stream Map For Low-Latency Event Pulls
const telemetryDatabase = {
    "01": "LATENCY: 42ms // PERCEPTION_PIPELINE: ASYNC_MULTIPROCESSING // FRAME_RATE: 30FPS // TOOLKIT: MEDIAPIPE_ROS2",
    "02": "CONTROL_TIER: SIEMENS_S7-1200_PLC // COUPLING: PC817_OPTOCUPLERS // LOGIC_MATRIX: DETERMINISTIC_BOOLEAN",
    "03": "GRAIN_GEOMETRY: STAR_CONFIG // MOTOR_CLASS: I_CLASS // ANALYSIS: NUMERICAL_INTERNAL_BALLISTICS_STRESS",
    "04": "DRIVE_CONFIGURATION: 4WD_CHASSIS // PERCEPTION_NODE: MACHINE_VISION // SYSTEM: AUTONOMOUS_PATH_PLANNING",
    "05": "PLATFORM: HEAVY_DUTY_QUADCOPTER // MOTORS: BRUSHLESS_DIRECT_DRIVE // STRUCT: FINITE_ELEMENT_ANALYSIS",
    "T01": "CHAMBER_PRESSURE: 4.2 MPa // EXPANSION_VELOCITY: SUPERSONIC // REGRESSION_VARIANCE: <3.0%",
    "T02": "INTRINSIC_MATRIX: DEPLOYED // FACE_LANDMARKS: 468_POINTS // DECISION_LATENCY: -40.5%",
    "T03": "OPTOCOUPLER_CTR: OPTIMAL // SCAN_CYCLE: 2ms // EMI_FILTER_CUTOFF: TUNED_OK",
    "T04": "PID_FREQUENCY: 50Hz // SKID_STEER_KINEMATICS: ACTIVE // EDGE_TRACK_PRECISION: 94.5%",
    "R01": "VECTOR: PROPULSION // TARGET: PRARAMBH_1 // BOUNDARY: VALIDATED // STATUS: INTEGRITY_LOCKED",
    "R02": "VECTOR: COGNITIVE_HMI // TARGET: XAI_COBOT_HMI // FATIGUE_REDUCTION: ACTIVE // INF_LATENCY: OPTIMIZED",
    "R03": "VECTOR: NAVIGATION_LOOP // TARGET: 4WD_AUTONOMOUS_CHASSIS // DETERMINISM: VERIFIED // PID: 50Hz"
};

const abstractDatabase = {
    log01: `<div class="structured-modal-content">
    <div class="modal-info-title">Design, Simulation, and Empirical Validation of the Prarambh 1 Solid Rocket Motor</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION &amp; ZENODO / RESEARCHGATE ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOCUMENT ID:</strong> TDRSR-PROP-TR-2026-001<br>
            <strong>DOI:</strong> <a href="https://doi.org/10.5281/zenodo.21173319" target="_blank" style="color: var(--color-accent-crimson); text-decoration: underline;">10.5281/zenodo.21173319</a><br>
            <strong>REPOSITORY STATUS:</strong> Published on Zenodo &amp; ResearchGate // Open Access Aerospace Propulsion Technical Report<br>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 10px;">
                <a href="https://zenodo.org/records/21173319" target="_blank" class="zenodo-link-btn font-mono" style="display: inline-flex;">[ OPEN FULL ZENODO REPORT &amp; PDF ↗ ]</a>
                <button class="bibtex-btn font-mono" onclick="copyBibTeXCitation('10.5281/zenodo.21173319', 'Design, Simulation, and Empirical Validation of the Prarambh 1 Solid Rocket Motor')">[ COPY BIBTEX CITATION 📋 ]</button>
            </div>
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            Solid rocket propulsion systems require rigorous coupling of propellant thermochemistry, internal ballistics digital twins, and structural containment verification to achieve predictable flight performance. This technical report (Document ID: TDRSR-PROP-TR-2026-001) details the complete engineering lifecycle—from analytical design and numerical simulation to static test stand empirical validation—of the <strong>Prarambh 1</strong> solid rocket motor. The propulsion unit utilizes a Potassium Nitrate–Sorbitol (KNSB) propellant grain engineered to maintain stable chamber pressure and prevent structural casing over-pressurization.
        </div>
        <div class="modal-info-text">
            To capture high-resolution burn dynamics during live hot-fire testing, a bespoke <strong>80 Hz mechatronic Data Acquisition (DAQ) system</strong> was architected and calibrated for real-time thrust-time profiling. Static test stand empirical validation confirmed a total impulse of <strong>206.8 N·s</strong>, closely tracking the numerical internal ballistics digital twin predictions while verifying the structural factor of safety of the motor casing and nozzle assembly under peak thermal and mechanical loads.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Prarambh 1, Solid Rocket Motor, KNSB Propellant Thermochemistry, Internal Ballistics Digital Twin, 80 Hz Mechatronic DAQ, Static Test Stand Validation, 206.8 N·s Total Impulse, ANSYS Structural FEA
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Sutton, G. P., and Biblarz, O. "Rocket Propulsion Elements," 9th Edition, Wiley, 2016.</li>
            <li>NASA SP-8073. "Solid Rocket Motor Metal Cases," NASA Space Vehicle Design Criteria, 1970.</li>
            <li>Boyer, E., et al. "Characterization and Static Testing of Potassium Nitrate-Sugar Solid Propellants," <em>Journal of Propulsion and Power</em>, Vol. 37, No. 2, pp. 245-256, 2021.</li>
        </ul>
    </div>
</div>`,

    log02: `<div class="structured-modal-content">
    <div class="modal-info-title">Development of a Scalable Hybrid Sorting System: A Deterministic Mechatronic Architecture for High-Fidelity Material Recovery</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION &amp; ZENODO / RESEARCHGATE ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOI:</strong> <a href="https://doi.org/10.5281/zenodo.21740853" target="_blank" style="color: var(--color-accent-crimson); text-decoration: underline;">10.5281/zenodo.21740853</a><br>
            <strong>REPOSITORY STATUS:</strong> Published on Zenodo &amp; ResearchGate // Open Access Industrial Mechatronics Technical Report<br>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 10px;">
                <a href="https://zenodo.org/records/21740853" target="_blank" class="zenodo-link-btn font-mono" style="display: inline-flex;">[ OPEN FULL ZENODO REPORT &amp; PDF ↗ ]</a>
                <button class="bibtex-btn font-mono" onclick="copyBibTeXCitation('10.5281/zenodo.21740853', 'Development of a Scalable Hybrid Sorting System: A Deterministic Mechatronic Architecture for High-Fidelity Material Recovery')">[ COPY BIBTEX CITATION 📋 ]</button>
            </div>
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            Decentralized material recovery facilities require deterministic, noise-immune automation architectures capable of high-fidelity sorting without the capital overhead of fragile hyperspectral vision clusters. This report details the engineering and empirical evaluation of a scalable hybrid sorting cell governed by a <strong>Siemens S7-1200 Programmable Logic Controller (PLC)</strong> integrated with a multi-modal sensor array.
        </div>
        <div class="modal-info-text">
            To bridge 5V/3.3V microcontroller edge-sensing tiers with 24V industrial PLC inputs in high-noise plant environments, the system implements bespoke <strong>optocoupled electromagnetic interference (EMI) firewalls</strong> for complete galvanic isolation. The control core executes deterministic <strong>combinational Boolean logic matrices</strong> with sub-millisecond scan-cycle determinism, coordinating high-speed diversion actuators to achieve an empirically verified <strong>90.0% sorting accuracy</strong> across heterogeneous material streams.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Industrial Material Recovery, Siemens S7-1200 PLC, Optocoupled EMI Firewalls, Combinational Boolean Logic Matrices, Deterministic Mechatronics, Sensor Fusion, Galvanic Isolation
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Siemens AG. "S7-1200 Programmable Controller System Manual," A5E02486680-AH, 2022.</li>
            <li>Bolton, W. "Mechatronics: Electronic Control Systems in Mechanical and Electrical Engineering," 7th Edition, Pearson, 2018.</li>
            <li>Gundupalli, S. P., et al. "A review on automatic waste sorting technologies," <em>Waste Management</em>, Vol. 60, pp. 33-44, 2017.</li>
        </ul>
    </div>
</div>`,

    log03: `<div class="structured-modal-content">
    <div class="modal-info-title">Design, Integration, and Performance Evaluation of a Vision-Guided Line Follower Robot</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION &amp; ZENODO / RESEARCHGATE ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOCUMENT ID:</strong> MVS-REPORT-003<br>
            <strong>DOI:</strong> <a href="https://doi.org/10.5281/zenodo.21904756" target="_blank" style="color: var(--color-accent-crimson); text-decoration: underline;">10.5281/zenodo.21904756</a><br>
            <strong>REPOSITORY STATUS:</strong> Published on Zenodo &amp; ResearchGate // Open Access Machine Vision &amp; Mobile Robotics Report<br>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 10px;">
                <a href="https://zenodo.org/records/21904756" target="_blank" class="zenodo-link-btn font-mono" style="display: inline-flex;">[ OPEN FULL ZENODO REPORT &amp; PDF ↗ ]</a>
                <button class="bibtex-btn font-mono" onclick="copyBibTeXCitation('10.5281/zenodo.21904756', 'Design, Integration, and Performance Evaluation of a Vision-Guided Line Follower Robot')">[ COPY BIBTEX CITATION 📋 ]</button>
            </div>
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            Traditional infrared (IR) reflectance sensor arrays suffer from severe spatial quantization, zero look-ahead horizon, and high sensitivity to ambient illumination shifts during high-curvature trajectory tracking. This technical report presents the design, hardware-software integration, and closed-loop performance evaluation of a <strong>Vision-Guided Line Follower Robot</strong> built around an <strong>ESP32</strong> wireless edge node and an <strong>OpenCV</strong> visual perception pipeline.
        </div>
        <div class="modal-info-text">
            The perception engine transforms raw RGB camera frames via <strong>HSV color-space conversion</strong> and morphological filtering to isolate path geometry under variable lighting. By computing <strong>dynamic look-ahead vector mapping</strong> and centroid heading errors ahead of the chassis center of mass, the controller modulates differential PWM duty cycles across an <strong>L298N dual H-bridge motor driver</strong>, anticipating sharp curvature transitions and eliminating the oscillatory hunting behavior typical of discrete IR arrays.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Vision-Guided Navigation, ESP32, OpenCV, HSV Color-Space Conversion, Dynamic Look-Ahead Vector Mapping, L298N Motor Driver Kinematics, Autonomous Mobile Robotics
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Corke, P. "Robotics, Vision and Control: Fundamental Algorithms in MATLAB," 3rd Edition, Springer, 2023.</li>
            <li>Siegwart, R., Nourbakhsh, I. R., and Scaramuzza, D. "Introduction to Autonomous Mobile Robots," 2nd Edition, MIT Press, 2011.</li>
        </ul>
    </div>
</div>`,

    log04: `<div class="structured-modal-content">
    <div class="modal-info-title">AI-Powered Patient Registration and Triage Kiosk for Low-Resource Healthcare</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION &amp; ZENODO / RESEARCHGATE ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOMAIN:</strong> Healthcare Cyber-Physical Systems &amp; Edge-AI Biomedical Triage<br>
            <strong>REPOSITORY STATUS:</strong> Published on Zenodo &amp; ResearchGate // Open Access Technical Report<br>
            <strong>RELATED IP FILING:</strong> Design Patent Application No. 507688-001 (IP India)
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            Primary healthcare centers in rural and low-resource regions face severe clinical bottlenecks during patient intake and emergency acuity stratification due to staff shortages and intermittent internet connectivity. This technical report documents a decentralized <strong>5-tier edge-AI patient registration and clinical triage architecture</strong> integrated into an ergonomic, self-service diagnostic kiosk.
        </div>
        <div class="modal-info-text">
            The cyber-physical platform combines <strong>localized multilingual voice parsing</strong> for zero-literacy symptom intake with a synchronized <strong>non-contact and multi-parameter biomedical sensor array</strong> measuring core body temperature (<em>T</em><sub>body</sub>), photoplethysmography (PPG heart rate and SpO<sub>2</sub>), and non-invasive blood pressure (NIBP). Engineered for <strong>deterministic offline execution during network blackouts</strong>, the edge inference engine stratifies patients across a 5-level clinical acuity scale locally, storing encrypted electronic health records for asynchronous synchronization once connectivity is restored.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Healthcare Cyber-Physical Systems, 5-Tier Edge-AI Triage, Localized Voice Parsing, Biomedical Sensor Array, Photoplethysmography (PPG), Non-Invasive Blood Pressure (NIBP), Deterministic Offline Execution
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>World Health Organization (WHO). "Emergency Triage Assessment and Treatment (ETAT) Guidelines," WHO Press.</li>
            <li>Kopetz, H. "Real-Time Systems: Design Principles for Distributed Embedded Applications," 2nd Edition, Springer, 2011.</li>
        </ul>
    </div>
</div>`,

    log05: `<div class="structured-modal-content">
    <div class="modal-info-title">Design, Kinematic Modeling, and Feasibility Evaluation of an Autonomous Modular Seedling Planting Robot for High-Value Agriculture (AgroBot)</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION &amp; ZENODO / RESEARCHGATE ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>PROGRAM AFFILIATION:</strong> Developed under Purdue University EPICS (Engineering Projects in Community Service) Mentorship<br>
            <strong>REPOSITORY STATUS:</strong> Published on Zenodo &amp; ResearchGate // Open Access Agricultural Robotics Technical Report<br>
            <strong>RELATED IP FILING:</strong> Design Patent Application No. 517599-001 (IP India)
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            Precision seedling transplantation in high-value horticulture demands repeatable spatial placement and gentle root-plug handling over deformable, high-slip agricultural soils. Developed under <strong>Purdue University EPICS mentorship</strong>, this technical report presents the mechanical design, kinematic modeling, and feasibility evaluation of <strong>AgroBot</strong>—an autonomous modular seedling planting robot.
        </div>
        <div class="modal-info-text">
            The study formulates <strong>differential drive terramechanics</strong> to account for wheel sinkage and longitudinal slip on unprepared soil beds, coupled with an <strong>Error-State Extended Kalman Filter (Error-State EKF)</strong> fusing wheel odometry and inertial telemetry for drift-corrected row localization. To prevent stem shear and root trauma during continuous motion, the planting payload features a <strong>synchronized zero-relative-velocity vertical dibbler linkage</strong> that matches horizontal ground speed at the instant of soil penetration and seedling release.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Agricultural Field Robotics, AgroBot, Purdue EPICS, Differential Drive Terramechanics, Error-State EKF Localization, Zero-Relative-Velocity Vertical Dibbler Linkage, Precision Agriculture
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Bekker, M. G. "Introduction to Terrain-Vehicle Systems," University of Michigan Press, 1969.</li>
            <li>Sola, J. "Quaternion kinematics for the error-state Kalman filter," <em>arXiv preprint arXiv:1711.02508</em>, 2017.</li>
            <li>Bechar, A., and Vigneault, C. "Agricultural robots for field operations: Concepts and components," <em>Biosystems Engineering</em>, Vol. 149, pp. 94-111, 2016.</li>
        </ul>
    </div>
</div>`,

    log06: `<div class="structured-modal-content">
    <div class="modal-info-title">Optical Illumination Adaptation and Real-Time Kinetic Orientation in Industrial Robotic Sorting: A Systematic Review and Algorithmic Taxonomy</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION &amp; ZENODO / RESEARCHGATE ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOCUMENT TYPE:</strong> Systematic Review &amp; Algorithmic Taxonomy<br>
            <strong>REPOSITORY STATUS:</strong> Published on Zenodo &amp; ResearchGate // Open Access Computer Vision &amp; Industrial Robotics Review
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            High-speed pick-and-place robotic sorting lines operating on specular, metallic, and translucent workpieces frequently suffer from perception dropouts caused by ambient illumination shifts and surface glare, alongside grasp failures arising from latency between pose estimation and moving-conveyor interception. This systematic review synthesizes and benchmarks modern optical adaptation and real-time kinetic orientation pipelines across industrial robotic sorting architectures.
        </div>
        <div class="modal-info-text">
            The taxonomy rigorously evaluates optical hardware and photometric normalization strategies—specifically benchmarking <strong>cross-polarization glare suppression</strong> against active structured-light domes—followed by low-latency geometric pose extraction via <strong>Principal Component Analysis (PCA) eigenvector orientation estimation</strong>. Finally, the review analyzes deterministic industrial communication bridges, establishing design guidelines for <strong>OPC UA and ROS 2 middleware interoperability</strong> to synchronize high-frame-rate vision nodes with real-time PLC and 6-DOF manipulator controllers.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Industrial Robotic Sorting, Cross-Polarization Glare Suppression, PCA Eigenvector Orientation Estimation, Optical Illumination Adaptation, OPC UA, ROS 2 Middleware Interoperability, Systematic Review
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Horn, B. K. P. "Robot Vision," MIT Press, 1986.</li>
            <li>Macenski, S., et al. "Robot Operating System 2: Design, architecture, and uses in the wild," <em>Science Robotics</em>, Vol. 7, No. 66, 2022.</li>
            <li>Mahnke, W., Leitner, S. H., and Damm, M. "OPC Unified Architecture," Springer, 2009.</li>
        </ul>
    </div>
</div>`,

    log07: `<div class="structured-modal-content">
    <div class="modal-info-title">Design of Explainable AI Alerts for Cognitive Overload in Cobot Task Handover Panels</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CONFERENCE SUBMISSION METADATA //</div>
        <div class="modal-info-text">
            <strong>CONFERENCE:</strong> International Conference on Research into Design (ICoRD '27)<br>
            <strong>PAPER ID:</strong> 374<br>
            <strong>AUTHORS:</strong> Harshal Gadekar, Prem Choudhari, Jay Gandhi (Rajarshi Shahu College of Engineering, Pune)<br>
            <strong>STATUS:</strong> Submitted / Under Peer Review
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; TECHNICAL ARCHITECTURE //</div>
        <div class="modal-info-text">
            Human-robot collaboration (HRC) in modern industrial assembly lines requires rapid, high-integrity decision-making during physical part handover sequences. However, traditional human-machine interfaces (HMIs) frequently induce acute cognitive overload in human operators by streaming raw, uninterpreted sensor logs, complex coordinate vectors, and cryptic hexadecimal error codes. This research addresses these deficiencies by engineering an Explainable AI (XAI) alert framework integrated with real-time cognitive workload estimation using MediaPipe Eye Aspect Ratio (EAR) and 3D head-pose telemetry. By monitoring operator physiological cues and reaction latencies in a Software-in-the-Loop (SITL) ROS 2 environment, the system determines the onset of cognitive fatigue and dynamically adapts HMI alerts into context-aware, color-coded semantic explanation alerts, demonstrating a 34% reduction in operator decision latency and a 28% improvement in NASA-TLX usability scores.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Human-Robot Collaboration, Explainable AI, Cognitive Workload, NASA-TLX, Software-in-the-Loop (SITL), ROS 2, MediaPipe EAR
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Miller, T. "Explanation in artificial intelligence: Insights from the social sciences," <em>Artificial Intelligence</em>, Vol. 267, pp. 1-38, 2019.</li>
            <li>Adadi, A., and Berrada, M. "Peeking Inside the Black-Box: A Survey on Explainable Artificial Intelligence (XAI)," <em>IEEE Access</em>, Vol. 6, pp. 52138-52160, 2018.</li>
            <li>NASA-TLX: Task Load Index, Human Performance Group, NASA Ames Research Center, 1986.</li>
        </ul>
    </div>
</div>`,

    log08: `<div class="structured-modal-content">
    <div class="modal-info-title">Coupled Thermo-Structural and Pre-Stressed Modal Dynamics of a Solid Rocket Motor Convergent-Divergent Nozzle</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CONFERENCE SUBMISSION METADATA //</div>
        <div class="modal-info-text">
            <strong>CONFERENCE:</strong> International Conference on Thermal, Manufacturing &amp; Design (iTMD 2026) — Dr B R Ambedkar National Institute of Technology (NIT) Jalandhar<br>
            <strong>PAPER ID:</strong> 419 (Microsoft CMT Submission)<br>
            <strong>AUTHOR:</strong> Harshal Gadekar (Rajarshi Shahu College of Engineering, Pune)<br>
            <strong>SUBJECT AREAS:</strong> Aerospace Structures &amp; Propulsion // Simulation, FEM &amp; Multiphysics Analysis<br>
            <strong>STATUS:</strong> Submitted / Under Peer Review
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT &amp; MULTIPHYSICS FORMULATION //</div>
        <div class="modal-info-text">
            Solid rocket motor (SRM) convergent-divergent (de Laval) nozzles experience extreme transient thermal shock and multi-axial aerodynamic pressure traction within milliseconds of propellant ignition, creating severe thermomechanical stress gradients and potential aeroacoustic-structural resonance. This study formulates a one-way coupled thermo-structural and pre-stressed modal finite element pipeline in ANSYS for an aerospace-grade aluminum alloy C-D nozzle (30° convergent half-angle, <em>R<sub>c</sub></em> = 12 mm sonic throat contour, 15° expansion bell) discretized with quadratic tetrahedral (Tet10) and 5-layer boundary-layer prism wedge (Wedge15) elements.
        </div>
        <div class="modal-info-text">
            Under transient convective combustion loading (<em>h<sub>in</sub></em> = 2500 W/m²K, <em>T<sub>gas</sub></em> = 1200°C) over a 5.0 s motor burn and <em>P</em> = 5.0 MPa internal chamber pressure traction, transient thermal analysis identifies a peak throat wall temperature of <strong><em>T<sub>max</sub></em> = 1103.3°C</strong> and maximum heat flux of <strong><em>q''<sub>max</sub></em> = 2.355 W/mm²</strong>. Importing the 3D nodal thermal field into the static structural solver yields an unconstrained divergent exit radial flare of <strong><em>δ<sub>max</sub></em> = 0.2007 mm</strong>, maximum tensile principal stress of <strong><em>σ<sub>1</sub></em> = 367.47 MPa</strong>, and localized equivalent von-Mises stress risers (<strong><em>σ<sub>v</sub></em> = 1021.5 MPa</strong>) at the external casing retention groove fillet, establishing the necessity of geometric thermal relief and ablative insulating sleeves in metallic nozzle carriers.
        </div>
        <div class="modal-info-text">
            To evaluate dynamic stability against combustion chugging (100–1500 Hz) and acoustic cavity oscillations, a Block Lanczos eigenvalue extraction was executed on the stress-stiffened system ([<strong>K</strong>] + [<strong>S</strong>(<em>σ<sub>th,p</sub></em>)] − <em>ω<sub>i</sub></em>²[<strong>M</strong>]){<em>ϕ<sub>i</sub></em>} = <strong>0</strong>. The first six pre-stressed operational natural frequencies (<strong><em>f<sub>1</sub></em> = 7985.1 Hz</strong> fundamental lateral bending, <em>f<sub>2</sub></em> = 7988.0 Hz, <em>f<sub>3,4</sub></em> = 10661.0 Hz circumferential <em>n</em> = 2 ring ovalization, <em>f<sub>5</sub></em> = 14671.0 Hz coupled axial-bending, and <em>f<sub>6</sub></em> = 25670.0 Hz <em>n</em> = 3 harmonic shell distortion) confirm that operational natural frequencies exceed 7.9 kHz, safely decoupling the nozzle from low-frequency acoustic combustion instabilities. A 3-tier grid independence study (17,254 to 72,174 elements / 115,326 nodes) verified asymptotic convergence with <strong>&lt;0.01% temperature deviation (0.009%)</strong> and <strong>0.016% fundamental frequency variation</strong>.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Solid Rocket Motor, Convergent-Divergent Nozzle, Coupled Thermo-Structural Analysis, Pre-Stressed Modal Dynamics, Finite Element Analysis (ANSYS), Block Lanczos Eigenvalue Extraction, Grid Independence, Equivalent von-Mises Stress
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Sutton, G. P., and Biblarz, O. "Rocket Propulsion Elements," 9th Edition, John Wiley &amp; Sons, 2016.</li>
            <li>Rao, D. K., and Kumar, P. "Thermomechanical analysis of submerged nozzles in solid rocket motors," <em>Journal of Propulsion and Power</em>, Vol. 32, No. 4, pp. 912-921, 2016.</li>
            <li>Culick, F. E. C. "Combustion instabilities in solid rocket motors: A review," <em>AIAA Paper 2006-4512</em>, 2006.</li>
            <li>Bathe, K. J. "Finite Element Procedures," 2nd Edition, Prentice Hall, 2006.</li>
            <li>Bartz, D. R. "A simple equation for rapid estimation of rocket nozzle convective heat transfer coefficients," <em>Jet Propulsion</em>, Vol. 27, No. 1, pp. 49-51, 1957.</li>
        </ul>
    </div>
</div>`,

    pat01: `<div class="structured-modal-content">
    <div class="modal-info-title">Autonomous Precision Seedling Planting Robot</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTELLECTUAL PROPERTY INDIA // DESIGN FILING METADATA</div>
        <div class="modal-info-text">
            <strong>APPLICATION NO:</strong> 517599-001<br>
            <strong>C.B.R. NO:</strong> 221677 // <strong>FILING DATE:</strong> 13 September 2026<br>
            <strong>AUTHORITY:</strong> Controller General of Patents, Designs &amp; Trade Marks (Intellectual Property India)<br>
            <strong>APPLICANT:</strong> Harshal Hemant Gadekar<br>
            <strong>STATUS:</strong> Form 1 Filed / Under Examination
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">TECHNICAL OVERVIEW //</div>
        <div class="modal-info-text">
            Registered industrial and mechanical design for an Autonomous Precision Seedling Planting Robot engineered for automated agricultural deployment. The design integrates a ruggedized multi-terrain mobile chassis with a synchronized mechatronic seedling indexing and soil-implantation mechanism, optimizing structural weight distribution, mechanical reliability, and field durability across uneven agricultural terrain.
        </div>
    </div>
</div>`,

    pat02: `<div class="structured-modal-content">
    <div class="modal-info-title">Automated Health Diagnostic Kiosk</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTELLECTUAL PROPERTY INDIA // DESIGN FILING METADATA</div>
        <div class="modal-info-text">
            <strong>APPLICATION NO:</strong> 507688-001<br>
            <strong>C.B.R. NO:</strong> 215057 // <strong>FILING DATE:</strong> 30 June 2026<br>
            <strong>AUTHORITY:</strong> Controller General of Patents, Designs &amp; Trade Marks (Intellectual Property India)<br>
            <strong>APPLICANT:</strong> Harshal Hemant Gadekar<br>
            <strong>STATUS:</strong> FER Reply Submitted / Under Examination
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">TECHNICAL OVERVIEW //</div>
        <div class="modal-info-text">
            Registered industrial design for a self-contained Automated Health Diagnostic Kiosk featuring an ergonomic human-machine interface enclosure, integrated multi-sensor biometric acquisition bays, and modular internal hardware compartmentalization for rapid point-of-care clinical screening and telemedicine diagnostics.
        </div>
    </div>
</div>`,

    pat03: `<div class="structured-modal-content">
    <div class="modal-info-title">High-Tech Rover Adaptive Suspension Mechanism</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">DESIGN PATENT INITIATIVE // MECHANICAL &amp; AEROSPACE SYSTEMS</div>
        <div class="modal-info-text">
            <strong>TIMELINE:</strong> January 2026 – Present<br>
            <strong>DOMAIN:</strong> Extreme-Terrain Planetary &amp; Field Rover Mobility<br>
            <strong>STATUS:</strong> Design Lifecycle &amp; Structural Modelling Completed
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">TECHNICAL OVERVIEW //</div>
        <div class="modal-info-text">
            Led the end-to-end design lifecycle and 3D CAD kinematic modelling of an adaptive rover suspension architecture engineered to optimize unsprung mass, mechanical reliability, and structural durability in extreme off-road and planetary environments. Directed mechanism articulation development to maximize ground contact stability and hardware longevity over high-gradient obstacles.
        </div>
    </div>
</div>`,

    cert01: `<div class="structured-modal-content">
    <div class="modal-info-title">Fundamentals of Simcenter STAR-CCM+</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CREDENTIAL METADATA //</div>
        <div class="modal-info-text">
            <strong>ISSUING ORGANIZATION:</strong> Siemens Digital Industries Software<br>
            <strong>PROGRAM:</strong> Siemens Enterprise Learning Membership<br>
            <strong>COMPLETION DATE:</strong> 25 September 2026<br>
            <strong>DOMAIN:</strong> Computational Fluid Dynamics (CFD), Finite Volume Meshing &amp; Multiphysics Simulation
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">COMPETENCIES VERIFIED //</div>
        <div class="modal-info-text">
            End-to-end CFD simulation workflow in Simcenter STAR-CCM+, including 3D CAD geometry preparation, automated polyhedral and prism-layer meshing, turbulence modelling, conjugate heat transfer analysis, and post-processing of aerodynamic and propulsion flow fields.
        </div>
    </div>
</div>`,

    cert02: `<div class="structured-modal-content">
    <div class="modal-info-title">Foundations of Project Management</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CREDENTIAL METADATA //</div>
        <div class="modal-info-text">
            <strong>ISSUING ORGANIZATION:</strong> Google<br>
            <strong>CREDENTIAL TYPE:</strong> Professional Certificate Module<br>
            <strong>DOMAIN:</strong> Engineering Project Lifecycle, Agile/Scrum Execution &amp; Risk Management
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">COMPETENCIES VERIFIED //</div>
        <div class="modal-info-text">
            Cross-functional engineering team leadership, project lifecycle planning, resource allocation, stakeholder communication, and structured risk mitigation across hardware and software development sprints.
        </div>
    </div>
</div>`,

    cert03: `<div class="structured-modal-content">
    <div class="modal-info-title">Design Thinking for Innovation</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CREDENTIAL METADATA //</div>
        <div class="modal-info-text">
            <strong>ISSUING ORGANIZATION:</strong> University of Virginia<br>
            <strong>DOMAIN:</strong> Systems Design, Rapid Prototyping &amp; Engineering Innovation
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">COMPETENCIES VERIFIED //</div>
        <div class="modal-info-text">
            Structured human-centric engineering design methodology, translating complex operational bottlenecks into scalable technical architectures, iterative prototyping, and functional validation.
        </div>
    </div>
</div>`,

    cert04: `<div class="structured-modal-content">
    <div class="modal-info-title">Rocket Propulsion and Spacecraft Dynamics</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CREDENTIAL METADATA //</div>
        <div class="modal-info-text">
            <strong>ISSUING ORGANIZATION:</strong> Kodacy<br>
            <strong>DOMAIN:</strong> Aerospace Propulsion, Nozzle Thermodynamics &amp; Orbital Mechanics
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">COMPETENCIES VERIFIED //</div>
        <div class="modal-info-text">
            Solid and liquid rocket motor internal ballistics, specific impulse optimization, de Laval nozzle expansion dynamics, thrust-to-weight profiling, and spacecraft trajectory mechanics.
        </div>
    </div>
</div>`,

    cert05: `<div class="structured-modal-content">
    <div class="modal-info-title">Certified Entry-Level Python Programmer</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">CREDENTIAL METADATA //</div>
        <div class="modal-info-text">
            <strong>ISSUING ORGANIZATION:</strong> Udemy<br>
            <strong>DOMAIN:</strong> Python Programming, Algorithmic Automation &amp; Data Processing
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">COMPETENCIES VERIFIED //</div>
        <div class="modal-info-text">
            Python software architecture, data structures, numerical scripting, sensor telemetry parsing, and computer vision automation pipelines.
        </div>
    </div>
</div>`
};

const defaultReadouts = {
    "T01": "P_CHAMBER: IDLE",
    "T02": "LATENCY: IDLE",
    "T03": "BUS_CYCLE: IDLE",
    "T04": "ERR_STEER: IDLE"
};

function initResearchModule() {
    const cards = document.querySelectorAll("#research .log-card");
    const filterButtons = document.querySelectorAll("#research .filter-btn");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterType = btn.getAttribute("data-filter");

            cards.forEach(card => {
                const cardStatus = card.getAttribute("data-status");
                if (filterType === "all" || cardStatus === filterType) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}


function openTerminalViewport(nodeId) {
    const modal = document.getElementById("terminal-viewport-modal");
    const headerTitle = document.getElementById("modal-node-id");
    const contentBox = document.getElementById("modal-dynamic-content");

    if (abstractDatabase[nodeId] && modal) {
        headerTitle.textContent = `CORE_NODE_READOUT // SEC_REF_REP_${nodeId.toUpperCase()}`;
        contentBox.innerHTML = abstractDatabase[nodeId];
        modal.style.display = "flex";
    }
}

function closeTerminalViewport() {
    const modal = document.getElementById("terminal-viewport-modal");
    if (modal) modal.style.display = "none";
}

window.copyBibTeXCitation = function(doi, title) {
    const bibtex = `@techreport{gadekar2026_${doi.replace(/[^a-zA-Z0-9]/g, '_')},
  title={${title}},
  author={Gadekar, Harshal},
  year={2026},
  institution={Zenodo},
  doi={${doi}},
  url={https://doi.org/${doi}}
}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bibtex).then(() => {
            const notif = document.getElementById("copied-notification");
            if (notif) {
                notif.textContent = "[ BIBTEX CITATION COPIED TO CLIPBOARD ]";
                notif.style.opacity = "1";
                setTimeout(() => {
                    notif.style.opacity = "0";
                }, 2500);
            }
        }).catch(() => {});
    }
};

// Escape key bind listener for clean modal breakout
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTerminalViewport();
});



const skillsData = [
  {
    id: '01',
    title: 'DESIGN',
    tools: 'FUSION 360 // SOLIDWORKS',
    activeApplication: '95%',
    svgClass: 'gear-svg',
    innerSVG: `
      <g class="gear-1">
        <circle cx="8" cy="12" r="3"/>
        <path d="M8 7v2M8 15v2M3 12h2M11 12h2M4.5 8.5l1.5 1.5M10 14l1.5 1.5M4.5 15.5l1.5-1.5M10 10l1.5-1.5"/>
      </g>
      <g class="gear-2">
        <circle cx="16" cy="12" r="3"/>
        <path d="M16 7v2M16 15v2M11 12h2M19 12h2M12.5 8.5l1.5 1.5M18 14l1.5 1.5M12.5 15.5l1.5-1.5M18 10l1.5-1.5"/>
      </g>
    `
  },
  {
    id: '02',
    title: 'AEROSPACE',
    tools: 'OPENMOTOR // NASA CEA',
    activeApplication: '80%',
    svgClass: 'rocket-svg',
    innerSVG: `
      <path d="M12 2L9 7v6l-2 3v3h10v-3l-2-3V7l-3-5z" />
      <line x1="12" y1="19" x2="12" y2="23" class="thrust-flame" />
      <line x1="10" y1="19" x2="10" y2="21" class="thrust-flame-left" />
      <line x1="14" y1="19" x2="14" y2="21" class="thrust-flame-right" />
    `
  },
  {
    id: '03',
    title: 'SIMULATION',
    tools: 'ANSYS // MATLAB',
    activeApplication: '85%',
    svgClass: 'fea-svg',
    innerSVG: `
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      <path d="M12 2v20M2 7v10M22 7v10" class="fea-mesh-lines" stroke-dasharray="2" />
    `
  },
  {
    id: '04',
    title: 'CODING',
    tools: 'PYTHON // C++',
    activeApplication: '80%',
    svgClass: 'term-svg',
    innerSVG: `
      <rect x="2" y="4" width="20" height="16" rx="1"/>
      <path d="M6 9l3 3-3 3M11 15h4" class="term-cursor"/>
    `
  },
  {
    id: '05',
    title: 'LEADERSHIP',
    tools: 'SCRUM // NEGOTIATION',
    activeApplication: '90%',
    svgClass: 'scrum-svg',
    innerSVG: `
      <path d="M3 3h18v18H3V3zM9 3v18M15 3v18"/>
      <rect class="scrum-card" x="11" y="6" width="2" height="4" rx="0.5" fill="currentColor"/>
    `
  },
  {
    id: '06',
    title: 'COMPLIANCE',
    tools: 'PATENT // LATEX',
    activeApplication: '80%',
    svgClass: 'strategy-svg',
    innerSVG: `
      <circle cx="12" cy="5" r="2"/>
      <circle cx="5" cy="15" r="2"/>
      <circle cx="19" cy="15" r="2"/>
      <path class="strategy-link" d="M12 7l-5 6M12 7l5 6" stroke-dasharray="2"/>
    `
  }
];

function initSkillsGrid() {
  const container = document.getElementById('skills-grid-container');
  if (!container) return;

  container.innerHTML = skillsData.map(node => `
    <div class="skill-card-minimal" data-node="${node.id}">
        <div>
            <div class="skill-card-header">
                <span class="skill-card-node">NODE_${node.id}</span>
                <div class="skill-card-status">
                    <svg class="${node.svgClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        ${node.innerSVG}
                    </svg>
                </div>
            </div>
            <div class="skill-title">${node.title}</div>
        </div>
        <div class="skill-card-bottom">
            <div class="skill-card-tools">
                ${node.tools}
            </div>
            <div class="capacity-bar-wrapper">
                <div class="capacity-bar-info">
                    <span class="capacity-val">${node.activeApplication}</span>
                </div>
                <div class="capacity-track">
                    <div class="capacity-fill" style="width: ${node.activeApplication};"></div>
                </div>
            </div>
        </div>
    </div>
  `).join('');
}

function initContactValidationModule() {
    const fields = document.querySelectorAll(".input-field");

    fields.forEach(field => {
        // Real-time verification tracker as the user types
        field.addEventListener("input", () => {
            if (field.value.trim().length > 0) {
                field.classList.remove("field-fault");
                field.classList.add("field-success");
            } else {
                field.classList.remove("field-success");
                field.classList.remove("field-fault");
            }
        });

        // System fallback validation check when user exits a text field boundary
        field.addEventListener("blur", () => {
            if (field.value.trim().length === 0) {
                field.classList.remove("field-success");
                field.classList.add("field-fault");
            } else {
                field.classList.remove("field-fault");
                field.classList.add("field-success");
            }
        });
    });
}

/**
 * 8. Interactive Home Terminal Command Prompt Ticker
 * Coordinates dynamic console inputs and technical readout reports
 */
function initHomeTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalConsole = document.querySelector('.hud-terminal-console');

  if (!terminalInput || !terminalHistory) return;

  const commands = {
    help: 'SYS_COMS: AVAILABLE_MODULES [ HELP, ABOUT, SKILLS, PROJECTS, RESEARCH, PATENTS, CERTIFICATIONS, CONTACT, CLEAR ]',
    about: 'HG_CORE: Harshal Gadekar // AUTOMATION & ROBOTICS ENGINEER. EXPERT IN FLUID DYNAMICS, INTERNAL BALLISTICS, REAL-TIME EMBEDDED CONTROLS, AND COGNITIVE HMI EXPERIMENTS.',
    skills: 'HG_CAPABILITIES: [NODE_01: DESIGN (FUSION 360, SOLIDWORKS)] [NODE_02: AEROSPACE (OPENMOTOR, NASA CEA)] [NODE_03: SIMULATION (ANSYS, MATLAB)] [NODE_04: CODING (PYTHON, C++)] [NODE_05: LEADERSHIP (SCRUM, NEGOTIATION)] [NODE_06: COMPLIANCE (PATENT, LATEX)]',
    projects: 'HG_ARCHIVE: PRARAMBH_1 (Solid Rocket Motor), CNC_FOAM_CUTTER (GRBL), BMW_V6_ENGINE, AUTONOMOUS_AGV (Hough CV), HEAVY_DUTY_QUADCOPTER',
    research: 'HG_RESEARCH: [1] PRARAMBH_1 SOLID ROCKET MOTOR (TDRSR-PROP-TR-2026-001) // [2] SIEMENS S7-1200 HYBRID SORTING SYSTEM // [3] ESP32+OPENCV VISION LINE FOLLOWER // [4] AI HEALTHCARE TRIAGE KIOSK // [5] AGROBOT SEEDLING ROBOT (PURDUE EPICS) // [6] OPTICAL ILLUMINATION & KINETIC ORIENTATION REVIEW // [7] XAI COBOT HANDOVER (ICoRD \'27, ID 374) // [8] SRM C-D NOZZLE THERMO-STRUCTURAL & MODAL DYNAMICS (iTMD 2026 — NIT JALANDHAR, ID 419)',
    patents: 'HG_PATENTS: [1] AUTONOMOUS PRECISION SEEDLING PLANTING ROBOT (App No. 517599-001) // [2] AUTOMATED HEALTH DIAGNOSTIC KIOSK (App No. 507688-001) // [3] HIGH-TECH ROVER ADAPTIVE SUSPENSION',
    certifications: 'HG_CREDENTIALS: SIEMENS (Simcenter STAR-CCM+), GOOGLE (Project Management), UNIV OF VIRGINIA (Design Thinking), KODACY (Rocket Propulsion), UDEMY (Python Programmer)',
    contact: 'HG_UPLINK: EMAIL [ harshalgadekar72@gmail.com ] // LINKEDIN [ harshal-gadekar ] // GITHUB [ CODE-ROBO ]',
    stark: 'STARK_HUD: MARK LXXXV SYSTEM OPERATIONAL. ARC REACTOR OUTPUT AT 99.8% NOMINAL CAPACITY. F.R.I.D.A.Y ONLINE.',
    arc: 'ARC_REACTOR: PALLADIUM / VIBRANIUM HYBRID CORE ONLINE // OUTPUT: 3.5GW // TEMPERATURE: 24.8°C // INTEGRITY: 100%',
    friday: 'F.R.I.D.A.Y: AI ASSISTANT READY.',
    ironman: 'STARK_INDUSTRIES: "I AM IRON MAN." ADVANCED MECHATRONIC SYSTEMS & REAL-TIME EMBEDDED AVIONICS ACTIVE.',
    mark85: 'MARK_LXXXV: NANOTECH ARMOR MATRIX STANDBY // FLIGHT THRUSTERS NOMINAL // AVIONICS HUD SYNCHRONIZED.'
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = terminalInput.value.trim();
      if (value === '') return;

      const parts = value.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').toLowerCase();

      // Create and append user terminal input line
      const userLine = document.createElement('div');
      userLine.className = 'term-line input';
      userLine.textContent = `HG:\\> ${value}`;
      terminalHistory.appendChild(userLine);

      // Clear the text input
      terminalInput.value = '';

      // Execute command reply simulation
      setTimeout(() => {
        if (cmd === 'clear') {
          terminalHistory.innerHTML = '';
          return;
        }

        if (cmd === 'contacts' || cmd === 'export') {
          const success = downloadContactsCSV();
          const replyLine = document.createElement('div');
          if (success) {
            replyLine.className = 'term-line output';
            replyLine.textContent = `> SUCCESS: COMPILING CONTACTS DATABASE... CSV FILE DOWNLOADED.`;
          } else {
            replyLine.className = 'term-line error';
            replyLine.textContent = `> ERROR: NO SUBMISSION DATA FOUND IN LOCAL DATABASE.`;
          }
          terminalHistory.appendChild(replyLine);
          terminalHistory.scrollTop = terminalHistory.scrollHeight;
          return;
        }

        const replyLine = document.createElement('div');
        replyLine.className = 'term-line output';

        if (cmd === 'theme') {
          if (!arg) {
            replyLine.textContent = `> THEME_COMS: AVAILABLE_THEMES [ GOLD, CYAN, GREEN, CRIMSON ]. USE: THEME <theme_name>`;
          } else if (arg === 'gold' || arg === 'cyan' || arg === 'green' || arg === 'crimson') {
            const dot = document.querySelector(`.theme-dot.theme-${arg}`);
            if (dot) {
              dot.click();
              replyLine.textContent = `> THEME_COMS: SUCCESS. SWITCHED CORE THEME TO ${arg.toUpperCase()}.`;
            } else {
              replyLine.textContent = `> THEME_COMS: ERROR. CONTROLLER ELEMENT NOT ACTIVE.`;
              replyLine.className = 'term-line error';
            }
          } else {
            replyLine.textContent = `> THEME_COMS: ERROR. THEME '${arg.toUpperCase()}' NOT RECOGNIZED.`;
            replyLine.className = 'term-line error';
          }
        } else if (cmd === 'voice') {
          const speechMuted = localStorage.getItem('jarvis-speech-muted') === 'true';
          if (!arg) {
            replyLine.textContent = `> VOICE_COMS: CURRENT_STATUS: [ ${speechMuted ? 'MUTED' : 'ACTIVE'} ]. USE: VOICE MUTE / VOICE UNMUTE`;
          } else if (arg === 'mute') {
            if (!speechMuted) {
              const toggle = document.getElementById('jarvis-speech-toggle');
              if (toggle) toggle.click();
            }
            replyLine.textContent = `> VOICE_COMS: SUCCESS. SPEECH SYNTHESIS ENGINE MUTED.`;
          } else if (arg === 'unmute') {
            if (speechMuted) {
              const toggle = document.getElementById('jarvis-speech-toggle');
              if (toggle) toggle.click();
            }
            replyLine.textContent = `> VOICE_COMS: SUCCESS. SPEECH SYNTHESIS ENGINE ACTIVATED.`;
          } else {
            replyLine.textContent = `> VOICE_COMS: ERROR. PARAMETER '${arg.toUpperCase()}' NOT RECOGNIZED.`;
            replyLine.className = 'term-line error';
          }
        } else if (cmd === 'status') {
          replyLine.textContent = `> SYS_STATUS: Friday Core Node: ONLINE // Sound Engine: ACTIVE // 3D Viewport: LOADED // Client Telemetry: ACTIVE // Buffer Status: NOMINAL // Error Rate: 0.00%`;
        } else if (commands[cmd]) {
          replyLine.textContent = `> ${commands[cmd]}`;
        } else {
          replyLine.className = 'term-line error';
          replyLine.textContent = `> ERROR: COMMAND '${cmd.toUpperCase()}' NOT FOUND. TYPE 'HELP'`;
        }

        terminalHistory.appendChild(replyLine);
        
        // Auto-scroll terminal history frame
        terminalHistory.scrollTop = terminalHistory.scrollHeight;
      }, 50);
    }
  });

  // Focus the input field when the terminal area is clicked
  if (terminalConsole) {
    terminalConsole.addEventListener('click', () => {
      terminalInput.focus();
    });
  }
}

/**
 * 9. Custom 3D Model Material Styling
 * Dynamically colors the imported CAD model to look premium and match the dashboard theme.
/**
 * 10. Project 2D CAD Blueprint Lightbox Inspector
 * Handles high-resolution inspection of technical drawings, schematics, and CAD designs.
 */
function initProjectLightbox() {
  // Bind escape key to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('cad-lightbox-modal');
      if (modal && modal.classList.contains('active')) {
        closeImageLightbox();
      }
    }
  });
}

window.openImageLightbox = function(imageSrc, titleText) {
  const modal = document.getElementById('cad-lightbox-modal');
  const img = document.getElementById('cad-lightbox-img');
  const title = document.getElementById('cad-lightbox-title');
  
  if (!modal || !img) return;

  img.src = imageSrc;
  if (title && titleText) {
    title.textContent = titleText;
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeImageLightbox = function(e) {
  if (e && e.target && e.target.closest('.cad-lightbox-panel') && !e.target.closest('.cad-lightbox-close')) {
    return; // Don't close if clicked inside panel unless close button
  }
  
  const modal = document.getElementById('cad-lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};


/**
 * 12. Dynamic Theme Switcher HUD Module
 * Redefines CSS Variables dynamically on root element and synchronizes state
 */
function initThemeSwitcher() {
  const themeDots = document.querySelectorAll('.theme-dot');
  const activeTheme = localStorage.getItem('active-theme') || 'gold';

  const themes = {
    gold: {
      color: '#C5A059',
      glow: 'rgba(197, 160, 89, 0.25)'
    },
    cyan: {
      color: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.25)'
    },
    green: {
      color: '#039855',
      glow: 'rgba(3, 152, 85, 0.25)'
    },
    crimson: {
      color: '#D60505',
      glow: 'rgba(214, 5, 5, 0.25)'
    }
  };

  const applyTheme = (themeName) => {
    const theme = themes[themeName] || themes.gold;
    document.documentElement.style.setProperty('--color-accent-gold', theme.color);
    document.documentElement.style.setProperty('--color-accent-gold-glow', theme.glow);
    
    // Play clicking sound using JarvisSoundEngine if initialized
    if (typeof JarvisSoundEngine !== 'undefined' && JarvisSoundEngine.playClick) {
      JarvisSoundEngine.playClick();
    }

    // Update active class on dots
    themeDots.forEach(dot => {
      if (dot.getAttribute('data-theme') === themeName) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    localStorage.setItem('active-theme', themeName);
  };

  // Bind clicks
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const themeName = dot.getAttribute('data-theme');
      applyTheme(themeName);
    });
  });

  // Apply default or cached theme on load
  applyTheme(activeTheme);
}

