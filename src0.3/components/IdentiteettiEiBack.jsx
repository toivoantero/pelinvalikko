import { useState } from 'react';
import { FormControl, Select, Box, TextField, Button, InputLabel, MenuItem } from '@mui/material';

function Identiteetti() {

    const [ammatti, setAmmatti] = useState('');

    const muutaTieto = (e) => {
        setAmmatti(e.target.value);
    }

    return (
        <Box
            className="custom-textfield"
            component='form'
            marginTop={2}
            marginX="auto"
            width="40vw"
            justifyContent="center">

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
                    MenuProps={{
                        PaperProps: {
                            sx: { backgroundColor: '#6b7a8a', color: 'white' }
                        }
                    }}
                >
                    <MenuItem value="Ritari">Ritari</MenuItem>
                    <MenuItem value="Tiedustelija">Tiedustelija</MenuItem>
                    <MenuItem value="Strategi">Strategi</MenuItem>
                </Select>
            </FormControl>

            <Button sx={{ marginTop: 4 }} color="secondary" variant='outlined'>Muuta</Button>
        </Box>
    );
}
export default Identiteetti;