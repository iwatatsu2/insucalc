import { useState, useEffect } from 'react';
import type { HistoryEntry } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('insulin_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('insulin_history', JSON.stringify(history));
  }, [history]);

  const addEntry = (entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setHistory(prev => [newEntry, ...prev].slice(0, 100));
  };

  const clearHistory = () => setHistory([]);

  return { history, addEntry, clearHistory };
}
