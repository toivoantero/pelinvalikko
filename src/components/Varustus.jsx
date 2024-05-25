import { Grid, Box, FormControl, InputLabel, IconButton, Select, MenuItem, Card, CardHeader, CardMedia, CardContent, CardActions, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getHahmot, getVarusteetOmat, deleteHahmo } from './pelidata';
import { useLoaderData, Form, Link, redirect } from 'react-router-dom';

export async function VarustusLoader() {
    let hahmotResponse = await getHahmot();
    if (hahmotResponse.status === 400) {
        throw Error(hahmotResponse.message);
    }
    return { hahmotResponse };
}

function Varustus() {
    const { hahmotResponse } = useLoaderData();
    const hahmot = hahmotResponse.data;

    return (
        <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ padding: 4 }}
        >
            {hahmot.map(objekti => {
                let kuva = encodeURIComponent(objekti.kuva);
                return (
                    <Grid item key={objekti.id}
                        to={'/app/muokkaa/' + objekti.id + '/' + objekti.nimi + '/' + objekti.ammatti + '/' + objekti.ika + '/' + objekti.kokemuspisteet + '/' + objekti.ase + '/' + kuva}
                        component={Link}
                        sx={{textDecoration: 'none'}}
                    >
                        <Card
                            sx={{ background: "rgba(40,60,85,0.4)", '&:hover': { outline: '1px solid #FFCC33' } }}
                        >
                            <CardHeader
                                title={objekti.nimi} />

                            <CardContent>
                                {objekti.kuva ?
                                    <CardMedia sx={{ height: 'auto', width: 200 }}
                                        component='img'
                                        image={'/api/lataa/' + objekti.kuva}
                                        //image={'http://localhost:8080/lataa/' + objekti.kuva}
                                        alt={objekti.nimi} />
                                    :
                                    <Typography sx={{ height: 100, width: 200 }}>Ei kuvaa</Typography>}

                                <Typography>{objekti.ammatti}</Typography>
                                <Typography>Taso: {Math.floor(objekti.kokemuspisteet)}</Typography>
                                <Typography>Ikä: {objekti.ika}</Typography>
                                <Typography>Ase: {objekti.ase}</Typography>           
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