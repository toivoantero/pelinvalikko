import { useState, useEffect, useCallback } from 'react';
import { haeVarusteet, haeSeikkailijat, haeNimet } from '../services/pelidata';

export function useVarvaaData() {
  const [aseet, setAseet] = useState([]);
  const [seikkailijat, setSeikkailijat] = useState([]);
  const [nimet, setNimet] = useState({});
  const [ladataan, setLadataan] = useState(true);
  const [virhe, setVirhe] = useState(null);

  const haeData = useCallback(async () => {
    setLadataan(true);
    setVirhe(null);

    try {
      const [aseetResponse, seikkailijatResponse, nimetResponse] = await Promise.all([
        haeVarusteet(),
        haeSeikkailijat(),
        haeNimet(),
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
      setVirhe(err);
      setAseet([]);
      setSeikkailijat([]);
      setNimet({});
    } finally {
      setLadataan(false);
    }
  }, []);

  useEffect(() => {
    haeData();
  }, [haeData]);

  return { aseet, seikkailijat, nimet, ladataan, virhe, haeData, setAseet, setSeikkailijat, setNimet };
}
