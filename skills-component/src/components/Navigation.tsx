import React from 'react';

type Tab = 'home' | 'skills' | 'projects' | 'research' | 'contact';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: Tab) => {
    e.preventDefault();
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  return (
    <header className="global-header">
      <div className="nav-container">
        <a 
          href="#home" 
          className="logo-brand-container nav-link-logo" 
          onClick={(e) => handleNavClick(e, 'home')}
          style={{ textDecoration: 'none' }}
        >
          
          <div className="logo-brand">Harshal Gadekar</div>
        </a>
        <nav className="nav-links">
          <a href="#home" className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <span className="nav-link-sep">|</span>
          <a href="#skills" className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'skills')}>Skills</a>
          <span className="nav-link-sep">|</span>
          <a href="#projects" className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'projects')}>Projects</a>
          <span className="nav-link-sep">|</span>
          <a href="#research" className={`nav-link ${activeTab === 'research' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'research')}>Research</a>
          <span className="nav-link-sep">|</span>
          <a href="#contact" className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
