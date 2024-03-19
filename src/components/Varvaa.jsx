import { useState, useEffect } from 'react';
import { FormControl, Stack, CardMedia, Select, Slider, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';
import { Form } from 'react-router-dom';
import { addHahmo, getHahmot, getVarusteetOmat } from './pelidata';

function Varvaa() {
    const [hahmot, setHahmot] = useState([]);
    const [viesti, setViesti] = useState('');
    const [kuvakytkin, setKuvakytkin] = useState(true);
    const [aseet, setAseet] = useState([]);
    const [lisatty, setLisatty] = useState([{ kuva: 'tyhjahahmo.png' }]);
    const [hahmo, setHahmo] = useState({
        nimi: '',
        ammatti: '',
        ika: 30,
        kokemuspisteet: 1.74,
        ase: '',
        kuva: 'tyhjahahmo.png',
    });

    const fetchData = async () => {
        try {
            const [aseetResponse, hahmotResponse] = await Promise.all([getVarusteetOmat(), getHahmot()]);
            if (aseetResponse.status === 400) {
                throw new Error(aseetResponse.message);
            }
            if (hahmotResponse.status === 400) {
                throw new Error(hahmotResponse.message);
            }
            setAseet(aseetResponse.data);
            setHahmot(hahmotResponse.data);
        } catch (error) {
            console.error("Virhe haettaessa aseita tai hahmoja:", error);
        }
    }

    const lisaaHahmo = async () => {
        if (hahmot.length < 6) {
            if (hahmo.ammatti.trim() !== '') {
                try {
                    const response = await addHahmo(hahmo);
                    if (response.status === 200) {
                        setKuvakytkin(true);
                        setViesti(
                            <Box>
                                <Typography sx={{ color: "#FFCC33" }}>Tervetuloa ryhmään! </Typography>
                                <Box sx={{ color: 'white' }}>
                                    <Typography>Nimi: {hahmo.nimi}</Typography>
                                    <Typography>Ammatti: {hahmo.ammatti}</Typography>
                                    <Typography>Ikä: {hahmo.ika}</Typography>
                                    <Typography>Taso: {Math.floor(hahmo.kokemuspisteet)}</Typography>
                                </Box>
                            </Box>
                        );
                        setHahmot([...hahmot, hahmo]);
                        setHahmo({
                            ...hahmo,
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
        setHahmo({ ...hahmo, [e.target.name]: e.target.value });
        setViesti('');
    }

    const taydennaSeikkailija = () => {

        const valintaAse = () => {
            if (aseet.length > 0) {
                let aseetAmmatinMukaan;
                if (hahmo.ammatti === "Tiedustelija") {
                    aseetAmmatinMukaan = aseet.filter(ase => ase.paino < 10);
                } else if (hahmo.ammatti === "Ritari") {
                    aseetAmmatinMukaan = aseet.filter(ase => ase.paino > 8);
                } else if (hahmo.ammatti === "Strategi") {
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
                neutraali: ["neut1", "neut2"],
                mies: ["mies1", "mies2"],
                nainen: ["nainen1", "nainen2"],
            };
            do {
                satunnainenNimilista =
                    Math.random() < 0.33 ? nimet.neutraali :
                        Math.random() < 0.66 ? nimet.mies :
                            nimet.nainen;
                satunnainenNimi = satunnainenNimilista[Math.floor(Math.random() * satunnainenNimilista.length)];
            } while (satunnainenNimi === lisatty[lisatty.length - 1].nimi); // Jotta ei seuraavalla hahmolle tulisi samaa nimeä, kuin edelliselle.
            return { nimi: satunnainenNimi, nimilista: satunnainenNimilista, nimiobjekti: nimet };
        }

        const valintaKuva = (satunnainenNimilista, nimet) => {
            let kuvaNimenJaAmmatinMukaan = null;
            if (hahmo.ammatti === "Strategi") {
                if (satunnainenNimilista === nimet.neutraali) {
                    kuvaNimenJaAmmatinMukaan = 'strategi_neut.png';
                } else if (satunnainenNimilista === nimet.mies) {
                    kuvaNimenJaAmmatinMukaan = 'strategi_m.png';
                } else if (satunnainenNimilista === nimet.nainen) {
                    kuvaNimenJaAmmatinMukaan = 'strategi.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            } else if (hahmo.ammatti === "Ritari") {
                if (satunnainenNimilista === nimet.neutraali) {
                    kuvaNimenJaAmmatinMukaan = 'ritari.png';
                } else if (satunnainenNimilista === nimet.mies) {
                    kuvaNimenJaAmmatinMukaan = 'ritari.png';
                } else if (satunnainenNimilista === nimet.nainen) {
                    kuvaNimenJaAmmatinMukaan = 'ritari.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            } else if (hahmo.ammatti === "Tiedustelija") {
                if (satunnainenNimilista === nimet.neutraali) {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija.png';
                } else if (satunnainenNimilista === nimet.mies) {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija.png';
                } else if (satunnainenNimilista === nimet.nainen) {
                    kuvaNimenJaAmmatinMukaan = 'tiedustelija.png';
                } else {
                    console.log("Jotain meni pieleen.");
                }
            }
            return kuvaNimenJaAmmatinMukaan;
        }

        const { nimi, nimilista, nimiobjekti } = valintaNimi();
        const kuva = valintaKuva(nimilista, nimiobjekti);
        const ase = valintaAse();

        setHahmo({ ...hahmo, nimi: nimi, ase: ase, kuva: kuva });
    }

    useEffect(() => { fetchData(), setKuvakytkin(true), console.log(hahmo.kuva) }, []);
    useEffect(() => { fetchData() }, [hahmo]);
    useEffect(() => {
        taydennaSeikkailija();
        setKuvakytkin(true);
    }, [hahmo.ammatti]);

    const lisattyVarastoon = () => {
        setLisatty([{ nimi: hahmo.nimi, kuva: hahmo.kuva }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        lisaaHahmo();
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
                            value={hahmo.ammatti}
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
                        value={hahmo.ika}
                        onChange={valintaIkaAmmatti}>
                    </Slider>

                    <Button type='submit' sx={{ marginTop: 4 }} variant='outlined' color="secondary" onClick={lisattyVarastoon}>Värvää</Button>
                </Box>
            </Form>

            <PaperOpaque>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', minWidth: 400 }}>
                    {kuvakytkin == true ?
                        <Box>
                            {hahmo.kuva ?
                                <CardMedia sx={{ height: 'auto', width: 200 }}
                                    component='img'
                                    image={'/api/lataa/' + hahmo.kuva}
                                    //image={'http://localhost:8080/lataa/' + hahmo.kuva}
                                    alt={hahmo.nimi}
                                />
                                :
                                <CardMedia sx={{ height: 'auto', width: 200 }}
                                    component='img'
                                    image={'/api/lataa/' + lisatty[lisatty.length - 1].kuva}
                                    //image={'http://localhost:8080/lataa/' + lisatty[lisatty.length - 1].kuva}
                                    alt={hahmo.nimi}
                                />
                            }
                        </Box>
                        :
                        <Box sx={{ height: 'auto', width: 'auto' }}></Box>
                    }
                    <Box sx={{ position: 'relative', left: '0%', minWidth: 200 }}>
                        {viesti}
                    </Box>

                </Box>
            </PaperOpaque>
        </Stack>
    );
}

export default Varvaa;
