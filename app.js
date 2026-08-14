/**
 * A.E.G.I.S. SYSTEM INTERFACE ENGINE
 * Handles: Hexagonal drifting background, 3D wireframe core rendering, SPA transitions, live metrics, clocks.
 */

let testInterval = null;

// Pre-populate SpeechSynthesis voice cache early to ensure reliable female voice selection
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Critical Telemetry Initialization (Render immediately)
  initThemeSwitcher();
  initSystemClock();
  initSPARouting();
  initEngineeringCanvas();
  initHomeTerminal();

  // 2. Non-Critical Modules (Deferred to keep main thread free for instant loading)
  const deferSetup = () => {
    initMetricsFluctuation();
    initTacticalFeatures();
    initWordLimitCounters();
    initResearchModule();
    initSkillsGrid();
    initContactValidationModule();
    initProjectLightbox();
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => setTimeout(deferSetup, 30));
  } else {
    setTimeout(deferSetup, 30);
  }
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
 * Smooth opacity fading keeping background and framework persistent
 */
function initSPARouting() {
  const routerElements = document.querySelectorAll('.nav-link, .nav-link-logo, .circular-link-btn');
  const sections = document.querySelectorAll('.spa-section');

  const updateScrollLock = (sectionId) => {
    if (sectionId && sectionId.toLowerCase() === 'contact') {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  const updateModelViewerLifecycle = (sectionId) => {
    const modelViewers = document.querySelectorAll('.project-model-viewer');
    if (sectionId && sectionId.toLowerCase() === 'projects') {
      // Dynamically load Google model-viewer library on Projects tab activation
      loadModelViewerScript();

      modelViewers.forEach(modelViewer => {
        const savedSrc = modelViewer.getAttribute('data-src');
        if (savedSrc && modelViewer.getAttribute('src') !== savedSrc) {
          modelViewer.setAttribute('src', savedSrc);
        }
      });
    } else {
      modelViewers.forEach(modelViewer => {
        const currentSrc = modelViewer.getAttribute('src');
        if (currentSrc && currentSrc !== '') {
          modelViewer.setAttribute('data-src', currentSrc);
          modelViewer.setAttribute('src', '');
          
          // Reset activation button text and enabled states inside the poster
          const btn = modelViewer.querySelector('.activate-3d-btn');
          if (btn) {
            btn.textContent = '[ INITIALIZE 3D VIRTUALIZATION ]';
            btn.disabled = false;
            btn.style.borderColor = '';
            btn.style.color = '';
          }
          const schematic = modelViewer.closest('.project-schematic');
          if (schematic) {
            schematic.classList.remove('scanning');
          }
        }
      });
    }
  };

  routerElements.forEach(element => {
    element.addEventListener('click', (e) => {
      // If it's a download link (Resume), let the browser handle it!
      if (element.hasAttribute('download')) {
        return;
      }
      
      e.preventDefault();
      
      const targetSectionId = element.getAttribute('data-section');
      const targetSection = document.getElementById(targetSectionId);

      if (!targetSection) return;

      // Update navbar links active classes
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const activeNav = document.querySelector(`.nav-link[data-section="${targetSectionId}"]`);
      if (activeNav) {
        activeNav.classList.add('active');
      }

      // Update section opacity visibilities
      sections.forEach(section => {
        section.classList.remove('active');
      });
      targetSection.classList.add('active');

      // Update scroll lock dynamically
      updateScrollLock(targetSectionId);

      // Update model-viewer lifecycle states
      updateModelViewerLifecycle(targetSectionId);

      // Update URL hash smoothly
      history.pushState(null, null, `#${targetSectionId}`);

      // Handle tab-switch custom initializations
      handleTabSwitch(targetSectionId);
    });
  });

  // Handle deep-linking initial page loads
  const currentHash = window.location.hash.substring(1);
  if (currentHash) {
    const matchedLink = document.querySelector(`.nav-link[data-section="${currentHash}"]`);
    if (matchedLink) {
      matchedLink.click();
    }
  } else {
    // Initial scroll lock check for default active tab
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      const activeSection = activeLink.getAttribute('data-section');
      updateScrollLock(activeSection);
      updateModelViewerLifecycle(activeSection);
    }
  }
}

/**
 * 2. High-Performance Engineering CAD Matrix & Ambient Data Constellation
 * Minimalist blueprint coordinate grid, subtle crosshair markers (+), and delicate data constellation nodes.
 */
function initEngineeringCanvas() {
  const canvas = document.getElementById('hex-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = { x: -1000, y: -1000, active: false };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Precision Engineering CAD Data Nodes
  const nodeCount = Math.min(30, Math.max(16, Math.floor((width * height) / 45000)));
  const nodes = [];
  const colors = ['#C5A059', '#D60505', '#222222'];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: 1.2 + Math.random() * 1.5,
      color: colors[i % colors.length],
      baseAlpha: 0.15 + Math.random() * 0.2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      pulsePhase: Math.random() * Math.PI * 2
    });
  }

  const gridSize = 60; // 60px engineering grid intervals
  let tick = 0;

  function render() {
    tick++;

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

    // 4. Update and Connect Ambient Telemetry Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      if (n1.x < 0) n1.x = width;
      if (n1.x > width) n1.x = 0;
      if (n1.y < 0) n1.y = height;
      if (n1.y > height) n1.y = 0;

      // Mouse gentle interaction
      if (mouse.active) {
        const dx = mouse.x - n1.x;
        const dy = mouse.y - n1.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          n1.x -= (dx / dist) * force * 1.5;
          n1.y -= (dy / dist) * force * 1.5;
        }
      }

      // Proximity constellation lines between nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = `rgba(197, 160, 89, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // 5. Draw the Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const alphaPulse = n.baseAlpha + Math.sin(tick * n.pulseSpeed + n.pulsePhase) * 0.08;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.globalAlpha = Math.max(0.08, alphaPulse);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 6. Subtle cursor beacon when active
    if (mouse.active) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
      gradient.addColorStop(0, 'rgba(197, 160, 89, 0.035)');
      gradient.addColorStop(0.5, 'rgba(214, 5, 5, 0.012)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
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
    <div class="modal-info-title">Design of Explainable AI Alerts for Cognitive Overload in Cobot Task Handover Panels</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT //</div>
        <div class="modal-info-text">
            Human-robot collaboration (HRC) in modern industrial assembly lines requires rapid, high-integrity decision-making during physical part handover sequences. However, traditional human-machine interfaces (HMIs) frequently induce acute cognitive overload in human operators by streaming raw, uninterpreted sensor logs, complex coordinate vectors, and cryptic numerical error codes. This cognitive friction increases task completion latency, elevates error rates, and degrades operator trust in automated partners. This research addresses these deficiencies by engineering an Explainable AI (XAI) alert framework integrated with real-time cognitive workload estimation. By monitoring operator physiological cues and reaction latencies, the system determines the onset of cognitive fatigue and dynamically adapts HMI alerts. The core architecture completely deprecates opaque numerical system fault codes, replacing them with context-aware, color-coded semantic explanation alerts that highlight the root cause, system confidence, and actionable recovery procedures in real-time. Experimental evaluations conducted on a simulated mechatronic handover panel demonstrated a 34% reduction in operator decision latency and a 28% increase in system usability scores compared to traditional static readouts. This research establishes a path for implementing resilient, human-centric automation frameworks that preserve operator trust in high-velocity collaborative manufacturing environments.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Explainable Artificial Intelligence, Human-Robot Collaboration, Cognitive Overload, Human-Machine Interfaces, Industrial Automation, Decision Latency, Adaptive Telemetry
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTRODUCTION //</div>
        <div class="modal-info-text">
            The rapid escalation of automated systems in modern manufacturing has transformed the role of human operators from manual laborers to system supervisors, necessitating close, physical interaction with collaborative robots (cobots). In high-speed assembly and part handover operations, the synchronization of human speed and mechanical force demands absolute perceptual clarity. However, conventional HMI architectures fail to adapt to human psychological boundaries, often flooding operators with continuous, raw sensor streams. When anomalies occur, these systems output binary error logs that require cognitive translation, leading to micro-delays that compromise safety and process efficiency. This research introduces a dynamic cognitive monitoring loop that scales HMI information density based on the operator's real-time cognitive state, ensuring that critical data is highlighted when load is high. By leveraging non-intrusive sensor telemetry, the platform dynamically captures operator eye-tracking and response times to evaluate cognitive load.
        </div>
        <div class="modal-info-text">
            To resolve these interfaces, we propose an Explainable AI (XAI) alert layer that translates complex neural network diagnostic vectors into structured, semantic explanations. Rather than displaying an opaque code, the HMI shows a real-time confidence readout, a natural language root-cause description, and a targeted recovery pathway. This interface utilizes a three-tier visual hierarchy (Red: Urgent Halt, Yellow: Corrective Adjustment, Green: Nominal Flow) calibrated to human reaction triggers. We implemented this framework on a physical task handover panel and analyzed operator feedback through NASA-TLX indices. The results verify that explaining system intent and failure modes significantly alleviates mental stress, mitigates decision paralysis, and establishes a predictable, resilient human-cobot partnership. Furthermore, this research outlines how structural semantic explainability bridges the trust gap between human supervisors and autonomous robots, enabling long-term deployment of hybrid workforces.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Miller, T. "Explanation in artificial intelligence: Insights from the social sciences," *Artificial Intelligence*, Vol. 267, pp. 1-38, 2019.</li>
            <li>Adadi, A., and Berrada, M. "Peeking Inside the Black-Box: A Survey on Explainable Artificial Intelligence (XAI)," *IEEE Access*, Vol. 6, pp. 52138-52160, 2018.</li>
            <li>Lipton, Z. C. "The Mythos of Model Interpretability: In machine learning, the concept of interpretability is both important and poorly defined," *Queue*, Vol. 16, No. 3, pp. 31-57, 2018.</li>
            <li>Glikson, E., and Woolley, A. W. "Human trust in artificial intelligence: Review of empirical research," *Academy of Management Annals*, Vol. 14, No. 2, pp. 627-660, 2020.</li>
            <li>NASA-TLX: Task Load Index, Human Performance Group, NASA Ames Research Center, 1986.</li>
        </ul>
    </div>
</div>`,

    log02: `<div class="structured-modal-content">
    <div class="modal-info-title">Development of a Scalable Hybrid Sorting System: A Mechatronic Architecture for Material Recovery</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION & ZENODO ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOI:</strong> <a href="https://doi.org/10.5281/zenodo.21740853" target="_blank" style="color: #00d2ff; text-decoration: underline;">10.5281/zenodo.21740853</a><br>
            <strong>DOCUMENT TYPE:</strong> Technical Report // Open Access Hybrid Sorting Mechatronics & Material Recovery<br>
            <a href="https://zenodo.org/records/21740853" target="_blank" class="zenodo-link-btn font-mono" style="margin-top: 10px; display: inline-flex;">[ OPEN FULL ZENODO REPORT & PDF â†— ]</a>
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT //</div>
        <div class="modal-info-text">
            Decentralized material recovery facilities frequently struggle with the high capital cost of automated waste sorting technologies. Traditional conveyor belt sorting configurations rely on expensive multispectral camera networks and computationally intensive deep learning pipelines that exhibit high latency and low reliability in dust-heavy, vibrating plant environments. This paper presents the design and deployment of a resilient, low-cost mechatronic waste sorting system operating under a total budget of $700. The architecture combines an edge sensing layerâ€”utilizing an Arduino microcontroller polling multi-modal sensors at 1 kHzâ€”with a Siemens S7-1200 programmable logic controller (PLC) that coordinates precise mechanical sorting gates. The sensors capture physical weight, metallic content, and infrared signature data in real-time, fusing these parameters at the edge to categorize items into plastic, metallic, or organic streams. Our hybrid sorting system processes up to 60 objects per minute, achieving a classification accuracy of 92.5%. This study demonstrates that combining low-power edge sensing with robust industrial control hardware offers a scalable, high-performance solution for small-scale recycling centers, bypassing the need for expensive computer vision clusters and enabling localized sustainable waste management.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Waste Sorting, Industrial PLC, Mechatronics, Edge Computing, Sensor Fusion, Material Recovery, Siemens S7-1200
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTRODUCTION //</div>
        <div class="modal-info-text">
            Solid waste sorting in decentralized recycling plants poses a significant logistics challenge due to the extreme heterogeneity of municipal refuse and the financial constraints of municipal recovery facilities. Historically, high-accuracy sorting has been dominated by optical sorters equipped with hyperspectral cameras and near-infrared spectrometers. While highly effective, these systems cost hundreds of thousands of dollars and require pristine operating conditions to prevent lens contamination and computer failures. In contrast, small-scale sorting lines in developing regions continue to rely on manual separation, exposing workers to biohazards and yielding low throughput. This research addresses this gap by developing a mechatronic system that provides automated sorting capabilities at a fraction of the cost, utilizing a robust physical design that withstands harsh industrial environments.
        </div>
        <div class="modal-info-text">
            The core mechatronic architecture separates the sensing and actuation layers into dedicated processing nodes to ensure high reliability. An edge-based sensor array collects real-time weight, inductive metal presence, and capacitive signatures, transferring this multi-modal telemetry to a Siemens S7-1200 PLC via a high-speed communication link. The PLC executes a deterministic sorting state machine, triggering high-speed pneumatic ejectors to divert waste categories into designated bins. By utilizing discrete sensor fusion instead of high-throughput computer vision, the computational load is minimized, allowing the system to run on lightweight, low-cost microcontrollers with sub-millisecond execution times. This layout guarantees that the processing pipeline remains unaffected by particulate matter, ambient lighting changes, or mechanical vibrations. Experimental trials validated that the system achieves high structural durability and sorting precision over extended cycles, presenting a viable path for the localization of automated material recycling technologies globally. The mechatronic design can be replicated using off-the-shelf components, promoting decentralized environmental sustainability.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Siemens AG. "S7-1200 Programmable Controller System Manual," A5E02486680-AH, 2022.</li>
            <li>Fraden, J. "Handbook of Modern Sensors: Physics, Designs, and Applications," 5th Edition, Springer, 2016.</li>
            <li>Gundupalli, S. P., et al. "A review on automatic waste sorting technologies," *Waste Management*, Vol. 60, pp. 33-44, 2017.</li>
            <li>Bolton, W. "Mechatronics: Electronic Control Systems in Mechanical and Electrical Engineering," 7th Edition, Pearson, 2018.</li>
            <li>Garcia-Garza, M. A., et al. "Sensor fusion and PLC integration in modern automation lines," *Journal of Industrial Technology*, Vol. 38, pp. 112-124, 2023.</li>
        </ul>
    </div>
</div>`,

    log03: `<div class="structured-modal-content">
    <div class="modal-info-title">Design Optimization of Propellant Grain Geometry and Structural Casing Stress Analysis for the Prarambh 1 Solid Propulsion System</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION & ZENODO ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOI:</strong> <a href="https://doi.org/10.5281/zenodo.21173319" target="_blank" style="color: #00d2ff; text-decoration: underline;">10.5281/zenodo.21173319</a><br>
            <strong>DOCUMENT TYPE:</strong> Technical Report // Open Access Aerospace Propulsion & Solid Motor Stress Analysis<br>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 10px;">
                <a href="https://zenodo.org/records/21173319" target="_blank" class="zenodo-link-btn font-mono" style="display: inline-flex;">[ OPEN FULL ZENODO REPORT & PDF â†— ]</a>
                <button class="bibtex-btn font-mono" onclick="copyBibTeXCitation('10.5281/zenodo.21173319', 'Design Optimization of Propellant Grain Geometry and Structural Casing Stress Analysis for Prarambh 1')">[ COPY BIBTEX CITATION ðŸ“‹ ]</button>
            </div>
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT //</div>
        <div class="modal-info-text">
            Solid rocket propulsion systems require precise balancing of internal ballistic parameters and structural casing integrity to ensure stable, high-performance flight profiles. This research details the design engineering, numerical internal ballistics verification, and structural finite element analysis (FEA) for the Prarambh 1 solid rocket motor. The design optimizes the star-grain fuel geometry of a potassium nitrate-sorbitol (KNSB) propellant to achieve a neutral burn profile, preventing extreme chamber pressure spikes that could cause structural casing failure. Using a custom ballistics regression simulator, we optimized the surface-area-to-volume ratio of the propellant grains to maintain a steady chamber pressure of 3.2 MPa throughout the burn cycle. Structural casing stress analysis was performed under peak thrust conditions using ANSYS, examining deformation, safety margins, and thermal expansion boundaries for both aluminum 6061-T6 and composite casing alternatives. The simulation results verified a minimum structural factor of safety of 2.1 under maximum operating pressure. This work establishes a verified, low-cost engineering framework for collegiate rocketry programs, demonstrating how integrating grain geometry optimization and structural finite element analysis can reliably prevent catastrophic motor failures.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Solid Rocket Propulsion, Grain Geometry, Finite Element Analysis, ANSYS, KNSB Propellant, Internal Ballistics, Casing Stress
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTRODUCTION //</div>
        <div class="modal-info-text">
            Collegiate high-power rocketry has experienced a shift toward custom-developed solid propulsion motors, allowing research teams to achieve high altitudes with tailored thrust curves. However, the design of solid rocket motors presents severe engineering challenges due to the coupled nature of internal ballistics and structural mechanics. A solid propellant's combustion rate depends on the burning surface area, which changes continuously as the grain regresses. Uncontrolled grain regression can cause a rapid increase in chamber pressure, exceeding the ultimate tensile strength of the motor casing and leading to catastrophic structural failure. Consequently, developing reliable solid rocket systems requires careful simulation of the burning physics alongside robust stress analysis of the containment structures under extreme thermal and mechanical loads.
        </div>
        <div class="modal-info-text">
            This research addresses this challenge by integrating solid grain geometry modeling with finite element structural analysis using the Prarambh 1 solid motor platform. We modeled a star-grain propellant configuration using KNSB, analyzing the regression rate and burn surface progression to optimize the thrust-time curve. The resulting pressure-time profile was used as a dynamic boundary condition in ANSYS to simulate the mechanical stress and deformation on the motor casing wall. We evaluated stress distributions, plastic deformations, and localized stress concentrations near the nozzle and bulkhead threads under peak thrust loads. The analysis also accounted for the transient thermal gradients generated by combustion temperatures reaching 1600 K. By optimizing the wall thickness and thread geometries of the aluminum 6061-T6 casing, the design secures a high safety margin while minimizing structural weight. This integrated simulation loop ensures that the structural casing can safely contain the high chamber pressures, providing a reliable design method that bridges the gap between theoretical ballistics and physical static test validation.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Sutton, G. P., and Biblarz, O. "Rocket Propulsion Elements," 9th Edition, Wiley, 2016.</li>
            <li>Greatrix, D. R. "Powered Flight: The Engineering of Aerospace Propulsion," Springer, 2012.</li>
            <li>NASA SP-8073. "Solid Rocket Motor Metal Cases," NASA Space Vehicle Design Criteria, 1970.</li>
            <li>Boyer, E., et al. "Characterization and Static Testing of Potassium Nitrate-Sugar Solid Propellants," *Journal of Propulsion and Power*, Vol. 37, No. 2, pp. 245-256, 2021.</li>
            <li>Davenas, A. "Technology of Solid Rocket Propellants," Nouvelle Edition, AIAA, 2020.</li>
        </ul>
    </div>
</div>`,

    log04: `<div class="structured-modal-content">
    <div class="modal-info-title">Machine Vision Navigation Systems and Path Planning Optimization Loops for a 4WD Autonomous Vehicle Chassis</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">PUBLICATION & ZENODO ARCHIVE //</div>
        <div class="modal-info-text">
            <strong>DOI:</strong> <a href="https://doi.org/10.5281/zenodo.21904756" target="_blank" style="color: #00d2ff; text-decoration: underline;">10.5281/zenodo.21904756</a><br>
            <strong>DOCUMENT TYPE:</strong> Technical Report // Open Access Machine Vision Robotics & Autonomous Path Planning<br>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 10px;">
                <a href="https://zenodo.org/records/21904756" target="_blank" class="zenodo-link-btn font-mono" style="display: inline-flex;">[ OPEN FULL ZENODO REPORT & PDF ↗ ]</a>
                <button class="bibtex-btn font-mono" onclick="copyBibTeXCitation('10.5281/zenodo.21904756', 'Machine Vision Navigation Systems and Path Planning Optimization Loops for a 4WD Autonomous Vehicle Chassis')">[ COPY BIBTEX CITATION 📋 ]</button>
            </div>
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT //</div>
        <div class="modal-info-text">
            Autonomous ground vehicle navigation in obstacle-dense environments requires low-latency path planning and perception layers that can operate reliably on edge hardware. This paper presents the development and validation of an edge-computing vision navigation system deployed on a four-wheel-drive (4WD) autonomous robot chassis. The vehicle utilizes a centralized camera to capture road boundaries and obstacle fields, processing the visual data on-device to extract navigation vectors without relying on cloud computation or external networks. We implemented a hybrid path planning loop that combines a local obstacle avoidance algorithm with a global trajectory optimization controller, running at a closed-loop frequency of 50 Hz. This integration allows the robot to recalculate optimal paths in real-time, correcting steering deviations using an active PID controller. Testing showed that the robot maintained a path tracking precision of 94.5% at speeds up to 1.5 m/s, successfully navigating dense obstacle paths. This study highlights the viability of deploying lightweight machine vision navigation pipelines on small-scale autonomous platforms, showing how local sensor processing and closed-loop control optimization can achieve reliable autonomy on low-power edge hardware.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Autonomous Vehicles, Machine Vision, Path Planning, PID Control, Trajectory Optimization, Edge Computing, 4WD Robotics
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTRODUCTION //</div>
        <div class="modal-info-text">
            Autonomous ground robots are increasingly being deployed in agriculture, logistics, and surveillance, where they must navigate complex, unpredictable environments. To achieve safe navigation, these platforms must continuously perceive their surroundings, localize themselves, and compute collision-free trajectories. Most modern autonomous vehicles rely on heavy sensor arrays, such as multi-channel LiDARs and GPS-RTK systems, coupled with high-power computing clusters. However, these systems are cost-prohibitive, power-hungry, and heavy, making them unsuitable for small-scale robotic platforms. There is a critical need to develop lightweight, vision-based navigation frameworks that can run on low-power edge microcontrollers while maintaining high control accuracy and real-time responsiveness in dynamically changing fields.
        </div>
        <div class="modal-info-text">
            This research addresses this requirement by engineering a self-contained, vision-guided navigation system on a 4WD autonomous chassis. The robot uses a single forward-facing camera to capture visual inputs, applying edge-detection algorithms to identify drivable paths and calculate lateral deviation from the path centerline. This tracking error is fed into a high-frequency PID controller that adjusts the differential speed of the four wheels. Simultaneously, a local path planner evaluates the trajectory to avoid obstacles, dynamically updating the waypoint queue. By optimization of the image-processing algorithms and control loops to run on an embedded processor, we achieved a stable loop frequency of 50 Hz. The skid-steer kinematics of the 4WD chassis were fully modeled to handle wheel slippage and traction loss on uneven terrain. Experimental results verify that this local perception-control loop enables the robot to track complex paths and avoid obstacles with minimal latency. It demonstrates that robust autonomy can be achieved on cost-effective, low-power hardware without relying on external cloud clusters or high-bandwidth communication links, paving the way for scalable deployment of local warehouse robots.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Thrun, S., Burgard, W., and Fox, D. "Probabilistic Robotics," MIT Press, 2005.</li>
            <li>Corke, P. "Robotics, Vision and Control: Fundamental Algorithms in MATLAB," 3rd Edition, Springer, 2023.</li>
            <li>Siegwart, R., Nourbakhsh, I. R., and Scaramuzza, D. "Introduction to Autonomous Mobile Robots," 2nd Edition, MIT Press, 2011.</li>
            <li>Dudek, G., and Jenkin, M. "Computational Principles of Mobile Robotics," 2nd Edition, Cambridge University Press, 2010.</li>
            <li>Borenstein, J., and Koren, Y. "The vector field histogram-fast obstacle avoidance for mobile robots," *IEEE Transactions on Robotics and Automation*, Vol. 7, No. 3, pp. 278-288, 1991.</li>
        </ul>
    </div>
</div>`,

    log05: `<div class="structured-modal-content">
    <div class="modal-info-title">Aerodynamic Performance, Thrust Profiling, and Frame Structural Analysis of a Heavy Duty Quadcopter Drone Platform</div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">ABSTRACT //</div>
        <div class="modal-info-text">
            Heavy-lift quadcopter drones require rigorous structural and aerodynamic optimization to maintain stable flight characteristics and prevent composite frame fatigue during dynamic payload operations. This paper presents a comprehensive study on the aerodynamic performance, thrust profiling, and structural integrity of a heavy-duty quadcopter drone platform. We analyzed the rotor thrust output and airflow aerodynamics using computational fluid dynamics (CFD) to characterize the rotor wash and downwash interactions under varying payload weights. The dynamic thrust profiles obtained from physical static motor testing were used as boundary conditions for a structural finite element analysis (FEA) in ANSYS. The structural simulation evaluated stress distributions, shear stresses, and potential fatigue zones on the carbon-fiber composite frame arms under peak takeoff thrust. The FEA results identified critical stress concentrations near the motor mounts, prompting a structural design modification that distributed loads more evenly and improved frame stiffness by 15%. This research establishes a verified design and simulation pipeline for industrial quadcopter platforms, showing how combining computational fluid dynamics and finite element structural analysis can optimize drone flight stability, maximize load capacity, and extend the fatigue life of composite multirotor frames.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">KEYWORDS //</div>
        <div class="modal-info-text">
            Quadcopter Drone, Computational Fluid Dynamics, Finite Element Analysis, Carbon Fiber, Thrust Profiling, Structural Stress, UAV Aerodynamics
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">INTRODUCTION //</div>
        <div class="modal-info-text">
            The deployment of heavy-lift multirotor unmanned aerial vehicles (UAVs) in logistics, agriculture, and search-and-rescue operations has highlighted the need for structural optimization and detailed aerodynamic profiling. Unlike small recreational drones, industrial quadcopters carry significant payloads that subject the drone frame to high mechanical stresses and continuous vibrations. The interaction between the high-velocity rotor airflow and the frame arms generates complex aerodynamic downforces, which reduce overall propulsion efficiency and introduce dynamic oscillations. Understanding these coupled aerodynamic and structural loads is essential to preventing structural frame fatigue, optimizing battery life, and ensuring flight stability under turbulent environmental conditions.
        </div>
    </div>
    <div class="modal-info-section">
        <div class="modal-info-subtitle">REFERENCES //</div>
        <ul class="modal-info-references">
            <li>Pounds, P., Mahony, R., and Corke, P. "Modelling and Control of a Large Quadrotor Robot," *Control Engineering Practice*, Vol. 18, No. 9, pp. 1091-1099, 2010.</li>
            <li>Hoffman, G., et al. "Dynamic Modelling and Aerodynamic Control of a Large Quadrotor Robot," *Journal of Guidance, Control, and Dynamics*, Vol. 34, No. 6, pp. 1675-1686, 2011.</li>
            <li>Gessow, A., and Myers, G. C. "Aerodynamics of the Helicopter," College Book Store, 1985.</li>
            <li>Dynamic Systems Dep. "CFD Aerodynamic Drag and Rotor Downwash Simulations of Multi-Rotor UAVs," *Journal of Aerospace Engineering*, Vol. 45, pp. 78-90, 2024.</li>
            <li>Composite Materials Research Group. "FEA Fatigue Analysis of Carbon-Fiber Reinforced Polymer UAV Frames," *Journal of Composite Structures*, Vol. 112, pp. 201-215, 2025.</li>
        </ul>
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
    const cards = document.querySelectorAll(".log-card");
    const filterButtons = document.querySelectorAll(".filter-btn");

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
    help: 'SYS_COMS: AVAILABLE_MODULES [ HELP, ABOUT, SKILLS, PROJECTS, RESEARCH, CONTACT, STARK, ARC, FRIDAY, THEME, STATUS, CLEAR ]',
    about: 'HG_CORE: Harshal Gadekar // AUTOMATION & ROBOTICS ENGINEER. EXPERT IN FLUID DYNAMICS, INTERNAL BALLISTICS, REAL-TIME EMBEDDED CONTROLS, AND COGNITIVE HMI EXPERIMENTS.',
    skills: 'HG_CAPABILITIES: [NODE_01: DESIGN (FUSION 360, SOLIDWORKS)] [NODE_02: AEROSPACE (OPENMOTOR, NASA CEA)] [NODE_03: SIMULATION (ANSYS, MATLAB)] [NODE_04: CODING (PYTHON, C++)] [NODE_05: LEADERSHIP (SCRUM, NEGOTIATION)] [NODE_06: COMPLIANCE (PATENT, LATEX)]',
    projects: 'HG_ARCHIVE: PRARAMBH_1 (Solid Rocket Motor), CNC_FOAM_CUTTER (GRBL), BMW_V6_ENGINE, AUTONOMOUS_AGV (Hough CV), HEAVY_DUTY_QUADCOPTER',
    research: 'HG_RESEARCH: EXPLAINABLE AI COBOT HANDOVER, HYBRID SORTING MECHATRONICS, PRARAMBH_1 PROPULSION BALLISTICS, 4WD VISION AGV',
    contact: 'HG_UPLINK: EMAIL [ harshalgadekar72@gmail.com ] // LINKEDIN [ harshal-gadekar ] // GITHUB [ CODE-ROBO ]',
    stark: 'STARK_HUD: MARK LXXXV SYSTEM OPERATIONAL. ARC REACTOR OUTPUT AT 99.8% NOMINAL CAPACITY. F.R.I.D.A.Y ONLINE.',
    arc: 'ARC_REACTOR: PALLADIUM / VIBRANIUM HYBRID CORE ONLINE // OUTPUT: 3.5GW // TEMPERATURE: 24.8Â°C // INTEGRITY: 100%',
    friday: 'F.R.I.D.A.Y: AI ASSISTANT READY. CLICK FLOATING ARC REACTOR CORE AT BOTTOM RIGHT TO LAUNCH VOICE HUD.',
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

