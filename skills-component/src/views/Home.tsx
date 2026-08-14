import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [history, setHistory] = useState([
    "> CORE INITIALIZED. CONNECTION ONLINE.",
    "> TYPE 'HELP' FOR AVAILABLE SYSTEMS COMMANDS."
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toUpperCase();
    if (!cleanCmd) return;
    
    setHistory(prev => [...prev, `HG:\\> ${cmd}`]);
    
    setTimeout(() => {
      let response = "";
      switch (cleanCmd) {
        case 'HELP':
          response = "> COMMANDS: ABOUT, CLEAR, SKILLS, CONTACT, STATUS";
          break;
        case 'ABOUT':
          response = "> OPERATOR: Harshal Gadekar | ROLE: AUTOMATION & ROBOTICS ENGINEER | SPECIALTY: MECHATRONICS, HYBRID CONTROL, PROPULSION SIMULATIONS.";
          break;
        case 'SKILLS':
          response = "> SKILLS: FUSION 360, SOLIDWORKS, MATLAB, ANSYS, ROS2, C++, PYTHON. VIEW 'SKILLS' NODE FOR FULL DIAGNOSTICS.";
          break;
        case 'CONTACT':
          response = "> COMMS UPLINK: harshalgadekar72@gmail.com";
          break;
        case 'STATUS':
          response = "> SYSTEM OPERATIONAL. 0 CRITICAL FAULTS. 6/6 NODES ONLINE.";
          break;
        case 'CLEAR':
          setHistory(["> TERMINAL CLEARED."]);
          return;
        default:
          response = `> ERROR: COMMAND '${cleanCmd}' NOT RECOGNIZED. TYPE 'HELP'.`;
      }
      setHistory(prev => [...prev, response]);
    }, 50);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  return (
    <section id="home" className="spa-section active home-section" style={{ display: 'flex', opacity: 1, zIndex: 10 }}>
      <div className="home-viewport-new">
        {/* Left Column: Circular Profile Picture */}
        <div className="home-avatar-container">
          <img className="home-avatar-img keep-circle" src="/profile_avatar.png" alt="Harshal Gadekar" />
        </div>

        {/* Right Column: Structured Info Panel */}
        <div className="home-info-panel-new">
          <h1 className="home-name-title">Harshal Gadekar</h1>
          <div className="home-intro-subtitle font-mono">AUTOMATION & ROBOTICS ENGINEER</div>
          <p className="home-bio-text">
            I am a mechatronics and robotics engineer specializing in hybrid control systems, deterministic real-time architectures, and high-fidelity aerospace propulsion simulations. With a strong foundation in bridging physical hardware with numerical analysis, I design and construct solid rocket motor ballistics platforms and deploy vision-guided autonomous navigation pipelines. My expertise extends to programmable logic controllers (PLCs), multi-modal sensor fusion network design, and non-linear finite element structural stress modeling. I am highly focused on combining academic research rigor with compliance landscapes, patent search strategies, and operational agile governance to build next-generation autonomous mechatronic systems.
          </p>
          
          {/* Interactive Terminal Prompt */}
          <div className="hud-terminal-console">
            <div className="terminal-bar">
              <div className="terminal-title">A.E.G.I.S.</div>
            </div>
            <div className="terminal-history" id="terminal-history" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {history.map((line, idx) => (
                <div key={idx} className="term-line system">{line}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <div className="terminal-prompt-line flex">
              <span className="prompt-prefix">HG:\&gt;</span>
              <input 
                type="text" 
                className="terminal-input flex-1 bg-transparent border-none outline-none text-white ml-2" 
                autoComplete="off" 
                placeholder="HELP" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCommand(input);
                    setInput('');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
