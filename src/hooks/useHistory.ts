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

  const updateEntry = (id: string, updates: Partial<HistoryEntry>) => {
    setHistory(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = () => setHistory([]);

  return { history, addEntry, updateEntry, deleteEntry, clearHistory };
}
