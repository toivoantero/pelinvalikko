import { useState, useEffect } from 'react';
import { updateSeikkailija } from '../services/pelidata';

export function useIdentiteettiLogic({ initialSeikkailija, varusteet }) {
    const [seikkailija, setSeikkailija] = useState(initialSeikkailija);
    const [aseVirhe, setAseVirhe] = useState(false);
    const [viesti, setViesti] = useState(null);
    const [dialogivalinta, setDialogivalinta] = useState(null);
    const [open, setOpen] = useState(false);

    const strategiAseet = (varusteet || []).filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5 && ase.omistaja === 'pelaaja');
    const tiedustelijaAseet = (varusteet || []).filter(ase => ase.paino < 10 && ase.omistaja === 'pelaaja');
    const ritariAseet = (varusteet || []).filter(ase => ase.paino > 8 && ase.omistaja === 'pelaaja');

    const muutaTieto = (e) => {
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

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const paivitaSeikkailija = async () => {
        if (seikkailija.ase === '-') {
            setAseVirhe(true);
            setViesti({ kind: 'text', text: 'Seikkailijalle on valittava ase.', style: { color: '#FFCC33' } });
            setDialogivalinta({ type: 'close' });
            handleClickOpen();
            return;
        }

        try {
            const response = await updateSeikkailija(seikkailija.id, seikkailija);
            if (response.status === 200) {
                setAseVirhe(false);
                setViesti({ kind: 'text', text: 'Seikkailijan tiedot ovat nyt muutetut', style: { color: '#FFCC33' } });
                setDialogivalinta({ type: 'close' });
                handleClickOpen();
            } else {
                setViesti({ kind: 'text', text: 'Päivitys epäonnistui', style: { color: '#FF3333' } });
                setDialogivalinta({ type: 'close' });
                handleClickOpen();
            }
        } catch (error) {
            console.error('Virhe päivitettäessä tietokantaa:', error);
            setViesti({ kind: 'text', text: 'Virhe päivitettäessä. Yritä uudelleen.', style: { color: '#FF3333' } });
            setDialogivalinta({ type: 'close' });
            handleClickOpen();
        }
    };

    const poistaSeikkailija = (id) => {
        setViesti({ kind: 'text', text: 'Irtisanotaanko seikkailija?', style: { color: '#FFCC33' } });
        setDialogivalinta({ type: 'confirmDelete', id });
        handleClickOpen();
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
        open,
        handleClickOpen,
        handleClose,
        muutaTieto,
        paivitaSeikkailija,
        poistaSeikkailija,
        strategiAseet,
        tiedustelijaAseet,
        ritariAseet
    };
}
