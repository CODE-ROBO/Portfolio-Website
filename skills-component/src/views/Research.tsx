import React, { useState } from 'react';
import { researchLogs } from '../data/researchData';

export default function Research() {
  const [filter, setFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<typeof researchLogs[0] | null>(null);

  const filteredLogs = filter === 'all' ? researchLogs : researchLogs.filter(log => log.status === filter);

  return (
    <section id="research" className="spa-section active" style={{ display: 'flex', opacity: 1 }}>
      <div className="research-viewport w-full">
        <div className="console-filter-bar mb-6">
            <span className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALL_RECORDS //</span>
            <span className={`filter-btn ${filter === 'review' ? 'active' : ''}`} onClick={() => setFilter('review')}>UNDER_REVIEW //</span>
            <span className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>COMPLETED //</span>
            <span className={`filter-btn ${filter === 'prep' ? 'active' : ''}`} onClick={() => setFilter('prep')}>IN_PREPARATION //</span>
        </div>

        <div className="research-logs-container">
          {filteredLogs.map(log => (
            <div key={log.id} className="log-card" data-status={log.status}>
                <div className="log-meta">{log.meta}</div>
                <div className="log-title">{log.title}</div>
                <div className="log-tags">{log.tags}</div>
                <button className="open-data-btn" onClick={() => setSelectedLog(log)}>OPEN DATA</button>
            </div>
          ))}
        </div>

        <div className="live-diagnostics-panel mt-6">
            <span className="matrix-prefix">CORE_TELEMETRY //</span> 
            <span id="telemetry-stream">INTERFACE_ACTIVE_OK</span>
        </div>

        {selectedLog && (
          <div id="terminal-viewport-modal" className="terminal-modal active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="modal-frame" style={{ position: 'relative', width: '60%', transform: 'none', top: 0, left: 0 }}>
                  <div className="modal-header">
                      <span id="modal-node-id">CORE_NODE_READOUT // SEC_REF_REP_LOG</span>
                      <span className="modal-close" onClick={() => setSelectedLog(null)}>&times;</span>
                  </div>
                  <div className="modal-body text-left p-6 font-mono text-sm text-neutral-300 h-[60vh] overflow-y-auto bg-black border border-neutral-800" style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position', transform: 'translateZ(0)', overscrollBehavior: 'contain' }}>
                    <h2 className="text-yellow-500 mb-4 text-lg border-b border-neutral-800 pb-2">{selectedLog.title}</h2>
                    <h3 className="text-red-500 mb-2">ABSTRACT //</h3>
                    <p className="mb-4 leading-relaxed text-justify">{selectedLog.abstract}</p>
                    <div className="text-xs text-neutral-500 mt-8 border-t border-neutral-800 pt-4">
                      [END OF RECORD]
                    </div>
                  </div>
              </div>
          </div>
        )}
      </div>
    </section>
  );
}
