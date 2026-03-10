import React, { useState, useEffect } from 'react';
import { votingService } from '../services/VotingService';
import type { Expert } from '../types/index';
import styles from './LoginPage.module.css';

interface Props {
  onLogin: (expert: Expert) => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsSeeding, setNeedsSeeding] = useState(false);

  useEffect(() => {
    votingService.getPhones().then(phones => {
      if (phones.length === 0) setNeedsSeeding(true);
    });
  }, []);

  const handleSeed = async () => {
    await votingService.seedDatabase();
    alert('Базу створено! Тепер можна входити.');
    setNeedsSeeding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const expert = await votingService.loginOrRegisterExpert(name);
      onLogin(expert);
    } catch (error) {
      alert('Помилка входу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Вхід експерта</h2>
      <p className={styles.desc}>Введіть своє ім'я для початку голосування.</p>
      
      {needsSeeding && (
        <button onClick={handleSeed} className={styles.btnSeed}>
          ⚠️ Спочатку згенеруй БД (Натисни 1 раз)
        </button>
      )}

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Наприклад: Іван Франко"
          className={styles.input}
          disabled={isLoading || needsSeeding}
        />
        <button type="submit" className={styles.btnSubmit} disabled={isLoading || !name.trim() || needsSeeding}>
          {isLoading ? 'Завантаження...' : 'Увійти'}
        </button>
      </form>
    </div>
  );
};