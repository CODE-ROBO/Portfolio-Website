import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success'>('idle');
  const [copied, setCopied] = useState(false);

  const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const nameMap: any = {
      'sender-name': 'name',
      'sender-email': 'email',
      'msg-purpose': 'subject',
      'trans-body': 'message'
    };
    
    const field = nameMap[id];
    let truncatedValue = value;

    // Word limits
    const limits: any = { name: 10, email: 5, subject: 20, message: 100 };
    if (wordCount(value) > limits[field]) {
      const segments = value.split(/(\s+)/);
      let count = 0;
      truncatedValue = '';
      for (const segment of segments) {
        if (segment.trim() !== '') count++;
        if (count > limits[field]) break;
        truncatedValue += segment;
      }
    }

    setFormData(prev => ({ ...prev, [field]: truncatedValue }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { name: '', email: '', subject: '', message: '' };

    if (!formData.name) { newErrors.name = '* This field is required'; hasError = true; }
    if (!formData.email) { newErrors.email = '* This field is required'; hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = '* Enter a valid email address'; hasError = true; }
    if (!formData.subject) { newErrors.subject = '* This field is required'; hasError = true; }
    if (!formData.message) { newErrors.message = '* This field is required'; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setStatus('transmitting');

    // Simulate submission saving to localStorage
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    try {
      const contactsList = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
      contactsList.push({ timestamp, ...formData });
      localStorage.setItem('portfolio_contacts', JSON.stringify(contactsList));
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setStatus('success');
      const mailtoUrl = `mailto:harshalgadekar72@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent("Name: " + formData.name + "\nEmail: " + formData.email + "\n\nMessage:\n" + formData.message)}`;
      window.location.href = mailtoUrl;
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 1500);
    }, 50);
  };

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('harshalgadekar72@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="contact" className="spa-section active" style={{ display: 'flex', opacity: 1 }}>
      <div className="contact-viewport w-full">
        <div className="minimal-contact-container">
          <div className="form-corner tl"></div>
          <div className="form-corner tr"></div>
          <div className="form-corner bl"></div>
          <div className="form-corner br"></div>

          <h2 className="contact-title font-mono">LET US CONNECT</h2>
          
          <form className="minimal-transmission-form" id="uplink-form" noValidate onSubmit={handleSubmit}>
            <div className="input-block">
              <input className={`input-field ${errors.name ? 'shake-input' : ''}`} type="text" id="sender-name" placeholder="YOUR NAME" autoComplete="off" value={formData.name} onChange={handleChange} />
              <div className={`validation-message ${errors.name ? 'show' : ''}`} id="sender-name-error">{errors.name}</div>
            </div>

            <div className="input-block">
              <input className={`input-field ${errors.email ? 'shake-input' : ''}`} type="email" id="sender-email" placeholder="YOUR EMAIL" autoComplete="off" value={formData.email} onChange={handleChange} />
              <div className={`validation-message ${errors.email ? 'show' : ''}`} id="sender-email-error">{errors.email}</div>
            </div>

            <div className="input-block">
              <input className={`input-field ${errors.subject ? 'shake-input' : ''}`} type="text" id="msg-purpose" placeholder="SUBJECT" autoComplete="off" value={formData.subject} onChange={handleChange} />
              <div className={`validation-message ${errors.subject ? 'show' : ''}`} id="msg-purpose-error">{errors.subject}</div>
            </div>

            <div className="input-block" style={{ position: 'relative' }}>
              <textarea className={`input-field text-area-field ${errors.message ? 'shake-input' : ''}`} id="trans-body" placeholder="YOUR MESSAGE" rows={6} autoComplete="off" value={formData.message} onChange={handleChange}></textarea>
              <div className={`validation-message ${errors.message ? 'show' : ''}`} id="trans-body-error">{errors.message}</div>
              <div className="word-counter-label" id="trans-body-counter">
                [ WORDS: {String(wordCount(formData.message)).padStart(2, '0')} / 100 ]
              </div>
            </div>

            <button 
              className="uplink-btn" 
              type="submit" 
              disabled={status === 'transmitting'}
              style={{ color: status === 'success' ? '#10B981' : status === 'transmitting' ? 'var(--color-accent-crimson)' : '' }}
            >
              {status === 'idle' && '[ SEND ]'}
              {status === 'transmitting' && 'TRANSMITTING...'}
              {status === 'success' && 'SUCCESSFUL'}
            </button>
          </form>
        </div>

        <div className="contact-links-row">
          <a href="/assets/resume.pdf" download className="contact-external-link">
            <span className="contact-icon">📄</span>
            <span className="contact-link-text">RESUME</span>
          </a>
          <span className="contact-link-sep">|</span>
          <a href="https://www.linkedin.com/in/harshal-gadekar-714966306" target="_blank" rel="noopener noreferrer" className="contact-external-link">
            <span className="contact-icon">🌐</span>
            <span className="contact-link-text">LINKEDIN</span>
          </a>
          <span className="contact-link-sep">|</span>
          <a href="https://github.com/CODE-ROBO" target="_blank" rel="noopener noreferrer" className="contact-external-link">
            <span className="contact-icon">⚙️</span>
            <span className="contact-link-text">GITHUB</span>
          </a>
          <span className="contact-link-sep">|</span>
          <a href="mailto:harshalgadekar72@gmail.com" className="contact-external-link" id="contact-email-link" onClick={copyEmail}>
            <span className="contact-icon">✉️</span>
            <span className="contact-link-text">{copied ? 'COPIED!' : 'EMAIL'}</span>
          </a>
        </div>
        <div className={`copied-hud-notification font-mono ${copied ? 'show' : ''}`} id="copied-notification">[ ADDRESS COPIED TO CLIPBOARD ]</div>
      </div>
    </section>
  );
}
