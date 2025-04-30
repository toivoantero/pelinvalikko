import { useState, useEffect } from 'react';
import { FormControl, Stack, CardMedia, Select, Slider, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';
import { Form } from 'react-router-dom';
import { addSeikkailija, getSeikkailijat, getVarusteet } from './pelidata';

function Varvaa() {
    const [seikkailijat, setSeikkailijat] = useState([]);
    const [viesti, setViesti] = useState('');
    const [kuvakytkin, setKuvakytkin] = useState(true);
    const [aseet, setAseet] = useState([]);
    const [lisatty, setLisatty] = useState([{ kuva: 'tyhjaseikkailija.png' }]);
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
            const [aseetResponse, seikkailijatResponse] = await Promise.all([getVarusteet(), getSeikkailijat()]);
            if (aseetResponse.status === 400) {
                throw new Error(aseetResponse.message);
            }
            if (seikkailijatResponse.status === 400) {
                throw new Error(seikkailijatResponse.message);
            }
            setAseet(aseetResponse.data.filter(ase => ase.omistaja === 'pelaaja'));
            setSeikkailijat(seikkailijatResponse.data);
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
                                    <Typography>Nimi: {seikkailija.nimi}</Typography>
                                    <Typography>Ammatti: {seikkailija.ammatti}</Typography>
                                    <Typography>Ikä: {seikkailija.ika}</Typography>
                                    <Typography>Taso: {Math.floor(seikkailija.kokemuspisteet)}</Typography>
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
                            kuva: ''
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
                    <Typography sx={{ color: "#FFCC33", width: 400, textAlign: 'center' }}>Valitse värvättävän<br></br>seikkailijan ammatti.</Typography>
                );
            }
        } else {
            setKuvakytkin(false);
            setViesti(
                <Typography sx={{ color: "#FFCC33", width: 400, textAlign: 'center' }}>Seikkailijoiden ryhmään<br></br>ei mahdu enempää, kuin 6.</Typography>
            );
        }
    }

    const valintaIkaAmmatti = (e) => {
        setSeikkailija({ ...seikkailija, [e.target.name]: e.target.value });
        setViesti('');
    }

    const taydennaSeikkailija = () => {

        const valintaAse = () => {
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

        const valintaNimi = () => {
            let satunnainenNimilista;
            let satunnainenNimi;
            const nimet = {
                neutraali: ["Oni", "Kide", "Ashley"],
                mies: ["Visa", "Balthasar", "Ansgarius"],
                nainen: ["Saga", "Hildegard", "Megara"],
            };
            do {
                satunnainenNimilista =
                    Math.random() < 0.33 ? nimet.neutraali :
                        Math.random() < 0.66 ? nimet.mies :
                            nimet.nainen;
                satunnainenNimi = satunnainenNimilista[Math.floor(Math.random() * satunnainenNimilista.length)];
            } while (satunnainenNimi === lisatty[lisatty.length - 1].nimi); // Jotta ei seuraavalla seikkailijalle tulisi samaa nimeä, kuin edelliselle.
            return { nimi: satunnainenNimi, nimilista: satunnainenNimilista, nimiobjekti: nimet };
        }

        const valintaKuva = (satunnainenNimilista, nimet) => {
            let kuvaNimenJaAmmatinMukaan = null;
            const arvottuLuku = Math.floor(Math.random() * 2);
            if (seikkailija.ammatti === "Strategi") {
                if (satunnainenNimilista === nimet.neutraali) {
                    kuvaNimenJaAmmatinMukaan = arvottuLuku === 0 ? 'strategi_m.png' : 'strategi_n.png';
                } else if (satunnainenNimilista === nimet.mies) {
                    kuvaNimenJaAmmatinMukaan = 'strategi_m.png';
                } else if (satunnainenNimilista === nimet.nainen) {
                    kuvaNimenJaAmmatinMukaan = 'strategi_n.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            } else if (seikkailija.ammatti === "Ritari") {
                if (satunnainenNimilista === nimet.neutraali) {
                    kuvaNimenJaAmmatinMukaan = 'ritari.png';
                } else if (satunnainenNimilista === nimet.mies) {
                    kuvaNimenJaAmmatinMukaan = 'ritari.png';
                } else if (satunnainenNimilista === nimet.nainen) {
                    kuvaNimenJaAmmatinMukaan = 'ritari.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            } else if (seikkailija.ammatti === "Tiedustelija") {
                if (satunnainenNimilista === nimet.neutraali) {
                    kuvaNimenJaAmmatinMukaan = arvottuLuku === 0 ? 'tiedustelija_m.png' : 'tiedustelija_n.png';
                } else if (satunnainenNimilista === nimet.mies) {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija_m.png';
                } else if (satunnainenNimilista === nimet.nainen) {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija_n.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            }
            return kuvaNimenJaAmmatinMukaan;
        }

        const { nimi, nimilista, nimiobjekti } = valintaNimi();
        const kuva = valintaKuva(nimilista, nimiobjekti);
        const ase = valintaAse();

        setSeikkailija({ ...seikkailija, nimi: nimi, ase: ase, kuva: kuva });
    }

    useEffect(() => { fetchData(), setKuvakytkin(true) }, []);
    useEffect(() => { fetchData() }, [seikkailija]);
    useEffect(() => {
        taydennaSeikkailija();
        setKuvakytkin(true);
    }, [seikkailija.ammatti]);

    const lisattyVarastoon = () => {
        setLisatty([{ nimi: seikkailija.nimi, kuva: seikkailija.kuva }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        lisaaSeikkailija();
    };

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={4}
            marginTop={4}
            marginX="auto"
            width="80vw"
            justifyContent="center">
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                <Box sx={{ width: '30vw' }}>
                    <Typography paddingTop={2} paddingBottom={4}>Valitse mitä ammattia haluat seikkailijasi<br></br>edustavan ja minkä ikäinen hän on.</Typography>
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

            <PaperOpaque>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', minWidth: { xs: '50%', sm: 400 } }}>
                    {kuvakytkin == true ?
                        <Box sx={{ height: {xs: '50%', sm: 'auto'}, marginTop: {xs: '20px'} }}>
                            {seikkailija.kuva ?
                                <CardMedia sx={{ height: {xs: '100%', sm: 'auto'}, width: { xs: '70%', sm: 200 } }}
                                    component='img'
                                    image={'/api/lataa/' + seikkailija.kuva}
                                    //image={'http://localhost:8080/lataa/' + seikkailija.kuva}
                                    alt={seikkailija.nimi}
                                />
                                :
                                <CardMedia sx={{ height: {xs: '100%', sm: 'auto'}, width: { xs: '70%', sm: 200 } }}
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
                    <Box sx={{ position: 'relative', left: '0%', marginTop: {xs: '30px'}, minWidth: { xs: '50%', sm: 200 }}}>
                        {viesti}
                    </Box>

                </Box>
            </PaperOpaque>
        </Stack>
    );
}

export default Varvaa;

