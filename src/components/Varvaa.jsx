import { useState, useEffect } from 'react';
import { FormControl, Stack, CardMedia, Select, Slider, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';
import { Form, redirect } from 'react-router-dom';
import { addHahmo, getHahmot, getVarusteetOmat } from './pelidata';

export async function LomakeAction({ request }) {
    const formData = await request.formData();
    const ammatti = formData.get('ammatti');
    let hahmotResponse = await getHahmot();
    let response;

    if (hahmotResponse.data.length < 6 && ammatti) {
        response = await addHahmo(formData);
    } else {
        response = "";
    }
    if (response.status === 400) {
        throw Error(response.message);
    }
    return redirect('/varvaa');
}

function Varvaa() {
    const [hahmot, setHahmot] = useState([]);
    const [lisatty, setLisatty] = useState([]);
    const [viesti, setViesti] = useState('');
    const [aseet, setAseet] = useState([]);
    const [hahmo, setHahmo] = useState({
        nimi: '',
        ammatti: '',
        ika: 30,
        kokemuspisteet: 1.74,
        ase: '',
        kuva: ''
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
    }

    const lisaaHahmo = () => {
        if (hahmot.length < 6) {
            if (hahmo.ammatti.trim() !== '') {
                setLisatty([...lisatty, hahmo]);
                setViesti('Tervetuloa ryhmään! ');
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
                nainen: ["nainen2", "nainen2"],
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
                const satunnainenNimilista =
                    Math.random() < 0.33 ? nimet.neutraali :
                        Math.random() < 0.66 ? nimet.mies :
                            nimet.nainen;
                // Koska const ei muutu? vaan kerran asettettu arvo pysyy?
                const satunnainenNimi = satunnainenNimilista[Math.floor(Math.random() * satunnainenNimilista.length)];

                if (hahmo.ammatti === "Tiedustelija") {
                    setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi, });
                    if (satunnainenNimilista === nimet.neutraali) {
                        setHahmo({ ...hahmo, kuva: 'tiedustelija.png' });
                    } else if (satunnainenNimilista === nimet.mies) {
                        setHahmo({ ...hahmo, kuva: 'tiedustelija.png' });
                    } else if (satunnainenNimilista === nimet.nainen) {
                        setHahmo({ ...hahmo, kuva: 'tiedustelija.png' });
                    } else {
                        console.log("Jotain meni pieleen.");
                    }
                } else if (hahmo.ammatti === "Ritari") {
                    setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi });
                    if (satunnainenNimilista === nimet.neutraali) {
                        setHahmo({ ...hahmo, kuva: 'ritari.png' });
                    } else if (satunnainenNimilista === nimet.mies) {
                        setHahmo({ ...hahmo, kuva: 'ritari.png' });
                    } else if (satunnainenNimilista === nimet.nainen) {
                        setHahmo({ ...hahmo, kuva: 'ritari.png' });
                    } else {
                        console.log("Jotain meni pieleen.");
                    }
                } else if (hahmo.ammatti === "Strategi") {
                    setHahmo({ ...hahmo, nimi: satunnainenNimi, ase: satunnainenAse.nimi });
                    if (satunnainenNimilista === nimet.neutraali) {
                        setHahmo({ ...hahmo, kuva: 'strategi_neut.png' });
                    } else if (satunnainenNimilista === nimet.mies) {
                        setHahmo({ ...hahmo, kuva: 'strategi_m.png' });
                    } else if (satunnainenNimilista === nimet.nainen) {
                        setHahmo({ ...hahmo, kuva: 'strategi_n.png' });
                    } else {
                        console.log("Jotain meni pieleen.");
                    }
                }
                console.log(hahmo);
            }
        }
    }

    useEffect(() => { fetchData() }, []);
    useEffect(() => { fetchData() }, [hahmo]);
    useEffect(() => {
        taydennaSeikkailija();
    }, [hahmo.ammatti]);

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={4}
            marginTop={4}
            marginX="auto"
            width="80vw"
            justifyContent="center">
            <Form action='uusi' method='post' encType='multipart/form-data'>
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

                    <Button type='submit' onClick={lisaaHahmo} sx={{ marginTop: 4 }} variant='outlined' color="secondary" >Värvää</Button>
                </Box>
            </Form>

            <PaperOpaque>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Box>
                        {hahmo.kuva ?
                            <CardMedia sx={{ height: 'auto', width: 200 }}
                                component='img'
                                image={'/api/lataa/' + hahmo.kuva}
                                alt={hahmo.nimi} />
                            :
                            <Typography sx={{ height: 'auto', width: 200 }}></Typography>}
                    </Box>

                    <Box sx={{ position: 'relative', left: '0%', minWidth: '200px' }}>
                        <Typography sx={{ color: "#FFCC33" }}>{viesti}</Typography>

                        {lisatty.length > 0 && (
                            <Box sx={{ color: 'white' }}>
                                <Typography>Nimi: {lisatty[lisatty.length - 1].nimi}</Typography>
                                <Typography>Ammatti: {lisatty[lisatty.length - 1].ammatti}</Typography>
                                <Typography>Ikä: {lisatty[lisatty.length - 1].ika}</Typography>
                                <Typography>Taso: {Math.floor(lisatty[lisatty.length - 1].kokemuspisteet)}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </PaperOpaque>
        </Stack>
    );
}
export default Varvaa;