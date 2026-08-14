export interface VisualizationNode {
  title: string;
  milestones: string[];
}

export interface NodeProps {
  id: string;
  title: string;
  skills: string[];
  tools: string[];
  activeApplication: string; // The "Capacity" metric (e.g. "95%")
  visualization?: VisualizationNode;
  modelPath?: string;
}

export interface HardwareProject {
  id: string;
  designation: string;
  status: string;
  modelPath: string;
  specs: Record<string, string>;
  description: string;
}
