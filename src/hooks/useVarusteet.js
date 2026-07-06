import { useState, useEffect, useCallback } from 'react';
import { haeVarusteet } from '../services/pelidata';

export function useVarusteet() {
  const [varusteet, setVarusteet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const haeUudelleenVarusteet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await haeVarusteet();
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
    haeUudelleenVarusteet();
  }, [haeUudelleenVarusteet]);

  return { varusteet, setVarusteet, loading, error, haeUudelleenVarusteet };
}
