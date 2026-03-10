import React, { useState, useEffect } from 'react';
import { useVoting } from '../hooks/useVoting';
import { PhoneCard } from '../components/PhoneCard';
import { votingService } from '../services/VotingService';
import type { Phone, Expert } from '../types/index';
import styles from './VotingPage.module.css';

interface Props {
  currentUser: Expert;
}

export const VotingPage: React.FC<Props> = ({ currentUser }) => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { selectedPhones, togglePhoneSelection, clearSelection } = useVoting();

  useEffect(() => {
    const loadData = async () => {
      const fetchedPhones = await votingService.getPhones();
      setPhones(fetchedPhones);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleVoteSubmit = async () => {
    if (selectedPhones.length !== 3) return alert('Оберіть 3 телефони!');
    setIsLoading(true);
    try {
      await votingService.submitVote({
        expertId: currentUser.id,
        prioritizedPhoneIds: selectedPhones.map(p => p.id),
        timestamp: Date.now()
      });
      alert('Ваш голос успішно збережено у Firebase!');
      clearSelection();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Завантаження об'єктів...</div>;

  return (
    <div>
      <h2 className={styles.title}>Вітаємо, {currentUser.name}!</h2>
      <p className={styles.desc}>Оберіть рівно 3 моделі телефонів у порядку їхньої пріоритетності для вас.</p>

      <div className={styles.grid}>
        {phones.map(phone => {
          const selectedIndex = selectedPhones.findIndex(p => p.id === phone.id);
          return (
            <PhoneCard 
              key={phone.id} phone={phone}
              isSelected={selectedIndex !== -1} priorityIndex={selectedIndex}
              onClick={() => togglePhoneSelection(phone)}
            />
          );
        })}
      </div>

      <button 
        onClick={handleVoteSubmit} 
        disabled={selectedPhones.length !== 3}
        className={styles.btnSubmit}
      >
        Відправити бюлетень
      </button>
    </div>
  );
};