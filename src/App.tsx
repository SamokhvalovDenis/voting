import React, { useState } from 'react';
import { VotingPage } from './pages/VotingPage';
import { ProtocolPage } from './pages/ProtocolPage';
import { HeuristicVotingPage } from './pages/HeuristicVotingPage'; 
import { Lab2ProtocolPage } from './pages/Lab2ProtocolPage'; 
import { LoginPage } from './components/LoginPage';
import type { Expert } from './types/index';
import styles from './App.module.css';

type ViewState = 'voting1' | 'protocol1' | 'voting2' | 'protocol2';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('voting1');
  const [currentUser, setCurrentUser] = useState<Expert | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
    setView('voting1');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>ІОД РІС - Лабораторні</h1>
        
        <div className={styles.nav}>
          <button onClick={() => setView('voting1')} className={`${styles.btn} ${view === 'voting1' ? styles.activeBtn : ''}`}>Лаб 1: Вибір</button>
          <button onClick={() => setView('protocol1')} className={`${styles.btn} ${view === 'protocol1' ? styles.activeBtn : ''}`}>Лаб 1: Протокол</button>
          
          <button onClick={() => setView('voting2')} className={`${styles.btn} ${view === 'voting2' ? styles.activeBtn : ''}`}>Лаб 2: Евристики</button>
          <button onClick={() => setView('protocol2')} className={`${styles.btn} ${view === 'protocol2' ? styles.activeBtn : ''}`}>Лаб 2: Протокол + ГА</button>
          
          {currentUser && (
            <button onClick={handleLogout} className={styles.btnLogout}>Вийти ({currentUser.name})</button>
          )}
        </div>
      </header>

      {(view === 'voting1' || view === 'voting2') && !currentUser ? (
        <LoginPage onLogin={setCurrentUser} />
      ) : view === 'voting1' && currentUser ? (
        <VotingPage currentUser={currentUser} />
      ) : view === 'protocol1' ? (
        <ProtocolPage />
      ) : view === 'voting2' && currentUser ? (
        <HeuristicVotingPage currentUser={currentUser} />
      ) : view === 'protocol2' ? (
        <Lab2ProtocolPage />
      ) : null}
    </div>
  );
};

export default App;