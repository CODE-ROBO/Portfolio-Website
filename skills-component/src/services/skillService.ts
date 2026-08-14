import { NodeProps } from '../types';
import data from '../data.json';

export interface SkillService {
  fetchSkills(): Promise<NodeProps[]>;
}

export const skillService: SkillService = {
  fetchSkills: async () => {
    // Simulate API fetch delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data.skills);
      }, 300);
    });
  }
};
