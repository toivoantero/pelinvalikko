import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Stack, CardMedia, Typography, Select, Box, TextField, Button, InputLabel, MenuItem } from '@mui/material';
import { useParams } from 'react-router';
import { getVarusteet, deleteSeikkailija, updateSeikkailija } from './pelidata';
import { useLoaderData, Form, redirect } from 'react-router-dom';

export async function PoistoAction({ request }) {
    const formData = await request.formData();
    let id = formData.get("id");
    const response = await deleteSeikkailija(id);

    if (response.status === 400 || response.status === 404) {
        throw Error(response.message);
    }
    return redirect('/app/varustus');
}

export async function YksiloLoader() {
    let varusteetResponse = await getVarusteet();
    if (varusteetResponse.status === 400) {
        throw Error(varusteetResponse.message);
    }
    return { varusteetResponse };
}

function Identiteetti() {
    const { varusteetResponse } = useLoaderData();
    const varusteet = varusteetResponse.data;
    const [viesti, setViesti] = useState('');
    const [aseVirhe, setAseVirhe] = useState(false);
    const [dialogivalinta, setDialogivalinta] = useState('');
    let strategiAseet = varusteet.filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5 && ase.omistaja === 'pelaaja');
    let tiedustelijaAseet = varusteet.filter(ase => ase.paino < 10 && ase.omistaja === 'pelaaja');
    let ritariAseet = varusteet.filter(ase => ase.paino > 8 && ase.omistaja === 'pelaaja');

    let { id, nimi, ammatti, ika, kokemuspisteet, ase, kuva } = useParams();

    const [seikkailija, setSeikkailija] = useState({
        id: id,
        nimi: nimi,
        ammatti: ammatti,
        kokemuspisteet: kokemuspisteet,
        ika: ika,
        ase: ase,
        kuva: kuva
    });

    const muutaTieto = (e) => {
        const { name, value } = e.target;

        setSeikkailija((prevSeikkailija) => {
            let uusiAse = prevSeikkailija.ase;

            if (name === 'ammatti') {
                const sallitutAseet = value === "Strategi" ? strategiAseet.map(ase => ase.nimi) :
                    value === "Tiedustelija" ? tiedustelijaAseet.map(ase => ase.nimi) :
                        value === "Ritari" ? ritariAseet.map(ase => ase.nimi) : [];

                if (!sallitutAseet.includes(prevSeikkailija.ase)) {
                    uusiAse = '-';
                }
            }

            return {
                ...prevSeikkailija,
                [name]: value,
                ...(name === 'ammatti' && { ase: uusiAse })
            };
        });
    };

    const paivitaSeikkailija = async () => {
        if (seikkailija.ase === '-') {
            setAseVirhe(true);
            setViesti('Seikkailijalle on valittava ase.');
            setDialogivalinta(
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Sulje</Button>
                </DialogActions>
            );
            handleClickOpen();
            return;
        }

        try {
            const response = await updateSeikkailija(seikkailija.id, seikkailija);
            if (response.status === 200) {
                setAseVirhe(false);
                setViesti('Seikkailijan tiedot ovat nyt muutetut');
                setDialogivalinta(
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>Sulje</Button>
                    </DialogActions>
                );
                handleClickOpen();
            } else {
                alert('Päivitys epäonnistui: ' + response.message);
            }
        } catch (error) {
            console.error('Virhe päivitettäessä tietokantaa:', error);
        }
    };

    const poistaSeikkailija = async () => {
        setViesti('Irtisanotaanko seikkailija?');
        setDialogivalinta(
            <DialogActions>
                <Form style={{ width: '100%' }} action='/app/poisto' method='post'>
                    <input type='hidden' name='id' value={seikkailija.id} />
                    <Button style={{ margin: '0 30px' }} type='submit' color="tertiary" variant='outlined'>Irtisano</Button>
                    <Button
                        style={{ float: 'right', margin: '0 30px' }}
                        type='reset'
                        onClick={handleClose}
                        color="tertiary"
                        variant='outlined'
                        autoFocus>
                        Peru
                    </Button>
                </Form>
            </DialogActions>
        );
        handleClickOpen();
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={{xs: 0, sm: 4}}
            marginTop={4}
            marginX="auto"
            width={{xs: "80vw", sm: "10vw"}}
            justifyContent="center">
            <Box sx={{ background: "rgba(40,60,85,0)", textAlign: 'center', paddingTop: 2 }}>
                {seikkailija.kuva ?
                    <CardMedia sx={{ height: 'auto', width: 200 }}
                        component='img'
                        image={'/api/lataa/' + seikkailija.kuva}
                        alt={seikkailija.nimi} />
                    :
                    <Typography sx={{ height: 100, width: 200 }}>Ei kuvaa</Typography>}
                <Typography>Taso: {Math.floor(seikkailija.kokemuspisteet)}</Typography>
                <Typography>Ikä: {seikkailija.ika}</Typography>
            </Box>
            <Stack>
                <Box
                    className="custom-textfield"
                    component='form'
                    marginTop={2}
                    marginX="auto"
                    width={{xs: "40vw", lg: "25vw", xl: "20vw"}}
                    justifyContent="center">

                    <TextField
                        fullWidth
                        name='nimi'
                        label='Nimi'
                        value={seikkailija.nimi}
                        onChange={muutaTieto}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="ammatti-label">Ammatti</InputLabel>
                        <Select
                            labelId="ammatti-label"
                            id='ammatti'
                            label="Ammatti"
                            name='ammatti'
                            value={seikkailija.ammatti}
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

                    <FormControl fullWidth error={aseVirhe}>
                        <InputLabel id="ase-label">Ase</InputLabel>
                        <Select
                            labelId="ase-label"
                            id='ase'
                            label="Ase"
                            name='ase'
                            value={seikkailija.ase || ''}
                            onChange={(e) => {
                                muutaTieto(e);
                                setAseVirhe(false);
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: { backgroundColor: '#6b7a8a', color: 'white' }
                                }
                            }}
                        >
                            <MenuItem value="" disabled></MenuItem>
                            {seikkailija.ammatti === "Strategi" && strategiAseet.map((ase, index) => (
                                <MenuItem key={index} value={ase.nimi}>
                                    {ase.nimi}
                                </MenuItem>
                            ))}
                            {seikkailija.ammatti === "Tiedustelija" && tiedustelijaAseet.map((ase, index) => (
                                <MenuItem key={index} value={ase.nimi}>
                                    {ase.nimi}
                                </MenuItem>
                            ))}
                            {seikkailija.ammatti === "Ritari" && ritariAseet.map((ase, index) => (
                                <MenuItem key={index} value={ase.nimi}>
                                    {ase.nimi}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button color="secondary" variant='outlined' onClick={paivitaSeikkailija}>Vahvista muutos</Button>
                </Box>

                <Box>
                    <Button sx={{ marginTop: 4 }} color="primary" variant='outlined' onClick={poistaSeikkailija}>Irtisano seikkailija pois ryhmästä</Button>
                </Box>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {viesti}
                        </DialogContentText>
                    </DialogContent>
                    {dialogivalinta}
                </Dialog>
            </Stack>
        </Stack>
    );
}
export default Identiteetti;