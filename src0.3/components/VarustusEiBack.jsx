import { Grid, FormControl, InputLabel, Select, MenuItem, Card, CardHeader, CardMedia, CardContent, Typography } from '@mui/material';
import { useContext } from 'react';
import { HahmoContext } from '../App';

function Varustus() {

    const { hahmot, varusteetOmat } = useContext(HahmoContext);

    const aseValinta = (hahmo) => {
        if (hahmo.ammatti == "Tiedustelija") {
            return tiedustelijaAseet[Math.floor(Math.random() * tiedustelijaAseet.length)].nimi;
        } else if (hahmo.ammatti == "Ritari") {
            return ritariAseet[Math.floor(Math.random() * ritariAseet.length)].nimi;
        } else if (hahmo.ammatti == "Strategi") {
            return strategiAseet[Math.floor(Math.random() * strategiAseet.length)].nimi;
        }
    }

    let strategiAseet = varusteetOmat.filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5);
    let tiedustelijaAseet = varusteetOmat.filter(ase => ase.paino < 10);
    let ritariAseet = varusteetOmat.filter(ase => ase.paino > 8);

    return (
        <Grid
            className="custom-textfield"
            container
            spacing={4}
            justifyContent="center"
            sx={{ padding: 2 }}
        >
            {hahmot.map(objekti => {
                return (
                    <Grid item key={objekti.id}>
                        <Card sx={{ background: "rgba(40,60,85,0.4)"}}>
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
                                        MenuProps={{
                                            PaperProps: {
                                                sx: { backgroundColor: '#6b7a8a', color: 'white' }
                                            }
                                        }}
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
export default Varustus;