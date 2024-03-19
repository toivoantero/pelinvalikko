import { useState, useEffect } from 'react';
import { FormControl, Stack, CardMedia, Select, Slider, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';
import { Form } from 'react-router-dom';
import { addHahmo, getHahmot, getVarusteetOmat } from './pelidata';
import { CSSTransition } from 'react-transition-group';

function Varvaa() {
    const [hahmot, setHahmot] = useState([]);
    const [viesti, setViesti] = useState('');
    const [aseet, setAseet] = useState([]);
    const [hahmo, setHahmo] = useState({
        nimi: '',
        ammatti: '',
        ika: 30,
        kokemuspisteet: 1.74,
        ase: '',
        kuva: 'protohahmo.png'
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

    const muutaTieto = (e) => {
        setHahmo({ ...hahmo, [e.target.name]: e.target.value });
        setViesti('');
    }

    const lisaaHahmo = async () => {
        if (hahmot.length < 6) {
            if (hahmo.ammatti.trim() !== '') {
                try {
                    const response = await addHahmo(hahmo);
                    if (response.status === 200) {
                        console.log("lisättiin: " + hahmo);
                        setViesti('Tervetuloa ryhmään! ');
                        console.log(hahmot.length);
                        setHahmot([...hahmot, hahmo]);
                        //setHahmo({ ...hahmo, kuva: 'protohahmo.png' });
                        setHahmo({ ...hahmo, ammatti: '' });
                    } else {
                        setViesti('Hahmon lisäys epäonnistui.');
                    }
                } catch (error) {
                    console.error('Virhe lisäyksessä:', error);
                    setViesti('Hahmon lisäys epäonnistui: ' + error.message);
                }
            } else {
                setViesti('Valitse värvättävän seikkailijan ammatti.');
            }
        } else {
            setLisatty([]);
            setViesti('Seikkailijoiden ryhmään ei mahdu enempää, kuin 6.');
        }
    }

    const taydennaSeikkailija = () => {
        if (aseet.length > 0) {
            //const nimet = ["Visa", "Hildegard", "Mustaparta", "Ansgarius", "Saga", "Oni"];
            const nimet = {
                neutraali: ["neut1", "neut2"],
                mies: ["mies1", "mies2"],
                nainen: ["nainen1", "nainen2"],
            };
            let uudetAseet;

            if (hahmo.ammatti === "Tiedustelija") {
                uudetAseet = aseet.filter(ase => ase.paino < 10);
            } else if (hahmo.ammatti === "Ritari") {
                uudetAseet = aseet.filter(ase => ase.paino > 8);
            } else if (hahmo.ammatti === "Strategi") {
                uudetAseet = aseet.filter(ase => ase.tyyppi === "Yhden käden" && ase.paino < 5);
            }

            if (uudetAseet) {
                const satunnainenAse = uudetAseet[Math.floor(Math.random() * uudetAseet.length)];
                let satunnainenNimi;
                let satunnainenNimilista;

                console.log("edellinen nimi: " + hahmo.nimi);

                do {
                    satunnainenNimilista =
                        Math.random() < 0.33 ? nimet.neutraali :
                            Math.random() < 0.66 ? nimet.mies :
                                nimet.nainen;
                    satunnainenNimi = satunnainenNimilista[Math.floor(Math.random() * satunnainenNimilista.length)];
                } while (satunnainenNimi === hahmo.nimi); // Tarkistetaan, onko uusi nimi sama kuin edellinen

                console.log("satunnainen nimi: " + satunnainenNimi);

                if (hahmo.ammatti === "Tiedustelija") {
                    if (satunnainenNimilista === nimet.neutraali) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'tiedustelija.png' });
                    } else if (satunnainenNimilista === nimet.mies) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'tiedustelija.png' });
                    } else if (satunnainenNimilista === nimet.nainen) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'tiedustelija.png' });
                    } else {
                        console.log("Jotain meni pieleen.");
                    }
                } else if (hahmo.ammatti === "Ritari") {
                    if (satunnainenNimilista === nimet.neutraali) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'ritari.png' });
                    } else if (satunnainenNimilista === nimet.mies) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'ritari.png' });
                    } else if (satunnainenNimilista === nimet.nainen) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'ritari.png' });
                    } else {
                        console.log("Jotain meni pieleen.");
                    }
                } else if (hahmo.ammatti === "Strategi") {
                    if (satunnainenNimilista === nimet.neutraali) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'strategi_neut.png' });
                    } else if (satunnainenNimilista === nimet.mies) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'strategi_m.png' });
                    } else if (satunnainenNimilista === nimet.nainen) {
                        setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, kuva: 'strategi.png' });
                    } else {
                        console.log("Jotain meni pieleen.");
                    }
                }
            }
        }
    }

    useEffect(() => { fetchData() }, []);
    useEffect(() => { fetchData() }, [hahmo]);
    useEffect(() => {
        taydennaSeikkailija();
    }, [hahmo.ammatti]);

    const handleSubmit = (e) => {
        e.preventDefault();
        lisaaHahmo();
    };

    const handleChange = (e) => {
        muutaTieto(e);
    };

    const toggleShown = () => {
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
                    <TextField type='hidden' name='nimi' value={hahmo.nimi} />
                    <TextField type='hidden' name='ase' value={hahmo.ase} />
                    <TextField type='hidden' name='kokemuspisteet' value={hahmo.kokemuspisteet} />
                    <TextField type='hidden' name='kuva' value={hahmo.kuva} />
                    <FormControl fullWidth>
                        <InputLabel id="ammatti-label">Ammatti</InputLabel>
                        <Select
                            labelId="ammatti-label"
                            id='ammatti'
                            label="Ammatti"
                            name='ammatti'
                            value={hahmo.ammatti}
                            onChange={muutaTieto}
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
                        onChange={muutaTieto}>
                    </Slider>

                    <Button type='submit' sx={{ marginTop: 4 }} variant='outlined' color="secondary" onClick={toggleShown}>Värvää</Button>
                </Box>
            </Form>

            <PaperOpaque>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>

                    <CardMedia sx={{ height: 'auto', width: 200 }}
                        component='img'
                        //image={'/api/lataa/'
                        image={'http://localhost:8080/lataa/' + hahmo.kuva}
                        alt={hahmo.nimi} />


                    <Box sx={{ position: 'relative', left: '0%', minWidth: '200px' }}>
                        <Typography sx={{ color: "#FFCC33" }}>{viesti}</Typography>

                        {hahmot.length > 0 && viesti != '' && (
                            <Box sx={{ color: 'white' }}>
                                <Typography>Nimi: {hahmot[hahmot.length - 1].nimi}</Typography>
                                <Typography>Ammatti: {hahmot[hahmot.length - 1].ammatti}</Typography>
                                <Typography>Ikä: {hahmot[hahmot.length - 1].ika}</Typography>
                                <Typography>Taso: {Math.floor(hahmot[hahmot.length - 1].kokemuspisteet)}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </PaperOpaque>
        </Stack>
    );
}

export default Varvaa;
