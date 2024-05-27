import { useState } from 'react';
import { useEffect } from 'react';
import { Stack, Paper, Box, Button, Typography } from '@mui/material';
import { getVarusteetOmat, getVarusteetKaupan } from './pelidata';

function Kauppa() {

    const [varusteetOmat, setVarusteetOmat] = useState([]);
    const [varusteetKauppa, setVarusteetKauppa] = useState([]);
    const [myytava, setMyytava] = useState(null);
    const [ostettava, setOstettava] = useState(null);
    const [omatMuutos, setOmatMuutos] = useState([]);
    const [kaupanMuutos, setKaupanMuutos] = useState([]);
    const [rahat, setRahat] = useState(1000);

    const fetchData = async () => {
        try {
            const [omatResponse, kaupanResponse] = await Promise.all([getVarusteetOmat(), getVarusteetKaupan()]);
            if (omatResponse.status === 400) {
                throw new Error(omatResponse.message);
            }
            if (kaupanResponse.status === 400) {
                throw new Error(kaupanResponse.message);
            }
            setVarusteetOmat(omatResponse.data);
            setVarusteetKauppa(kaupanResponse.data);
        } catch (error) {
            console.error("Virhe haettaessa aseita tai hahmoja:", error);
        }
    }

    const valitseMyytava = (e) => {
        e.target.style.background = "gold";
        setMyytava(omatMuutos.find(varuste => varuste.id == e.target.id));
        setOstettava(null);
    }
    const valitseOstettava = (e) => {
        e.target.style.background = "gold";
        setOstettava(kaupanMuutos.find(varuste => varuste.id == e.target.id));
        setMyytava(null);
    }

    const myy = () => {
        if (myytava != null) {
            setOmatMuutos(omatMuutos.filter(varuste => varuste.id != myytava.id));
            setKaupanMuutos([myytava, ...kaupanMuutos]);
            setRahat(rahat + myytava.hinta);
            console.log(myytava.nimi + " myyty.");
            alert('Tämä toiminto ei ole vielä toimintakunnossa. Tällä hetkellä sovelluksen toimivat osat ovat: (1) Sisäänkirjautuminen, (2) Värvääminen, (3) Seikkailijoiden tietojen tarkastelu. Toimimattomia osia ovat: (4) Värvättyjen seikkailijoiden tietojen muuttaminen, (5) Kauppa.');
        }
    }
    const osta = () => {
        if (ostettava != null) {
            setKaupanMuutos(kaupanMuutos.filter(varuste => varuste.id != ostettava.id));
            setOmatMuutos([ostettava, ...omatMuutos]);
            setRahat(rahat - ostettava.hinta);
            console.log(ostettava.nimi + " ostettu.");
            alert('Tämä toiminto ei ole vielä toimintakunnossa. Tällä hetkellä sovelluksen toimivat osat ovat: (1) Sisäänkirjautuminen, (2) Värvääminen, (3) Seikkailijoiden tietojen tarkastelu. Toimimattomia osia ovat: (4) Värvättyjen seikkailijoiden tietojen muuttaminen, (5) Kauppa.');
        }
    }

    const omat = omatMuutos.map(objekti => {
        return (
            <Typography component="form" key={objekti.nimi} id={objekti.id}
                onClick={valitseMyytava} variant='body2'
                sx={{
                    '&:hover': { backgroundColor: 'lightgray' },
                    padding: "5px 20px",
                    border: "1px solid black"
                }}>
                {objekti.nimi} <br />
                Vahinko: {objekti.vahinko} <br />
                Paino: {objekti.paino} <br />
                Tyyppi: {objekti.tyyppi} <br />
                Hinta: {objekti.hinta} <br />
            </Typography>
        );
    })

    const kaupan = kaupanMuutos.map(objekti => {
        return (
            <Typography component="form" key={objekti.nimi} id={objekti.id}
                onClick={valitseOstettava} variant='body2'
                sx={{
                    '&:hover': { backgroundColor: 'lightgray' },
                    padding: "5px 20px",
                    border: "1px solid black"
                }}>
                {objekti.nimi} <br />
                Vahinko: {objekti.vahinko} <br />
                Paino: {objekti.paino} <br />
                Tyyppi: {objekti.tyyppi} <br />
                Hinta: {objekti.hinta} <br />
            </Typography>
        );
    })

    useEffect(() => { fetchData() }, []);
    useEffect(() => {
        setOmatMuutos(varusteetOmat);
    }, [varusteetOmat]);
    useEffect(() => {
        setKaupanMuutos(varusteetKauppa);
    }, [varusteetKauppa]);

    return (
        <Stack
            direction="row"
            spacing={4}
            marginTop={2}
            marginX="auto"
            width="80vw"
            justifyContent="center">
            <Box>
                <Typography variant="body1">Omat tavarat</Typography>
                <Paper sx={{
                    height: "80vh",
                    overflowY: "scroll",
                    background: "#6b7a8a",
                    color: "black"
                }}>
                    {omat}
                </Paper>
            </Box>

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
                <Button color='tertiary' variant='outlined' onClick={osta}>Osta</Button>
                <br />
                <Button color='tertiary' variant='outlined' onClick={myy}>Myy</Button>
            </Box>

            <Box>
                <Typography variant="body1">Kaupan tavarat</Typography>
                <Paper sx={{
                    height: "80vh",
                    overflowY: "scroll",
                    background: "#6b7a8a",
                    color: "black"
                }}>
                    {kaupan}
                </Paper>
            </Box>
        </Stack>
    );
}
export default Kauppa;