import { useState } from 'react';
import { FormControl, Stack, CardMedia, Typography, Select, Box, TextField, Button, InputLabel, MenuItem } from '@mui/material';
import { useParams } from 'react-router';
import { getVarusteetOmat, deleteHahmo } from './pelidata';
import { useLoaderData, Form, redirect } from 'react-router-dom';

export async function PoistoAction({ request }) {
    const formData = await request.formData();
    let id = formData.get("id");
    const response = await deleteHahmo(id);

    if (response.status === 400 || response.status === 404) {
        throw Error(response.message);
    }
    return redirect('/varustus');
}

export async function YksiloLoader() {
    let varusteetResponse = await getVarusteetOmat();
    if (varusteetResponse.status === 400) {
        throw Error(varusteetResponse.message);
    }
    return { varusteetResponse };
}

function Identiteetti() {
    const { varusteetResponse } = useLoaderData();
    const varusteet = varusteetResponse.data;
    let strategiAseet = varusteet.filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5);
    let tiedustelijaAseet = varusteet.filter(ase => ase.paino < 10);
    let ritariAseet = varusteet.filter(ase => ase.paino > 8);

    let { id, nimi, ammatti, ika, kokemuspisteet, ase, kuva } = useParams();

    const [hahmo, setHahmo] = useState({
        id: id,
        nimi: nimi,
        ammatti: ammatti,
        kokemuspisteet: kokemuspisteet,
        ika: ika,
        ase: ase,
        kuva: kuva
    });

    const muutaTieto = (e) => {
        setHahmo({
            ...hahmo,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={4}
            marginTop={4}
            marginX="auto"
            width="80vw"
            justifyContent="center">
            <Box sx={{ background: "rgba(40,60,85,0)", textAlign: 'center', paddingTop: 2 }}>
                {hahmo.kuva ?
                    <CardMedia sx={{ height: 'auto', width: 200 }}
                        component='img'
                        //image={'/api/lataa/'
                        image={'http://localhost:8080/lataa/' + hahmo.kuva}
                        alt={hahmo.nimi} />
                    :
                    <Typography sx={{ height: 100, width: 200 }}>Ei kuvaa</Typography>}
                <Typography>Taso: {Math.floor(hahmo.kokemuspisteet)}</Typography>
                <Typography>Ikä: {hahmo.ika}</Typography>
            </Box>
            <Stack>
                <Box
                    className="custom-textfield"
                    component='form'
                    marginTop={2}
                    marginX="auto"
                    width="40vw"
                    justifyContent="center">

                    <TextField fullWidth name='nimi' label='Nimi' defaultValue={hahmo.nimi} placeholder={hahmo.nimi} />

                    <FormControl fullWidth>
                        <InputLabel id="ammatti-label">Ammatti</InputLabel>
                        <Select
                            labelId="ammatti-label"
                            id='ammatti'
                            label="Ammatti"
                            name='ammatti'
                            value={hahmo.ammatti}
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

                    <FormControl fullWidth>
                        <InputLabel id="ase-label">Ase</InputLabel>
                        <Select
                            labelId="ase-label"
                            id='ase'
                            label="Ase"
                            name='ase'
                            defaultValue={hahmo.ase}
                            onChange={muutaTieto}
                            MenuProps={{
                                PaperProps: {
                                    sx: { backgroundColor: '#6b7a8a', color: 'white' }
                                }
                            }}
                        >
                            {hahmo.ammatti === "Strategi" && strategiAseet.map((ase, index) => (
                                <MenuItem key={index} value={ase.nimi}>
                                    {ase.nimi}
                                </MenuItem>
                            ))}
                            {hahmo.ammatti === "Tiedustelija" && tiedustelijaAseet.map((ase, index) => (
                                <MenuItem key={index} value={ase.nimi}>
                                    {ase.nimi}
                                </MenuItem>
                            ))}
                            {hahmo.ammatti === "Ritari" && ritariAseet.map((ase, index) => (
                                <MenuItem key={index} value={ase.nimi}>
                                    {ase.nimi}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button color="secondary" variant='outlined'>Vahvista muutos</Button>
                </Box>
                <Form action='/poisto' method='post'>
                    <input type='hidden' name='id' value={hahmo.id} />
                    <Button type='submit' sx={{ marginTop: 4 }} color="primary" variant='outlined'>Irtisano seikkailija pois ryhmästä</Button>
                </Form>
            </Stack>
        </Stack>
    );
}
export default Identiteetti;