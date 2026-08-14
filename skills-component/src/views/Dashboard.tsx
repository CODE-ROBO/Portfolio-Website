import React, { lazy, Suspense } from 'react';
import { useSkillMetrics } from '../hooks/useSkillMetrics';
import ErrorBoundary from '../ErrorBoundary';
import { SystemTimeline } from '../SystemTimeline';
import ProjectCard from '../ProjectCard';
import data from '../data.json';

const SkillNode = lazy(() => import('../SkillNode'));

export default function Dashboard({ activeTab = 'skills' }: { activeTab?: string }) {
  const { nodes, loading, error } = useSkillMetrics();
  const hardware = data.hardwareProjects || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 font-mono text-white" aria-busy="true" aria-live="polite">
        <div className="text-yellow-500 tracking-widest animate-pulse">[ RETRIEVING_CAPABILITIES_DATA... ]</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 font-mono text-white">
        <div className="text-red-600 tracking-widest" role="alert">[ ERROR: {error} ]</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 h-[calc(100vh-120px)] overflow-hidden">
      
      {/* Left Column: Skill Matrices (Spans 4 columns) */}
      <section className={`lg:col-span-4 flex-col ${activeTab === 'skills' ? 'flex' : 'hidden lg:flex'} gap-6 h-full overflow-y-auto pb-10 pr-2`} aria-labelledby="core-competencies">
        <div className="text-yellow-500 text-xs tracking-widest border-l-2 border-yellow-500 pl-2 mb-2" id="core-competencies">
          CORE_COMPETENCIES
        </div>
        <Suspense fallback={<div className="text-neutral-500 font-mono text-sm animate-pulse w-full py-4">[ MODULES_INITIALIZING... ]</div>}>
          <div className="flex flex-col gap-6">
            {nodes.map(node => (
              <ErrorBoundary key={node.id}>
                <SkillNode {...node} />
              </ErrorBoundary>
            ))}
          </div>
        </Suspense>
      </section>

      {/* Right Column: Hardware Integrations (Spans 8 columns) */}
      <section className={`lg:col-span-8 flex-col ${activeTab === 'projects' ? 'flex' : 'hidden lg:flex'} gap-6 h-full overflow-y-auto pb-10 pr-2`} aria-labelledby="hardware-telemetry">
        <div className="text-red-500 text-xs tracking-widest border-l-2 border-red-500 pl-2 mb-2" id="hardware-telemetry">
          HARDWARE_TELEMETRY & ASSETS
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {hardware.map(project => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        <SystemTimeline />
      </section>

    </div>
  );
}

