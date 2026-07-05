import { useState, useEffect, useCallback } from 'react';
import { getVarusteet, getSeikkailijat, getNimet } from '../services/pelidata';

export function useVarvaaData() {
  const [aseet, setAseet] = useState([]);
  const [seikkailijat, setSeikkailijat] = useState([]);
  const [nimet, setNimet] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [aseetResponse, seikkailijatResponse, nimetResponse] = await Promise.all([
        getVarusteet(),
        getSeikkailijat(),
        getNimet(),
      ]);

      if (aseetResponse.status === 400) {
        throw new Error(aseetResponse.message);
      }
      if (seikkailijatResponse.status === 400) {
        throw new Error(seikkailijatResponse.message);
      }

      setAseet(aseetResponse.data.filter(ase => ase.omistaja === 'pelaaja'));
      setSeikkailijat(seikkailijatResponse.data);
      setNimet({ nainen: [nimetResponse.nainen], mies: [nimetResponse.mies] });
    } catch (err) {
      console.error('Virhe haettaessa aseita tai seikkailijaa:', err);
      setError(err);
      setAseet([]);
      setSeikkailijat([]);
      setNimet({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { aseet, seikkailijat, nimet, loading, error, fetchData, setAseet, setSeikkailijat, setNimet };
}
