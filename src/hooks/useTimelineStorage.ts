import { useState, useEffect } from 'react';

export interface TimelineEntry {
  id: string;
  title: string;
  date: string;
  tag: 'learning' | 'building' | 'completed' | 'achievement' | 'work';
  description: string;
  link?: string;
}

const STORAGE_KEY = 'portfolio_timeline';

export function useTimelineStorage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed);
      } catch (error) {
        console.error('Error loading timeline entries:', error);
      }
    }
  }, []);

  const saveEntries = (newEntries: TimelineEntry[]) => {
    const sorted = [...newEntries].sort((a, b) => {
      if (a.date === 'Ongoing') return -1;
      if (b.date === 'Ongoing') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setEntries(sorted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  };

  const addEntry = (entry: TimelineEntry) => {
    const newEntries = [...entries, entry];
    saveEntries(newEntries);
  };

  const updateEntry = (id: string, updatedEntry: Partial<TimelineEntry>) => {
    const newEntries = entries.map(e => 
      e.id === id ? { ...e, ...updatedEntry } : e
    );
    saveEntries(newEntries);
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter(e => e.id !== id);
    saveEntries(newEntries);
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry
  };
}
