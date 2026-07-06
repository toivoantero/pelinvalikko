import { useState, useEffect } from 'react';
import { paivitaSeikkailija } from '../services/pelidata';

export function useIdentiteettiLogic({ initialSeikkailija, varusteet }) {
    const [seikkailija, setSeikkailija] = useState(initialSeikkailija);
    const [aseVirhe, setAseVirhe] = useState(false);
    const [viesti, setViesti] = useState(null);
    const [dialogivalinta, setDialogivalinta] = useState(null);
    const [dialogiAuki, setDialogiAuki] = useState(false);

    const strategiAseet = (varusteet || []).filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5 && ase.omistaja === 'pelaaja');
    const tiedustelijaAseet = (varusteet || []).filter(ase => ase.paino < 10 && ase.omistaja === 'pelaaja');
    const ritariAseet = (varusteet || []).filter(ase => ase.paino > 8 && ase.omistaja === 'pelaaja');

    const kasitteleKentanMuutos = (e) => {
        const { name, value } = e.target;

        setSeikkailija((prevSeikkailija) => {
            let uusiAse = prevSeikkailija.ase;

            if (name === 'ammatti') {
                const sallitutAseet = value === "Strategi" ? strategiAseet.map(ase => ase.nimi) :
                    value === "Tiedustelija" ? tiedustelijaAseet.map(ase => ase.nimi) :
                        value === "Ritari" ? ritariAseet.map(ase => ase.nimi) : [];

                if (!sallitutAseet.includes(prevSeikkailija.ase)) {
                    uusiAse = '-';
                }
            }

            return {
                ...prevSeikkailija,
                [name]: value,
                ...(name === 'ammatti' && { ase: uusiAse })
            };
        });
    };

    const avaaDialogi = () => setDialogiAuki(true);
    const suljeDialogi = () => setDialogiAuki(false);

    const tallennaMuutokset = async () => {
        if (seikkailija.ase === '-') {
            setAseVirhe(true);
            setViesti({ tyyppi: 'teksti', teksti: 'Seikkailijalle on valittava ase.', style: { color: '#FFCC33' } });
            setDialogivalinta({ type: 'close' });
            avaaDialogi();
            return;
        }

        try {
            const response = await paivitaSeikkailija(seikkailija.id, seikkailija);
            if (response.status === 200) {
                setAseVirhe(false);
                setViesti({ tyyppi: 'teksti', teksti: 'Seikkailijan tiedot ovat nyt muutetut', style: { color: '#FFCC33' } });
                setDialogivalinta({ type: 'close' });
                avaaDialogi();
            } else {
                setViesti({ tyyppi: 'teksti', teksti: 'Päivitys epäonnistui', style: { color: '#FF3333' } });
                setDialogivalinta({ type: 'close' });
                avaaDialogi();
            }
        } catch (error) {
            console.error('Virhe päivitettäessä tietokantaa:', error);
            setViesti({ tyyppi: 'teksti', teksti: 'Virhe päivitettäessä. Yritä uudelleen.', style: { color: '#FF3333' } });
            setDialogivalinta({ type: 'close' });
            avaaDialogi();
        }
    };

    const vahvistaSeikkailijanPoisto = (id) => {
        setViesti({ tyyppi: 'teksti', teksti: 'Irtisanotaanko seikkailija?', style: { color: '#FFCC33' } });
        setDialogivalinta({ type: 'confirmDelete', id });
        avaaDialogi();
    };

    return {
        seikkailija,
        setSeikkailija,
        aseVirhe,
        setAseVirhe,
        viesti,
        setViesti,
        dialogivalinta,
        setDialogivalinta,
        dialogiAuki,
        avaaDialogi,
        suljeDialogi,
        kasitteleKentanMuutos,
        tallennaMuutokset,
        vahvistaSeikkailijanPoisto,
        strategiAseet,
        tiedustelijaAseet,
        ritariAseet
    };
}
