import React from 'react';
import { NodeProps } from './types';
import { logEvent } from './utils/telemetry';

const SkillNode: React.FC<NodeProps> = ({ title, skills, tools, activeApplication, visualization }) => {
  return (
    <article 
      className="border border-neutral-800 p-6 hover:border-red-600 transition-colors duration-300 bg-neutral-900/30 rounded-sm h-full flex flex-col"
      aria-labelledby={`skill-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      onMouseEnter={() => logEvent('NODE_HOVER', { node: title })}
    >
      <h3 id={`skill-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-yellow-500 text-xs mb-4 uppercase font-mono tracking-wider">
        {title}
      </h3>

      {visualization && (
        <div className="mb-4 p-4 bg-neutral-950 border border-neutral-800 rounded">
          <div className="text-[10px] text-red-500 font-mono mb-2 uppercase tracking-widest">{visualization.title}</div>
          <ul className="space-y-1">
            {visualization.milestones.map((m, i) => (
              <li key={i} className={`text-xs ${m.includes('Completed') ? 'text-emerald-500' : 'text-neutral-500'}`}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="text-neutral-400 text-sm space-y-2 mb-6 flex-grow" aria-label={`Skills for ${title}`}>
        {skills.map((skill, idx) => <li key={idx}>• {skill}</li>)}
      </ul>
      <div className="text-neutral-500 text-[10px] mb-2 font-mono" aria-label={`Tools used: ${tools.join(', ')}`}>
        {tools.join(' // ')}
      </div>
      <div 
        className="h-1 bg-neutral-900" 
        role="progressbar" 
        aria-label={`${title} Active Application Capacity`} 
        aria-valuenow={parseInt(activeApplication)} 
        aria-valuemin={0} 
        aria-valuemax={100}
      >
        <div className="h-full bg-red-600 transition-all duration-500" style={{ width: activeApplication }}></div>
      </div>
    </article>
  );
};

export default SkillNode;
