import { useState } from 'react';
import { useEffect } from 'react';
import { FormControl, Stack, Switch, Select, Slider, Paper, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';

function Kauppa({ varusteetOmat, varusteetKauppa }) {

    const [myytava, setMyytava] = useState(null);
    const [ostettava, setOstettava] = useState(null);
    const [omatMuutos, setOmatMuutos] = useState([]);
    const [kaupanMuutos, setKaupanMuutos] = useState([]);
    const [rahat, setRahat] = useState(1000);

    useEffect(() => {
        setOmatMuutos(varusteetOmat);
    }, []);
    useEffect(() => {
        setKaupanMuutos(varusteetKauppa);
    }, []);

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
        }
    }
    const osta = () => {
        if (ostettava != null) {
            setKaupanMuutos(kaupanMuutos.filter(varuste => varuste.id != ostettava.id));
            setOmatMuutos([ostettava, ...omatMuutos]);
            setRahat(rahat - ostettava.hinta);
            console.log(ostettava.nimi + " ostettu.");
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

    return (
        <Stack
            direction="row"
            spacing={4}
            m="auto"
            justifyContent="center"
            width="80vw"
            sx={{
                '& .MuiTextField-root': { marginBottom: 2 },
                padding: 2,
            }}>
            <Box>
                <Typography variant="body1">Omat tavarat</Typography>
                <Paper style={{ height: "80vh", overflowY: "scroll" }}>
                    {omat}
                </Paper>
            </Box>

            <Box
                container
                width="15vw"
                sx={{
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Typography padding="0 0 30px 0">{rahat} kultaa</Typography>
                <Button variant='outlined' onClick={osta}>Osta</Button>
                <br />
                <Button variant='outlined' onClick={myy}>Myy</Button>
            </Box>

            <Box>
                <Typography variant="body1">Kaupan tavarat</Typography>
                <Paper sx={{ height: "80vh", overflowY: "scroll" }}>
                    {kaupan}
                </Paper>
            </Box>
        </Stack>
    );
}
export default Kauppa;