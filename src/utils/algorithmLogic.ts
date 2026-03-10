import type { Phone, Vote, HeuristicVote } from '../types';
import { HEURISTICS } from '../data/heuristics';

export const getPhoneStats = (phones: Phone[], votes: Vote[]) => {
  const stats: Record<string, { p1: number, p2: number, p3: number, total: number }> = {};
  phones.forEach(p => stats[p.id] = { p1: 0, p2: 0, p3: 0, total: 0 });

  votes.forEach(vote => {
    if (vote.prioritizedPhoneIds[0] && stats[vote.prioritizedPhoneIds[0]]) { stats[vote.prioritizedPhoneIds[0]].p1++; stats[vote.prioritizedPhoneIds[0]].total++; }
    if (vote.prioritizedPhoneIds[1] && stats[vote.prioritizedPhoneIds[1]]) { stats[vote.prioritizedPhoneIds[1]].p2++; stats[vote.prioritizedPhoneIds[1]].total++; }
    if (vote.prioritizedPhoneIds[2] && stats[vote.prioritizedPhoneIds[2]]) { stats[vote.prioritizedPhoneIds[2]].p3++; stats[vote.prioritizedPhoneIds[2]].total++; }
  });
  return stats;
};

const shouldRemoveByHeuristic = (heuristicId: string, stat: { p1: number, p2: number, p3: number, total: number }) => {
  switch (heuristicId) {
    case 'h1': return stat.total === 1 && stat.p3 === 1;
    case 'h2': return stat.total === 1 && stat.p2 === 1;
    case 'h3': return stat.total === 1 && stat.p1 === 1;
    case 'h4': return stat.total === 2 && stat.p3 === 2;
    case 'h5': return stat.total === 2 && stat.p3 === 1 && stat.p2 === 1;
    case 'h6': return stat.total > 0 && stat.p1 === 0;
    case 'h7': return stat.total > 0 && stat.total < 2;
    default: return false;
  }
};

export const applyHeuristics = (phones: Phone[], votes: Vote[], hVotes: HeuristicVote[]) => {
  const hPopularity: Record<string, number> = {};
  HEURISTICS.forEach(h => hPopularity[h.id] = 0);
  hVotes.forEach(v => v.heuristicIds.forEach(id => { if (hPopularity[id] !== undefined) hPopularity[id]++; }));

  const sortedHeuristics = Object.entries(hPopularity)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  let currentSet = phones.filter(p => getPhoneStats(phones, votes)[p.id].total > 0);
  const stats = getPhoneStats(phones, votes);
  const log: string[] = [];

  for (const hId of sortedHeuristics) {
    if (currentSet.length <= 10) break;
    
    const hDesc = HEURISTICS.find(h => h.id === hId)?.description;
    const toRemove = currentSet.filter(p => shouldRemoveByHeuristic(hId, stats[p.id]));
    
    if (toRemove.length > 0) {
      log.push(`Застосовано [${hDesc}]. Видалено: ${toRemove.map(p => p.model).join(', ')}`);
      currentSet = currentSet.filter(p => !toRemove.find(r => r.id === p.id));
    }
  }

  if (currentSet.length > 10) {
     currentSet = currentSet.sort((a, b) => stats[b.id].total - stats[a.id].total).slice(0, 10);
     log.push(`Залишилося більше 10 об'єктів. Примусово залишено топ-10 за загальною кількістю згадувань.`);
  }

  return { narrowedPhones: currentSet, log, sortedHeuristics, hPopularity };
};

const calculateFitness = (chromosome: Phone[], votes: Vote[]): number => {
  let totalDistance = 0;
  votes.forEach(vote => {
    for (let i = 0; i < chromosome.length; i++) {
      for (let j = i + 1; j < chromosome.length; j++) {
        const p1 = chromosome[i].id;
        const p2 = chromosome[j].id;
        const pos1 = vote.prioritizedPhoneIds.indexOf(p1);
        const pos2 = vote.prioritizedPhoneIds.indexOf(p2);
        
        if (pos1 !== -1 && pos2 !== -1 && pos2 < pos1) totalDistance++;
        else if (pos1 === -1 && pos2 !== -1) totalDistance++;
      }
    }
  });
  return totalDistance;
};

export const runGeneticAlgorithm = (phones: Phone[], votes: Vote[]) => {
  if (phones.length === 0) return [];
  const POPULATION_SIZE = 50;
  const GENERATIONS = 100;
  
  let population: Phone[][] = Array.from({ length: POPULATION_SIZE }, () => 
    [...phones].sort(() => Math.random() - 0.5)
  );

  for (let gen = 0; gen < GENERATIONS; gen++) {
    const scoredPopulation = population.map(chromosome => ({
      chromosome,
      fitness: calculateFitness(chromosome, votes)
    })).sort((a, b) => a.fitness - b.fitness);

    const newPopulation = [scoredPopulation[0].chromosome, scoredPopulation[1].chromosome];

    while (newPopulation.length < POPULATION_SIZE) {
      const parent1 = scoredPopulation[Math.floor(Math.random() * 10)].chromosome;
      let child = [...parent1];

      if (Math.random() < 0.3) {
        const idx1 = Math.floor(Math.random() * child.length);
        const idx2 = Math.floor(Math.random() * child.length);
        [child[idx1], child[idx2]] = [child[idx2], child[idx1]];
      }
      newPopulation.push(child);
    }
    population = newPopulation;
  }

  const bestResult = population.map(chromosome => ({
    chromosome, fitness: calculateFitness(chromosome, votes)
  })).sort((a, b) => a.fitness - b.fitness)[0];

  return bestResult.chromosome;
};