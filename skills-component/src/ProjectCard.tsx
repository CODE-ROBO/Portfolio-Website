import React from 'react';
import { ModelViewer } from './ModelViewer';

interface HardwareProps {
  id?: string;
  designation: string;
  status: string;
  modelPath: string;
  specs: Record<string, string>;
  description: string;
}

export default function ProjectCard({ designation, status, modelPath, specs, description }: HardwareProps) {
  // Determine status color based on phase
  const statusColor = status === 'VALIDATED' ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className="border border-neutral-800 bg-neutral-900/40 p-1 flex flex-col h-full">
      {/* Header telemetry */}
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
        <h3 className="text-white font-bold text-sm tracking-widest">{designation}</h3>
        <span className={`${statusColor} text-[10px] font-mono tracking-widest border border-current px-2 py-1`}>
          [{status}]
        </span>
      </div>
      
      {/* 3D Hardware Canvas */}
      <div className="relative border-b border-neutral-800">
        <ModelViewer modelPath={modelPath} />
      </div>
      
      {/* System Specifications Grid */}
      <div className="p-4 bg-neutral-950 flex-grow">
        <p className="text-neutral-400 text-xs mb-4 leading-relaxed border-l-2 border-neutral-700 pl-3">
          {description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {specs && Object.entries(specs).map(([key, value]) => (
            <div key={key} className="bg-neutral-900 p-2 border border-neutral-800">
              <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">{key.replace('_', ' ')}</div>
              <div className="text-xs text-white font-mono">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
