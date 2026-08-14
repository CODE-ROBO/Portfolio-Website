import { useEffect, useState } from 'react';
import { NodeProps } from '../types';
import { skillService } from '../services/skillService';
import { calculateAverageMastery, calculateTotalTools } from '../utils/calculations';

export function useSkillMetrics() {
  const [nodes, setNodes] = useState<NodeProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    skillService.fetchSkills()
      .then(data => {
        if (active) {
          setNodes(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Failed to retrieve capability matrix.');
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const averageMastery = calculateAverageMastery(nodes);
  const totalToolsCount = calculateTotalTools(nodes);

  return {
    nodes,
    loading,
    error,
    averageMastery,
    totalToolsCount
  };
}
