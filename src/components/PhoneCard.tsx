import React from 'react';
import type { Phone } from '../types/index';
import styles from './PhoneCard.module.css';

interface Props {
  phone: Phone;
  isSelected: boolean;
  priorityIndex: number;
  onClick: () => void;
}

export const PhoneCard: React.FC<Props> = ({ phone, isSelected, priorityIndex, onClick }) => (
  <div 
    onClick={onClick}
    className={`${styles.card} ${isSelected ? styles.selected : ''}`}
  >
    <img 
      src={phone.photo} 
      alt={`${phone.brand} ${phone.model}`} 
      className={styles.image}
    />
    <h4 className={styles.brand}>{phone.brand}</h4>
    <p className={styles.model}>{phone.model}</p>
    
    {isSelected && (
      <div className={styles.priority}>
        🏆 Пріоритет: {priorityIndex + 1}
      </div>
    )}
  </div>
);