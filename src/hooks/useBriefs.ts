import { useState, useEffect } from 'react';
import type { Brief } from '../types';

export const useBriefs = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        const response = await fetch('/briefs.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch briefs');
        
        const data: Brief[] = await response.json();
        // Sort by date descending (newest first)
        const sorted = data.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setBriefs(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load briefs');
      } finally {
        setLoading(false);
      }
    };

    fetchBriefs();
  }, []);

  return { briefs, loading, error };
};

