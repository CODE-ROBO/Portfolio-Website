import { NodeProps } from '../types';

/**
 * Calculates the average active application mastery percentage across all nodes
 */
export function calculateAverageMastery(nodes: NodeProps[]): number {
  if (nodes.length === 0) return 0;
  const total = nodes.reduce((sum, node) => {
    const percentage = parseInt(node.activeApplication.replace('%', ''), 10) || 0;
    return sum + percentage;
  }, 0);
  return Math.round(total / nodes.length);
}

/**
 * Aggregates total count of unique tools across all nodes
 */
export function calculateTotalTools(nodes: NodeProps[]): number {
  const allTools = new Set<string>();
  nodes.forEach(node => {
    node.tools.forEach(tool => allTools.add(tool.trim().toUpperCase()));
  });
  return allTools.size;
}
