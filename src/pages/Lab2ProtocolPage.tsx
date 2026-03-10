import React, { useEffect, useState } from 'react';
import { votingService } from '../services/VotingService';
import { applyHeuristics, runGeneticAlgorithm } from '../utils/algorithmLogic';
import { HEURISTICS } from '../data/heuristics';
import type { Phone } from '../types';
import styles from './Lab2ProtocolPage.module.css'; // Імпортуємо стилі

export const Lab2ProtocolPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [votes, phones, hVotes] = await Promise.all([
        votingService.getAllVotes(),
        votingService.getPhones(),
        votingService.getAllHeuristicVotes()
      ]);
      
      const { narrowedPhones, log, sortedHeuristics, hPopularity } = applyHeuristics(phones, votes, hVotes);
      const finalRanking = runGeneticAlgorithm(narrowedPhones, votes);
      
      setData({ narrowedPhones, log, sortedHeuristics, hPopularity, finalRanking, totalVotes: hVotes.length });
    };
    fetchData();
  }, []);

  if (!data) return <p className={styles.loading}>Агрегація даних та виконання Генетичного алгоритму...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Відкритий протокол (Етап 2)</h2>
        <p className={styles.textMuted}>Всього проголосувало експертів за евристики: <strong>{data.totalVotes}</strong></p>
        
        <h3 className={styles.sectionTitle}>1. Пріоритетність евристик</h3>
        <ul className={styles.list}>
          {data.sortedHeuristics.map((hId: string, i: number) => (
            <li key={hId} className={styles.listItem}>
              <span className={styles.itemRank}>#{i + 1}</span>
              <span>{HEURISTICS.find(h => h.id === hId)?.description}</span>
              <span className={styles.votesCount}>(Голосів: {data.hPopularity[hId]})</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>2. Обґрунтування звуження підмножини</h3>
        <div className={styles.logTerminal}>
          {data.log.length > 0 
            ? data.log.map((line: string, i: number) => <div key={i} className={styles.logLine}>&gt; {line}</div>) 
            : <div className={styles.logLine}>&gt; Підмножина вже була &le; 10 об'єктів. Відсіювання не застосовувалось.</div>
          }
        </div>
        <p className={styles.finalCount}>
          Об'єктів залишилось у фінальному ядрі: {data.narrowedPhones.length}
        </p>
      </div>

      <div className={`${styles.card} ${styles.cardSuccess}`}>
        <h3 className={styles.sectionTitleSuccess}>3. Фінальне ранжування (Еволюційний алгоритм)</h3>
        <p className={styles.textMuted}>Генетичний алгоритм оптимізував перестановку для мінімізації відстані Кемені між фінальним ядром та вибором експертів.</p>
        
        <div className={styles.rankingList}>
          {data.finalRanking.map((phone: Phone, index: number) => (
            <div key={phone.id} className={styles.rankingItem}>
              <div className={styles.rankingPosition}>#{index + 1}</div>
              <div className={styles.rankingName}>{phone.brand} {phone.model}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};