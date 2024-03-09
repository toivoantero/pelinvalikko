import { useState } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button, CardActions, Card, CardHeader, CardMedia, CardContent, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Hahmovalikko({ hahmolista, varusteet }) {

    const aseValinta = (hahmo) => {
        if (hahmo.ammatti == "Tiedustelija") {
            return tiedustelijaAseet[Math.floor(Math.random() * tiedustelijaAseet.length)].nimi;
        } else if (hahmo.ammatti == "Ritari") {
            return ritariAseet[Math.floor(Math.random() * ritariAseet.length)].nimi;
        } else if (hahmo.ammatti == "Strategi") {
            return strategiAseet[Math.floor(Math.random() * strategiAseet.length)].nimi;
        }
    }

    let strategiAseet = varusteet.filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5);
    let tiedustelijaAseet = varusteet.filter(ase => ase.paino < 10);
    let ritariAseet = varusteet.filter(ase => ase.paino > 8);

    return (
        <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ padding: 2 }}
        >
            {hahmolista.map(objekti => {
                return (
                    <Grid item key={objekti.id}>
                        <Card>
                            <CardHeader
                                title={objekti.nimi} />

                            <CardContent>
                                {
                                    objekti.kuva ?
                                        <CardMedia sx={{ height: 'auto', width: 200 }}
                                            component='img'
                                            image={objekti.kuva}
                                            alt={objekti.nimi} />
                                        :
                                        <Typography sx={{ height: 100, width: 200 }}>Ei kuvaa</Typography>}

                                <Typography>{objekti.ammatti}</Typography>
                                <Typography>Taso: {Math.floor(objekti.kokemuspisteet)}</Typography>
                                <Typography>Ikä: {objekti.ika}</Typography>

                                <FormControl fullWidth>
                                    <InputLabel id="ase-label">Ase</InputLabel>
                                    <Select
                                        labelId="ase-label"
                                        id='ase'
                                        label="Ase"
                                        value=""
                                    >
                                        <MenuItem value={aseValinta(objekti)}>{aseValinta(objekti)}</MenuItem>
                                        <MenuItem value="Puumiekka">Puumiekka</MenuItem>
                                        <MenuItem value="Paimenen linko">Paimenen linko</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                )
            })
            }
        </Grid>
    );
}
export default Hahmovalikko;