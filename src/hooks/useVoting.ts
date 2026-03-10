import { useState } from 'react';
import type { Phone } from '../types/index';

export const useVoting = () => {
  const [selectedPhones, setSelectedPhones] = useState<Phone[]>([]);

  const togglePhoneSelection = (phone: Phone) => {
    const isSelected = selectedPhones.find(p => p.id === phone.id);
    if (isSelected) {
      setSelectedPhones(selectedPhones.filter(p => p.id !== phone.id));
    } else {
      if (selectedPhones.length < 3) {
        setSelectedPhones([...selectedPhones, phone]);
      } else {
        alert('Максимум 3 об\'єкти!');
      }
    }
  };

  const clearSelection = () => setSelectedPhones([]);

  return { selectedPhones, togglePhoneSelection, clearSelection };
};