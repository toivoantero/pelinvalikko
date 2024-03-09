import { useState } from 'react';
import { FormControl, Stack, Switch, Select, Slider, Paper, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ClearIcon from '@mui/icons-material/Clear';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fi from 'date-fns/locale/fi';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function LuoHahmo() {
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
            direction="row"
            spacing={4}
            m="auto"
            justifyContent="center"
            sx={{
                '& .MuiTextField-root': { marginBottom: 2 },
                padding: 2,
                width: "80vw"
            }}>
            <Box sx={{ width: "40%" }} component='form'>
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

                <Button sx={{ marginTop: 4 }} variant='outlined' onClick={lisaaHahmo} >Lisää</Button>
            </Box>

            <Paper sx={{ width: "40%", background: "rgb(251,251,255)", padding: 3 }}>
                <Typography sx={{ color: "crimson" }}>{viesti}</Typography>

                {lisatty.length > 0 && (
                    <Box>
                        <Typography>Nimi: {lisatty[lisatty.length - 1].nimi}</Typography>
                        <Typography>Ammatti: {lisatty[lisatty.length - 1].ammatti}</Typography>
                        <Typography>Ikä: {lisatty[lisatty.length - 1].ika}</Typography>
                        <Typography>Taso: {Math.floor(lisatty[lisatty.length - 1].kokemuspisteet)}</Typography>
                    </Box>
                )}
            </Paper>
        </Stack>
    );
}
export default LuoHahmo;