import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Stack, CardMedia, Typography, Select, Box, TextField, Button, InputLabel, MenuItem } from '@mui/material';
import { useParams } from 'react-router';
import { useLoaderData, Form } from 'react-router-dom';
import { useNavigation } from "react-router-dom";
import MessageRenderer from './MessageRenderer';
import { useIdentiteettiLogic } from '../hooks/useIdentiteettiLogic';

function Identiteetti() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const loaderData = useLoaderData();
    const varusteet = loaderData?.varusteet || [];
    let { id, nimi, ammatti, ika, kokemuspisteet, ase, kuva } = useParams();

    const initial = {
        id: id,
        nimi: nimi,
        ammatti: ammatti,
        kokemuspisteet: kokemuspisteet,
        ika: ika,
        ase: ase,
        kuva: kuva
    };

    const {
        seikkailija,
        setSeikkailija,
        aseVirhe,
        setAseVirhe,
        viesti,
        dialogivalinta,
        open,
        handleClose,
        muutaTieto,
        paivitaSeikkailija,
        poistaSeikkailija,
        strategiAseet,
        tiedustelijaAseet,
        ritariAseet
    } = useIdentiteettiLogic({ initialSeikkailija: initial, varusteet });

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={{ xs: 0, sm: 4 }}
            sx={{
                marginTop: 4,
                marginX: "auto",
                width: { xs: "80vw", sm: "10vw" },
                justifyContent: "center"
            }}
        >
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
                    sx={{
                        marginTop: 2,
                        marginX: "auto",
                        width: { xs: "40vw", lg: "25vw", xl: "20vw" },
                        justifyContent: "center"
                    }}
                >

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
                    <Button sx={{ marginTop: 4 }} color="primary" variant='outlined' onClick={() => poistaSeikkailija(seikkailija.id)}>Irtisano seikkailija pois ryhmästä</Button>
                </Box>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <MessageRenderer viesti={viesti} />
                        </DialogContentText>
                    </DialogContent>
                    {dialogivalinta && dialogivalinta.type === 'confirmDelete' ? (
                        <DialogActions>
                            <Form style={{ width: '100%' }} action='/app/poisto' method='post' onSubmit={handleClose}>
                                <input type='hidden' name='id' value={dialogivalinta.id} />
                                <Button style={{ margin: '0 30px' }} type='submit' color="tertiary" variant='outlined' disabled={isSubmitting} onClick={handleClose}>{isSubmitting ? "Irtisanotaan..." : "Irtisano"}</Button>
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
                    ) : dialogivalinta && dialogivalinta.type === 'close' ? (
                        <DialogActions>
                            <Button onClick={handleClose} autoFocus>Sulje</Button>
                        </DialogActions>
                    ) : null}
                </Dialog>
            </Stack>
        </Stack>
    );
}
export default Identiteetti;