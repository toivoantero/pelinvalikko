import { useState } from 'react';
import { FormControl, Stack, Select, Slider, Paper, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';

function Varvaa() {
    const [hahmo, setHahmo] = useState({ nimi: '', ammatti: '', ika: 30, kokemuspisteet: 1.74 });
    const [lisatty, setLisatty] = useState([]);
    const [viesti, setViesti] = useState('');

    const muutaTieto = (e) => {
        setHahmo({ ...hahmo, [e.target.name]: e.target.value });
    }

    const lisaaHahmo = () => {
        if (lisatty.length < 4) {
            setLisatty([...lisatty, hahmo]);
            setViesti('Lisätty: ');
        } else {
            setViesti('Hahmoja ei voi luoda enempää, kuin 4.');
        }
        setHahmo({ nimi: '', ammatti: '', ika: 30, kokemuspisteet: 1.74 });
    }

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={4}
            marginTop={2}
            marginX="auto"
            width="80vw"
            justifyContent="center">
            <Box width="40%" component='form'>
                <TextField fullWidth label='Nimi' name='nimi'
                    value={hahmo.nimi}
                    onChange={muutaTieto} />

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
                    label="jioij"
                    name='ika'
                    min={15}
                    max={100}
                    value={hahmo.ika}
                    onChange={muutaTieto}>
                </Slider>

                <Button sx={{ marginTop: 4 }} variant='outlined' color="secondary" onClick={lisaaHahmo} >Lisää</Button>
            </Box>

            <PaperOpaque>
                <Typography sx={{ color: "#FFCC33" }}>{viesti}</Typography>

                {lisatty.length > 0 && (
                    <Box sx={{ color: 'white' }}>
                        <Typography>Nimi: {lisatty[lisatty.length - 1].nimi}</Typography>
                        <Typography>Ammatti: {lisatty[lisatty.length - 1].ammatti}</Typography>
                        <Typography>Ikä: {lisatty[lisatty.length - 1].ika}</Typography>
                        <Typography>Taso: {Math.floor(lisatty[lisatty.length - 1].kokemuspisteet)}</Typography>
                    </Box>
                )}
            </PaperOpaque>
        </Stack>
    );
}
export default Varvaa;