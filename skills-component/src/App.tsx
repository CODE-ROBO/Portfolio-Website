import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HexBackground from './components/HexBackground';
import FridayAgent from './components/FridayAgent';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Research from './views/Research';
import Contact from './views/Contact';

type Tab = 'home' | 'skills' | 'projects' | 'research' | 'contact';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  useEffect(() => {
    // Handle initial hash routing
    const hash = window.location.hash.replace('#', '') as Tab;
    if (['home', 'skills', 'projects', 'research', 'contact'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  return (
    <>
      <HexBackground />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="viewport-container" style={{ position: 'relative', zIndex: 10, paddingTop: '80px', height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
        {activeTab === 'home' && <Home />}
        {(activeTab === 'skills' || activeTab === 'projects') && <Dashboard activeTab={activeTab} />}
        {activeTab === 'research' && <Research />}
        {activeTab === 'contact' && <Contact />}
      </main>

      <FridayAgent setActiveTab={setActiveTab} />
    </>
  );
}

