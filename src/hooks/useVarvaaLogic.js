import { useState, useEffect } from 'react';
import { addSeikkailija } from '../services/pelidata';

const initialSeikkailija = {
    nimi: '',
    ammatti: '',
    ika: 30,
    kokemuspisteet: 1.74,
    ase: '',
    kuva: 'tyhjaseikkailija.png',
};

const paikallisetNimet = {
    nainen: ['Saga', 'Hildegard', 'Megara'],
    mies: ['Visa', 'Balthasar', 'Ansgarius'],
    neutraali: ['Oni', 'Kide', 'Ashley', 'Robin', 'Squall', 'Skylar'],
};

export function useVarvaaLogic({ aseet, seikkailijat, nimet, setSeikkailijat }) {
    const [seikkailija, setSeikkailija] = useState(initialSeikkailija);
    const [kesken, setKesken] = useState(false);
    // `viesti` is a descriptor object set by the hook. Examples:
    // { kind: 'text', text: '...', style: { ... } }
    // { kind: 'welcome', text: 'Tervetuloa...', data: { nimi, ammatti, ika, taso } }
    const [viesti, setViesti] = useState(null);
    const [kuvakytkin, setKuvakytkin] = useState(true);
    const [lisatty, setLisatty] = useState([{ kuva: 'tyhjaseikkailija.png' }]);

    const valintaAse = () => {
        if (!seikkailija.ammatti) return '';
        if (aseet.length === 0) return '';

        let aseetAmmatinMukaan;
        if (seikkailija.ammatti === 'Tiedustelija') {
            aseetAmmatinMukaan = aseet.filter(ase => ase.paino < 10);
        } else if (seikkailija.ammatti === 'Ritari') {
            aseetAmmatinMukaan = aseet.filter(ase => ase.paino > 8);
        } else if (seikkailija.ammatti === 'Strategi') {
            aseetAmmatinMukaan = aseet.filter(ase => ase.tyyppi === 'Yhden käden' && ase.paino < 5);
        }

        if (aseetAmmatinMukaan && aseetAmmatinMukaan.length > 0) {
            const satunnainenAse = aseetAmmatinMukaan[Math.floor(Math.random() * aseetAmmatinMukaan.length)];
            return satunnainenAse.nimi;
        }

        return '';
    };

    const valintaNimiJaSukupuoli = () => {
        let arvottuNimiJaSukupuoli = {};
        let valittuNimilista = nimet && nimet.nainen && nimet.mies ? nimet : paikallisetNimet;

        do {
            arvottuNimiJaSukupuoli = Math.random() < 0.33
                ? {
                    nimi: paikallisetNimet.neutraali[Math.floor(Math.random() * paikallisetNimet.neutraali.length)],
                    sukupuoli: 'neutraali',
                }
                : Math.random() < 0.66
                    ? {
                        nimi: valittuNimilista.nainen[Math.floor(Math.random() * valittuNimilista.nainen.length)],
                        sukupuoli: 'nainen',
                    }
                    : {
                        nimi: valittuNimilista.mies[Math.floor(Math.random() * valittuNimilista.mies.length)],
                        sukupuoli: 'mies',
                    };
        } while (arvottuNimiJaSukupuoli === lisatty[lisatty.length - 1]?.nimi);

        return arvottuNimiJaSukupuoli;
    };

    const valintaKuva = (henkilo) => {
        const arvottuLuku = Math.floor(Math.random() * 2);
        if (seikkailija.ammatti === 'Strategi') {
            if (henkilo.sukupuoli === 'neutraali') {
                return arvottuLuku === 0 ? 'strategi_m.png' : 'strategi_n.png';
            }
            return henkilo.sukupuoli === 'mies' ? 'strategi_m.png' : 'strategi_n.png';
        }

        if (seikkailija.ammatti === 'Tiedustelija') {
            if (henkilo.sukupuoli === 'neutraali') {
                return arvottuLuku === 0 ? 'tiedustelija_m.png' : 'tiedustelija_n.png';
            }
            return henkilo.sukupuoli === 'mies' ? 'tiedustelija_m.png' : 'tiedustelija_n.png';
        }

        if (seikkailija.ammatti === 'Ritari') {
            return 'ritari.png';
        }

        return '';
    };

    const taydennaSeikkailija = () => {
        if (!seikkailija.ammatti) return;
        const henkilo = valintaNimiJaSukupuoli();
        const kuva = valintaKuva(henkilo);
        const ase = valintaAse();

        setSeikkailija(prev => ({ ...prev, nimi: henkilo.nimi, ase, kuva }));
    };

    const lisaaSeikkailija = async () => {
        if (seikkailijat.length >= 6) {
            setKuvakytkin(false);
            setViesti({
                kind: 'text',
                text: 'Seikkailijoiden ryhmään\nei mahdu enempää, kuin 6.',
                style: {
                    position: 'relative',
                    color: "#FFCC33",
                    width: { xs: '100%', sm: 400 },
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    top: { xs: '50%', sm: 0 },
                    transform: { xs: 'translateY(-50%)', sm: 0 }
                }
            });
            return;
        }

        if (!seikkailija.ammatti.trim()) {
            setKuvakytkin(false);
            setViesti({
                kind: 'text',
                text: 'Valitse värvättävän\nseikkailijan ammatti.',
                style: {
                    position: 'relative',
                    color: '#FFCC33',
                    whiteSpace: 'pre-line',
                    width: { xs: '100%', sm: 400 },
                    textAlign: 'center',
                    top: { xs: '50%', sm: 0 },
                    transform: { xs: 'translateY(-50%)', sm: 0 },
                },
            });
            return;
        }

        try {
            const response = await addSeikkailija(seikkailija);
            if (response.status === 200) {
                setKuvakytkin(true);
                setViesti({
                    kind: 'welcome',
                    text: 'Tervetuloa ryhmään!',
                    data: {
                        nimi: seikkailija.nimi,
                        ammatti: seikkailija.ammatti,
                        ika: seikkailija.ika,
                        taso: Math.floor(seikkailija.kokemuspisteet),
                    },
                    style: { color: '#FFCC33' },
                });
                setSeikkailijat([...seikkailijat, seikkailija]);
                setSeikkailija({ ...seikkailija, nimi: '', ammatti: '', ika: 30, kokemuspisteet: 1.74, ase: '', kuva: '' });
            } else {
                setViesti({ kind: 'text', text: 'Seikkailijan värvääminen\nepäonnistui.', style: { color: '#FF3333' } });
            }
        } catch (error) {
            console.error('Virhe lisäyksessä:', error);
            setViesti({ kind: 'text', text: 'Virhe lisäyksessä.\nYritä uudelleen.', style: { color: '#FF3333' } });
        }
    };

    const valintaIkaAmmatti = (e) => {
        const { name, value } = e.target;
        setSeikkailija(prev => ({ ...prev, [name]: value }));
        setViesti(null);
    };

    const lisattyVarastoon = () => {
        setLisatty([{ nimi: seikkailija.nimi, kuva: seikkailija.kuva || 'tyhjaseikkailija.png' }]);
    };

    useEffect(() => {
        setKuvakytkin(true);
    }, []);

    useEffect(() => {
        if (!seikkailija.ammatti) return;
        taydennaSeikkailija();
        setKuvakytkin(true);
    }, [seikkailija.ammatti]);

    return {
        seikkailija,
        setSeikkailija,
        kesken,
        setKesken,
        viesti,
        kuvakytkin,
        lisatty,
        lisaaSeikkailija,
        valintaIkaAmmatti,
        lisattyVarastoon,
    };
}
