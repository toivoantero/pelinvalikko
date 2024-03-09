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

function MuutaHahmo() {

    const [ammatti, setAmmatti] = useState('');

    const muutaTieto = (e) => {
        setAmmatti(e.target.value);
    }

    return (
        <Box
            container
            component='form'
            m="auto"
            justifyContent="center"
            sx={{
                '& .MuiTextField-root': { marginBottom: 2 },
                padding: 2,
                width: "40vw"
            }}>
            
                <TextField fullWidth label='Nimi' name='nimi' />

                <FormControl fullWidth>
                    <InputLabel id="ammatti-label">Ammatti</InputLabel>
                    <Select
                        labelId="ammatti-label"
                        id='ammatti'
                        label="Ammatti"
                        name='ammatti'
                        value={ammatti}
                        onChange={muutaTieto}
                    >
                        <MenuItem value="Ritari">Ritari</MenuItem>
                        <MenuItem value="Tiedustelija">Tiedustelija</MenuItem>
                        <MenuItem value="Strategi">Strategi</MenuItem>
                    </Select>
                </FormControl>

                <Button sx={{ marginTop: 4 }} variant='outlined'>Muuta</Button>
        </Box>
    );
}
export default MuutaHahmo;