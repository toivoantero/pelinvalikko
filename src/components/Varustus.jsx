import { Grid, Box, FormControl, InputLabel, IconButton, Select, MenuItem, Card, CardHeader, CardMedia, CardContent, CardActions, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSeikkailijat, getVarusteet, deleteSeikkailija } from '../services/pelidata';
import { useLoaderData, Form, Link, redirect } from 'react-router-dom';

function Varustus() {
    const loaderData = useLoaderData();
    const seikkailijat = loaderData?.seikkailijat || [];

    return (
        <Grid
            container
            sx={{ padding: "32px", justifyContent: 'center', gap: "32px" }}
        >
            {seikkailijat.map(objekti => {
                let kuva = encodeURIComponent(objekti.kuva);
                return (
                    <Grid key={objekti.id}>
                        <Link
                            to={`/app/muokkaa/${objekti.id}/${objekti.nimi}/${objekti.ammatti}/${objekti.ika}/${objekti.kokemuspisteet}/${objekti.ase}/${kuva}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
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
                        </Link>
                    </Grid>
                )
            })
            }
        </Grid>
    );
}
export default Varustus;