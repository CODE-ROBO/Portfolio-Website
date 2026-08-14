import React, { useState, useEffect, useRef } from 'react';

// Typewriter component for JARVIS messages
const TypewriterMessage = ({ text, isOpen, onComplete }: { text: string; isOpen: boolean; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText(text);
      if (onComplete) onComplete();
      return;
    }
    
    let i = 0;
    setDisplayedText('');
    const speed = 5; // ms per char
    
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        if (i % 3 === 0 && (window as any).JarvisSoundEngine) {
          (window as any).JarvisSoundEngine.playClick();
        }
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, isOpen, onComplete]);

  return <span>{displayedText}</span>;
};

export default function FridayAgent({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'jarvis'; text: string; isTyping?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Drag State
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const recognitionRef = useRef<any>(null);

  // Warmup TTS on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      // Invisible audio context wakeup
      const warmup = new SpeechSynthesisUtterance('');
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    const storedMuted = localStorage.getItem('jarvis-speech-muted');
    if (storedMuted) setIsMuted(storedMuted === 'true');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('jarvis-speech-muted', newMuted.toString());
    if (newMuted && window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const toggleListen = () => {
    if (isListening) recognitionRef.current?.stop();
    else recognitionRef.current?.start();
  };

  const speak = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const phoneticText = text.replace(/Gadekar/gi, 'Gaadekar');
    const utterance = new SpeechSynthesisUtterance(phoneticText);
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female') || v.name.includes('Zira'));
    if (targetVoice) utterance.voice = targetVoice;
    utterance.pitch = 1.1;
    utterance.rate = 1.15;
    window.speechSynthesis.speak(utterance);
  };

  const getAdvancedResponse = (q: string) => {
    const randomFallback = [
      "[ WARNING: UNRECOGNIZED_QUERY_SYNTAX ] - I apologize, sir. My neural net is currently restricted to Operator Harshal's engineering telemetry. Please specify if you wish to view his Hardware Projects, Skills, or Research.",
      "Query out of bounds. I am authorized to disclose data regarding Harshal's mechanical designs, automation protocols, and technical research. How may I redirect your search?",
      "I cannot parse that command. However, I can initialize the 3D matrix for his aerospace projects or summarize his core competencies. Which do you prefer?"
    ];

    if (q.includes('skill') || q.includes('tool') || q.includes('software') || q.includes('proficien')) {
      return "Accessing Operator Harshal's core competencies. I am detecting advanced proficiencies in deterministic automation systems, kinematics, and parametric CAD. Key software nodes include Fusion 360, SolidWorks, MATLAB, and Siemens PLC architecture.";
    } else if (q.includes('project') || q.includes('build') || q.includes('hardware') || q.includes('cad')) {
      return "Initializing hardware databanks. The physical portfolio includes the Prarambh 1 solid rocket motor (analyzed for 45G acceleration), a precision CNC foam cutter, and an autonomous machine vision vehicle. I highly recommend activating the 3D Schematics in the Dashboard.";
    } else if (q.includes('research') || q.includes('paper') || q.includes('publish')) {
      return "Cross-referencing academic nodes. His research spans Explainable AI for collaborative robotics, decentralized hybrid waste sorting algorithms, and autonomous drone aerodynamics. Please access the Research tab for full abstracts and technical readouts.";
    } else if (q.includes('contact') || q.includes('email') || q.includes('hire')) {
      return "Establishing secure uplink protocols. To initiate a formal transmission to Operator Harshal, please use the Contact node interface. Direct relay is also available at harshalgadekar72@gmail.com.";
    } else if (q.includes('about') || q.includes('who') || q.includes('harshal') || q.includes('operator')) {
      return "Operator Harshal Gadekar is a specialized automation and robotics engineer. His focus lies in hybrid control systems, deterministic real-time architectures, and high-fidelity aerospace propulsion simulations. He operates at the intersection of mechanical hardware and intelligent software.";
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('friday') || q.includes('jarvis')) {
      return "Hello, I am FRIDAY. How may I help you?";
    } else if (q.includes('eth') || q.includes('zurich') || q.includes('admission')) {
      return "Analyzing target: ETH Zurich. Operator Harshal's system architecture, research background, and autonomous vehicle telemetry have been explicitly engineered to align with ETH Zurich's Robotics, Systems and Control paradigm. He is a prime candidate for the November 2026 application cycle.";
    }
    
    return randomFallback[Math.floor(Math.random() * randomFallback.length)];
  };

  const handleSend = (textInput?: string) => {
    const text = textInput || input;
    if (!text.trim() || isProcessing) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsProcessing(true);

    // Simulated network processing latency
    setTimeout(() => {
      const q = text.toLowerCase();
      const response = getAdvancedResponse(q);

      setIsProcessing(false);
      setMessages(prev => [...prev, { sender: 'jarvis', text: response, isTyping: true }]);
      speak(response);
    }, 600);
  };

  const markTypingComplete = (idx: number) => {
    setMessages(prev => {
      const newMsgs = [...prev];
      if (newMsgs[idx]) {
        newMsgs[idx].isTyping = false;
      }
      return newMsgs;
    });
  };

  const closeChat = () => {
    setIsOpen(false);
    setMessages([]);
    setIsProcessing(false);
    setInput('');
    setIsOpen(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (isListening) recognitionRef.current?.stop();
  };

  const openChat = () => {
    if (!isOpen && messages.length === 0) {
      const greeting = "Hello, I am FRIDAY. How may I help you?";
      setMessages([{ sender: 'jarvis', text: greeting, isTyping: true }]);
      speak(greeting);
    }
    setIsOpen(true);
    if ((window as any).JarvisSoundEngine) {
      (window as any).JarvisSoundEngine.playSlide();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 360, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 480, e.clientY - dragOffset.y));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <>
      <div 
        className={`jarvis-core-wrapper ${isOpen ? 'hidden' : ''}`} 
        id="jarvis-trigger" 
        title="F.R.I.D.A.Y. AI Core Online"
        onClick={openChat}
      >
        <div className="jarvis-gaze-glow"></div>
        <div className="jarvis-ring ring-1"></div>
        <div className="jarvis-ring ring-2"></div>
        <div className="jarvis-ring ring-3"></div>
        <div className="jarvis-ring ring-4"></div>
        <div className="jarvis-core">
          <div className="jarvis-nucleus"></div>
        </div>
      </div>

      <div 
        className={`jarvis-chat-container font-mono ${isOpen ? 'active' : ''}`} 
        id="jarvis-chat"
        style={position ? { left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto', margin: 0, transition: isDragging ? 'none' : 'opacity 0.25s ease-out, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' } : {}}
      >
        <div 
          className="jarvis-chat-header"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="jarvis-status-header">
            <span className="jarvis-status-pulse-blue"></span>
            <span>F.R.I.D.A.Y.</span>
          </div>
          <div className="jarvis-chat-controls">
            <button className="jarvis-chat-btn" onClick={toggleMute} title="Toggle Voice Output (TTS)">
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button className="jarvis-chat-close" onClick={closeChat} title="Minimize">&times;</button>
          </div>
        </div>
        
        <div className="jarvis-chat-messages" id="jarvis-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`jarvis-msg ${msg.sender}-msg`}>
              {msg.sender === 'jarvis' && msg.isTyping ? (
                <TypewriterMessage text={msg.text} isOpen={isOpen} onComplete={() => markTypingComplete(idx)} />
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="jarvis-msg jarvis-msg text-yellow-500 animate-pulse text-[11px] border border-yellow-500/30">
              [ SCANNING_DATABANKS... ]
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="jarvis-quick-suggestions">
          <button className="suggestion-btn" onClick={() => handleSend('about')} disabled={isProcessing}>[ ABOUT ]</button>
          <button className="suggestion-btn" onClick={() => handleSend('skills')} disabled={isProcessing}>[ SKILLS ]</button>
          <button className="suggestion-btn" onClick={() => handleSend('projects')} disabled={isProcessing}>[ PROJECTS ]</button>
          <button className="suggestion-btn" onClick={() => handleSend('contact')} disabled={isProcessing}>[ CONTACT ]</button>
        </div>
        
        <div className="jarvis-chat-input-row">
          <button 
            className={`jarvis-mic-btn ${isListening ? 'listening' : ''}`} 
            onClick={toggleListen}
            title="Voice Input (STT)"
            disabled={isProcessing}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <input 
            type="text" 
            className="jarvis-chat-input" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query profile details..." 
            autoComplete="off" 
            disabled={isProcessing}
          />
          <button className="jarvis-chat-send" onClick={() => handleSend()} disabled={isProcessing}>[ SEND ]</button>
        </div>
      </div>
    </>
  );
}



