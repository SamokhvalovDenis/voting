import React, { useState } from 'react';
import { HEURISTICS } from '../data/heuristics';
import { votingService } from '../services/VotingService';
import type { Expert } from '../types';
import styles from './HeuristicVotingPage.module.css'; // Імпортуємо стилі

interface Props { currentUser: Expert; }

export const HeuristicVotingPage: React.FC<Props> = ({ currentUser }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      if (selected.length < 3) setSelected([...selected, id]);
      else alert('Можна вибрати максимум 3 евристики');
    }
  };

  const handleSubmit = async () => {
    if (selected.length < 2) return alert('Виберіть хоча б 2 евристики');
    setIsLoading(true);
    try {
      await votingService.submitHeuristicVote({
        expertId: currentUser.id,
        heuristicIds: selected,
        timestamp: Date.now()
      });
      alert('Ваш вибір успішно збережено!');
      setSelected([]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Етап 2. Вибір евристик</h2>
      <p className={styles.subtitle}>
        Експерт: <strong>{currentUser.name}</strong>. Виберіть 2-3 правила для звуження підмножини об'єктів. Це опитування є відкритим.
      </p>

      <div className={styles.list}>
        {HEURISTICS.map(h => (
          <div 
            key={h.id} 
            onClick={() => toggleSelection(h.id)}
            className={`${styles.heuristicItem} ${selected.includes(h.id) ? styles.heuristicItemSelected : ''}`}
          >
            {h.description}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isLoading || selected.length < 2} 
        className={styles.btnSubmit}
      >
        {isLoading ? 'Збереження...' : 'Відправити свій вибір'}
      </button>
    </div>
  );
};