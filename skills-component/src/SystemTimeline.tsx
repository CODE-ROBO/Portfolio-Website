import React from 'react';
import data from './data.json';

export const SystemTimeline: React.FC = () => {
  const milestones = data.timelineMilestones || [];
  return (
    <section className="mt-12 border-t border-neutral-800 pt-8" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="text-white text-2xl mb-6 tracking-widest font-mono">SYSTEM TIMELINE</h2>
      <div className="flex flex-col space-y-4">
        {milestones.map((m) => (
          <div key={m.id} className="grid grid-cols-4 gap-4 items-center bg-neutral-900/40 border border-neutral-800 p-4 rounded-sm hover:border-neutral-600 transition-colors">
            <div className="col-span-1 text-xs text-yellow-500 font-mono tracking-wider">{m.phase}</div>
            <div className="col-span-2 text-sm text-neutral-300 font-mono">
              {m.description.includes('TDRSR') ? (
                <a href="https://github.com/TDRSR" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-neutral-700 underline-offset-4" aria-label={`External link to ${m.description}`}>
                  {m.description}
                </a>
              ) : (
                m.description
              )}
            </div>
            <div className="col-span-1 text-right">
              <span className={`text-[10px] font-mono px-2 py-1 rounded ${m.status === 'Completed' || m.status === 'Verified' ? 'bg-emerald-900/30 text-emerald-500' : 'bg-yellow-900/30 text-yellow-500'}`}>
                [{m.status.toUpperCase()}]
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
