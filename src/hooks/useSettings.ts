import { useState, useEffect } from 'react';
import type { UserSettings } from '../types';

const DEFAULT: UserSettings = {
  cirMorning: 10,
  cirNoon: 10,
  cirEvening: 10,
  isf: 50,
  tdd: 30,
  targetBg: 100,
  basalDose: 10,
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('insulin_settings');
      return saved ? { ...DEFAULT, ...JSON.parse(saved) } : DEFAULT;
    } catch { return DEFAULT; }
  });

  useEffect(() => {
    localStorage.setItem('insulin_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return { settings, updateSettings };
}
