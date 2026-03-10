import React, { useEffect, useState } from 'react';
import { votingService } from '../services/VotingService';
import type { Vote, Phone, Expert } from '../types/index';
import styles from './ProtocolPage.module.css';

export const ProtocolPage: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [data, setData] = useState<{ votes: Vote[], phones: Phone[], experts: Expert[] } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const truePassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (passwordInput === truePassword) {
      setIsAuthorized(true);
    } else {
      alert('Невірний пароль!');
      setPasswordInput('');
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    const fetchData = async () => {
      const [votes, phones, experts] = await Promise.all([
        votingService.getAllVotes(), votingService.getPhones(), votingService.getExperts()
      ]);
      setData({ votes, phones, experts });
    };
    fetchData();
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className={styles.authWrapper}>
        <h2 className={styles.title}>Доступ до протоколу</h2>
        <p className={styles.desc}>Ця сторінка призначена лише для викладача.</p>
        <form onSubmit={handleLogin}>
          <input 
            type="password" value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)} 
            placeholder="Введіть пароль" className={styles.input}
          />
          <button type="submit" disabled={!passwordInput.trim()} className={styles.btnSubmit}>
            Відкрити протокол
          </button>
        </form>
      </div>
    );
  }

  if (!data) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження...</p>;

  const getPhoneName = (id: string) => data.phones.find(p => p.id === id)?.brand + ' ' + (data.phones.find(p => p.id === id)?.model || '') || 'Невідомо';
  const getExpertName = (id: string) => data.experts.find(e => e.id === id)?.name || 'Анонім';

  return (
    <div>
      <div className={styles.headerRow}>
        <h2 style={{ margin: 0 }}>Протокол результатів голосування</h2>
        <button onClick={() => { setIsAuthorized(false); setPasswordInput(''); setData(null); }} className={styles.btnClose}>
          Закрити протокол
        </button>
      </div>
      
      <p className={styles.stats}>Всього отримано бюлетенів: <strong style={{ color: 'var(--text-main)' }}>{data.votes.length}</strong></p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Експерт</th>
              <th className={styles.th}>1 Пріоритет 🏆</th>
              <th className={styles.th}>2 Пріоритет</th>
              <th className={styles.th}>3 Пріоритет</th>
              <th className={styles.th}>Час голосування</th>
            </tr>
          </thead>
          <tbody>
            {data.votes.map((vote, i) => (
              <tr key={i} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdExpert}`}>{getExpertName(vote.expertId)}</td>
                <td className={`${styles.td} ${styles.tdPriority1}`}>{getPhoneName(vote.prioritizedPhoneIds[0])}</td>
                <td className={styles.td}>{getPhoneName(vote.prioritizedPhoneIds[1])}</td>
                <td className={styles.td}>{getPhoneName(vote.prioritizedPhoneIds[2])}</td>
                <td className={`${styles.td} ${styles.tdDate}`}>{new Date(vote.timestamp).toLocaleString('uk-UA')}</td>
              </tr>
            ))}
            {data.votes.length === 0 && (
              <tr><td colSpan={5} className={styles.emptyRow}>Жоден експерт ще не проголосував.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};