import { useState, useEffect } from 'react';
import { FormControl, Stack, CardMedia, Select, Slider, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';
import { Form } from 'react-router-dom';
import { addSeikkailija, getSeikkailijat, getVarusteet, getNimet } from '../services/pelidata';

function Varvaa() {
    const [kesken, setKesken] = useState(false);
    const [seikkailijat, setSeikkailijat] = useState([]);
    const [viesti, setViesti] = useState('');
    const [kuvakytkin, setKuvakytkin] = useState(true);
    const [aseet, setAseet] = useState([]);
    const [lisatty, setLisatty] = useState([{ kuva: 'tyhjaseikkailija.png' }]);
    const [nimet, setNimet] = useState({});
    const [seikkailija, setSeikkailija] = useState({
        nimi: '',
        ammatti: '',
        ika: 30,
        kokemuspisteet: 1.74,
        ase: '',
        kuva: 'tyhjaseikkailija.png',
    });

    const fetchData = async () => {
        try {
            const [aseetResponse, seikkailijatResponse, nimetResponse]
                = await Promise.all([getVarusteet(), getSeikkailijat(), getNimet()]);
            if (aseetResponse.status === 400) {
                throw new Error(aseetResponse.message);
            }
            if (seikkailijatResponse.status === 400) {
                throw new Error(seikkailijatResponse.message);
            }
            setAseet(aseetResponse.data.filter(ase => ase.omistaja === 'pelaaja'));
            setSeikkailijat(seikkailijatResponse.data);
            setNimet({ nainen: [nimetResponse.nainen], mies: [nimetResponse.mies] });
        } catch (error) {
            console.error("Virhe haettaessa aseita tai seikkailijaa:", error);
        }
    }

    const lisaaSeikkailija = async () => {
        if (seikkailijat.length < 6) {
            if (seikkailija.ammatti.trim() !== '') {
                try {
                    const response = await addSeikkailija(seikkailija);
                    if (response.status === 200) {
                        setKuvakytkin(true);
                        setViesti(
                            <Box>
                                <Typography sx={{ color: "#FFCC33" }}>Tervetuloa ryhmään! </Typography>
                                <Box sx={{ color: 'white' }}>
                                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Nimi: {seikkailija.nimi}</Typography>
                                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Ammatti: {seikkailija.ammatti}</Typography>
                                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Ikä: {seikkailija.ika}</Typography>
                                    <Typography sx={{ fontSize: { xs: 'small', sm: 'initial' } }}>Taso: {Math.floor(seikkailija.kokemuspisteet)}</Typography>
                                </Box>
                            </Box>
                        );
                        setSeikkailijat([...seikkailijat, seikkailija]);
                        setSeikkailija({
                            ...seikkailija,
                            nimi: '',
                            ammatti: '',
                            ika: 30,
                            kokemuspisteet: 1.74,
                            ase: '',
                            kuva: '',
                        });
                    } else {
                        setViesti('Seikkailijan värvääminen epäonnistui.');
                    }
                } catch (error) {
                    console.error('Virhe lisäyksessä:', error);
                }
            } else {
                setKuvakytkin(false);
                setViesti(
                    <Typography
                        sx={{
                            position: 'relative',
                            color: "#FFCC33",
                            width: { xs: '100%', sm: 400 },
                            textAlign: 'center',
                            top: { xs: '50%', sm: 0 },
                            transform: { xs: 'translateY(-50%)', sm: 0 }
                        }}>Valitse värvättävän<br></br>seikkailijan ammatti.</Typography>
                );
            }
        } else {
            setKuvakytkin(false);
            setViesti(
                <Typography
                    sx={{
                        position: 'relative',
                        color: "#FFCC33",
                        width: { xs: '100%', sm: 400 },
                        textAlign: 'center',
                        top: { xs: '50%', sm: 0 },
                        transform: { xs: 'translateY(-50%)', sm: 0 }
                    }}>Seikkailijoiden ryhmään<br></br>ei mahdu enempää, kuin 6.</Typography>
            );
        }
    }

    const valintaIkaAmmatti = (e) => {
        setSeikkailija({ ...seikkailija, [e.target.name]: e.target.value });
        setViesti('');
    }

    const taydennaSeikkailija = () => {

        const valintaAse = () => {
            if (!seikkailija.ammatti) return;
            if (aseet.length > 0) {
                let aseetAmmatinMukaan;
                if (seikkailija.ammatti === "Tiedustelija") {
                    aseetAmmatinMukaan = aseet.filter(ase => ase.paino < 10);
                } else if (seikkailija.ammatti === "Ritari") {
                    aseetAmmatinMukaan = aseet.filter(ase => ase.paino > 8);
                } else if (seikkailija.ammatti === "Strategi") {
                    aseetAmmatinMukaan = aseet.filter(ase => ase.tyyppi === "Yhden käden" && ase.paino < 5);
                }
                if (aseetAmmatinMukaan && aseetAmmatinMukaan.length > 0) {
                    const satunnainenAse = aseetAmmatinMukaan[Math.floor(Math.random() * aseetAmmatinMukaan.length)];
                    return satunnainenAse.nimi;
                }
                return '';
            }
        }

        const valintaNimiJaSukupuoli = () => {
            let paikallisetNimet = {
                nainen: ["Saga", "Hildegard", "Megara"],
                mies: ["Visa", "Balthasar", "Ansgarius"],
                neutraali: ["Oni", "Kide", "Ashley", "Robin", "Squall", "Skylar"],
            };
            let arvottuNimiJaSukupuoli = {};
            let valittuNimilista = {};
            // Tee testi sille, että jos nimet on haettu API:sta onnistuneesti
            if (nimet) {
                valittuNimilista = nimet;
                console.log("Nimet haettu API:sta:", valittuNimilista);
            } else {
                valittuNimilista = paikallisetNimet;
                console.log("Nimiä ei saatu API:sta, käytetään paikallisia nimiä:", valittuNimilista);
            }
            console.log("testi:" + Object.keys(valittuNimilista))
            do {
                arvottuNimiJaSukupuoli =
                    Math.random() < 0.33 ? {
                        nimi: paikallisetNimet.neutraali[Math.floor(Math.random() * paikallisetNimet.neutraali.length)],
                        sukupuoli: 'neutraali'
                    } : Math.random() < 0.66 ? {
                        nimi: valittuNimilista.nainen[Math.floor(Math.random() * valittuNimilista.nainen.length)],
                        sukupuoli: "nainen"
                    } : {
                        nimi: valittuNimilista.mies[Math.floor(Math.random() * valittuNimilista.mies.length)],
                        sukupuoli: "mies"
                    };
            } while (arvottuNimiJaSukupuoli === lisatty[lisatty.length - 1]?.nimi);
            return arvottuNimiJaSukupuoli;
        }

        const valintaKuva = (henkilo) => {
            console.log("Nimi ja sukupuoli:", henkilo);
            let kuvaNimenJaAmmatinMukaan = null;
            const arvottuLuku = Math.floor(Math.random() * 2);
            if (seikkailija.ammatti === "Strategi") {
                if (henkilo.sukupuoli === 'neutraali') {
                    kuvaNimenJaAmmatinMukaan = arvottuLuku === 0 ? 'strategi_m.png' : 'strategi_n.png';
                } else if (henkilo.sukupuoli === 'mies') {
                    kuvaNimenJaAmmatinMukaan = 'strategi_m.png';
                } else if (henkilo.sukupuoli === 'nainen') {
                    kuvaNimenJaAmmatinMukaan = 'strategi_n.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            } else if (seikkailija.ammatti === "Tiedustelija") {
                if (henkilo.sukupuoli === 'neutraali') {
                    kuvaNimenJaAmmatinMukaan = arvottuLuku === 0 ? 'tiedustelija_m.png' : 'tiedustelija_n.png';
                } else if (henkilo.sukupuoli === 'mies') {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija_m.png';
                } else if (henkilo.sukupuoli === 'nainen') {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija_n.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            } else if (seikkailija.ammatti === "Ritari") {
                kuvaNimenJaAmmatinMukaan = 'ritari.png';
            }
            return kuvaNimenJaAmmatinMukaan;
        }

        const henkilo = valintaNimiJaSukupuoli();
        const kuva = valintaKuva(henkilo);
        const ase = valintaAse();

        setSeikkailija(prev => ({ ...prev, nimi: henkilo.nimi, ase: ase, kuva: kuva }));
    }

    useEffect(() => { fetchData(), setKuvakytkin(true) }, []);
    useEffect(() => { fetchData() }, [seikkailija]);
    useEffect(() => {
        if (!seikkailija.ammatti) return;
        taydennaSeikkailija();
        setKuvakytkin(true);
    }, [seikkailija.ammatti]);

    const lisattyVarastoon = () => {
        setLisatty([{ nimi: seikkailija.nimi, kuva: seikkailija.kuva || 'tyhjaseikkailija.png' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (kesken) return;
        setKesken(true);
        try {
            await lisaaSeikkailija();
        } finally {
            setKesken(false);
        }
    };

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            sx={{ marginTop: 2, marginX: "auto", width: "80vw", justifyContent: "center" }}
            >
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                <Box sx={{ width: { xs: '40vw', sm: '30vw' } }}>
                    <Typography sx={{ paddingTop: 2, paddingBottom: 4 }}>Valitse mitä ammattia haluat seikkailijasi<br></br>edustavan ja minkä ikäinen hän on.</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="ammatti-label">Ammatti</InputLabel>
                        <Select
                            labelId="ammatti-label"
                            id='ammatti'
                            label="Ammatti"
                            name='ammatti'
                            value={seikkailija.ammatti}
                            onChange={valintaIkaAmmatti}
                        >
                            <MenuItem value="Ritari">Ritari</MenuItem>
                            <MenuItem value="Tiedustelija">Tiedustelija</MenuItem>
                            <MenuItem value="Strategi">Strategi</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography sx={{ padding: 2 }}>Ikä</Typography>

                    <Slider
                        name='ika'
                        min={15}
                        max={100}
                        value={seikkailija.ika}
                        onChange={valintaIkaAmmatti}>
                    </Slider>

                    <Button type='submit' sx={{ marginTop: 4 }} variant='outlined' color="secondary" onClick={lisattyVarastoon}>Värvää</Button>
                </Box>
            </Form>

            <PaperOpaque sx={{ minWidth: '148px', width: { xs: '100%', sm: 400 } }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', minWidth: { xs: '100%', sm: 400 } }}>
                    {kuvakytkin == true ?
                        <Box sx={{ height: { xs: '50%', sm: 'auto' }, margin: { xs: '20px 0', sm: 0 } }}>
                            {seikkailija.kuva ?
                                <CardMedia sx={{ height: { xs: '100%', sm: 'auto' }, width: { xs: '90%', sm: 200 } }}
                                    component='img'
                                    image={'/api/lataa/' + seikkailija.kuva}
                                    //image={'http://localhost:8080/lataa/' + seikkailija.kuva}
                                    alt={seikkailija.nimi}
                                />
                                :
                                <CardMedia sx={{ height: { xs: '100%', sm: 'auto' }, width: { xs: '90%', sm: 200 } }}
                                    component='img'
                                    image={'/api/lataa/' + lisatty[lisatty.length - 1].kuva}
                                    //image={'http://localhost:8080/lataa/' + lisatty[lisatty.length - 1].kuva}
                                    alt={seikkailija.nimi}
                                />
                            }
                        </Box>
                        :
                        <Box sx={{ height: 'auto', width: 'auto' }}></Box>
                    }
                    <Box sx={{ height: { xs: '100%', sm: 'auto' }, margin: { xs: '0 20px', sm: 0 } }}>
                        {viesti}
                    </Box>

                </Box>
            </PaperOpaque>
        </Stack>
    );
}

export default Varvaa;

