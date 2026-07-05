import { useState, useEffect, useCallback } from 'react';
import { getVarusteet } from '../services/pelidata';

export function useVarusteet() {
  const [varusteet, setVarusteet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadVarusteet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getVarusteet();
      setVarusteet(response?.data || []);
    } catch (err) {
      console.error('Virhe haettaessa varusteita:', err);
      setError(err);
      setVarusteet([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadVarusteet();
  }, [reloadVarusteet]);

  return { varusteet, setVarusteet, loading, error, reloadVarusteet };
}
