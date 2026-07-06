import { useState } from 'react';
import { Stack, Paper, Box, Button, Typography } from '@mui/material';
import { paivitaVarusteet } from '../services/pelidata';
import { useVarusteet } from '../hooks/useVarusteet';

function Kauppa() {
    const { varusteet, setVarusteet, ladataan, virhe, haeUudelleenVarusteet } = useVarusteet();
    const [valittuVaruste, setValittuVaruste] = useState(null);
    const [rahat, setRahat] = useState(1000);

    const vaihdaVarusteenOmistaja = async () => {
        try {
            if (valittuVaruste) {
                let uusiVaruste;
                if (valittuVaruste.omistaja === 'pelaaja') {
                    uusiVaruste = { ...valittuVaruste, omistaja: 'kauppa' };
                } else if (valittuVaruste.omistaja === 'kauppa') {
                    uusiVaruste = { ...valittuVaruste, omistaja: 'pelaaja' };
                }
                setVarusteet(prevVarusteet =>
                    prevVarusteet.map(v => v.id === uusiVaruste.id ? uusiVaruste : v)
                );
                const response = await paivitaVarusteet(uusiVaruste.id, uusiVaruste);
                if (response.status === 200) {
                    console.log('Päivitys onnistui:', response.data);
                    haeUudelleenVarusteet();
                } else {
                    alert('Päivitys epäonnistui: ' + response.message);
                }
            } else {
                alert('Valitse ensin varuste päivitettäväksi.');
            }
        } catch (error) {
            console.error('Virhe päivitettäessä varusteita:', error);
            alert('Virhe päivitettäessä varusteita. Tarkista verkkoyhteys.');
        }
    };

    const valitseVaruste = (varuste) => {
        if (varuste.omistaja === 'pelaaja' || varuste.omistaja === 'kauppa') {
            setValittuVaruste(prev =>
                (prev?.id === varuste.id) ? null : varuste
            );
        }
    };

    const teeKauppa = () => {
        const hinta = Number(valittuVaruste.hinta);
        vaihdaVarusteenOmistaja();
        if (valittuVaruste.omistaja === 'kauppa') {
            setRahat(prevRahat => Number(prevRahat) - hinta);
        } else if (valittuVaruste.omistaja === 'pelaaja') {
            setRahat(prevRahat => Number(prevRahat) + hinta);
        }
        setValittuVaruste(null);
    };

    const VarusteLista = ({ otsikko, varusteet }) => (
        <Box>
            <Typography variant="body1">{otsikko}</Typography>
            <Paper sx={{
                height: "80vh",
                overflowY: "scroll",
                background: "#6b7a8a",
                color: "black"
            }}>
                {varusteet.map(varuste => (
                    <Typography
                        key={varuste.id}
                        onClick={() => valitseVaruste(varuste)}
                        variant='body2'
                        sx={{
                            backgroundColor:
                                (varuste.omistaja === 'pelaaja' && valittuVaruste?.id === varuste.id) ||
                                    (varuste.omistaja === 'kauppa' && valittuVaruste?.id === varuste.id)
                                    ? 'gold'
                                    : 'transparent',
                            '&:hover': { backgroundColor: 'lightgray' },
                            padding: "5px 20px",
                            border: "1px solid black"
                        }}
                    >
                        {varuste.nimi} <br />
                        Vahinko: {varuste.vahinko} <br />
                        Paino: {varuste.paino} <br />
                        Tyyppi: {varuste.tyyppi} <br />
                        Hinta: {varuste.hinta} <br />
                    </Typography>
                ))}
            </Paper>
        </Box>
    );

    return (
        <Stack
            direction="row"
            spacing={{xs: 1, sm: 4}}
            sx={{ marginTop: 2, marginX: "auto", width: "80vw", justifyContent: "center" }}
        >
            <VarusteLista
                otsikko="Omat tavarat"
                varusteet={varusteet.filter(varuste => varuste.omistaja === 'pelaaja')}
            />
            <Box
                width="15vw"
                sx={{
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Typography padding="0 0 30px 0">{rahat} kultaa</Typography>
                <Button variant='outlined' onClick={teeKauppa}>osta
                    <br />&#9664; &#9654;<br />myy 
                </Button>
            </Box>
            <VarusteLista
                otsikko="Kaupan tavarat"
                varusteet={varusteet.filter(varuste => varuste.omistaja === 'kauppa')}
            />
        </Stack>
    );
}

export default Kauppa;