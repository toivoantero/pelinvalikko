import { FormControl, Stack, CardMedia, Select, Slider, Box, TextField, Button, InputLabel, Typography, MenuItem } from '@mui/material';
import { PaperOpaque } from '../App';
import { Form } from 'react-router-dom';
import { useVarvaaData } from '../hooks/useVarvaaData';
import { useVarvaaLogiikka } from '../hooks/useVarvaaLogiikka';
import ViestiNakyma from './ViestiNakyma';

function Varvaa() {
    const { aseet, seikkailijat, nimet, ladataan, virhe, setSeikkailijat } = useVarvaaData();
    const {
      seikkailija,
      setSeikkailija,
      toimintoKesken,
      setToimintoKesken,
      viesti,
      naytaKuva,
      lisatty,
      varvaaSeikkailija,
      kasitteleKentanMuutos,
      merkitseLisatyksi,
    } = useVarvaaLogiikka({ aseet, seikkailijat, nimet, setSeikkailijat });

    if (ladataan) {
      return <Typography sx={{ color: 'white', textAlign: 'center', marginTop: 4 }}>Ladataan...</Typography>;
    }

    if (virhe) {
      return <Typography sx={{ color: '#FF3333', textAlign: 'center', marginTop: 4 }}>Virhe: {virhe.message || String(virhe)}</Typography>;
    }

    const kasitteleLahetys = async (e) => {
        e.preventDefault();
        if (toimintoKesken) return;
        setToimintoKesken(true);
        try {
            await varvaaSeikkailija();
        } finally {
            setToimintoKesken(false);
        }
    };

    return (
        <Stack
            className="custom-textfield"
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            sx={{ marginTop: 2, marginX: "auto", width: "80vw", justifyContent: "center" }}
            >
            <Form onSubmit={kasitteleLahetys} encType='multipart/form-data'>
                <Box sx={{ width: { xs: '40vw', sm: '30vw' } }}>
                    <Typography sx={{ paddingTop: 2, paddingBottom: 4 }}>Valitse mitä ammattia haluat<br></br>seikkailijasi edustavan<br></br>ja minkä ikäinen hän on.</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="ammatti-label">Ammatti</InputLabel>
                        <Select
                            labelId="ammatti-label"
                            id='ammatti'
                            label="Ammatti"
                            name='ammatti'
                            value={seikkailija.ammatti}
                            onChange={kasitteleKentanMuutos}
                        >
                            <MenuItem value="Ritari">Ritari</MenuItem>
                            <MenuItem value="Tiedustelija">Tiedustelija</MenuItem>
                            <MenuItem value="Strategi">Strategi</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography sx={{ padding: 2 }}>Ikä</Typography>

                    <Slider
                        name='ika'
                        min={15}
                        max={100}
                        value={seikkailija.ika}
                        onChange={kasitteleKentanMuutos}>
                    </Slider>

                    <Button type='submit' sx={{ marginTop: 4 }} variant='outlined' color="secondary" onClick={merkitseLisatyksi}>Värvää</Button>
                </Box>
            </Form>

            <PaperOpaque sx={{ minWidth: '148px', width: { xs: '100%', sm: 400 } }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', minWidth: { xs: '100%', sm: 400 } }}>
                    {naytaKuva == true ?
                        <Box sx={{ height: { xs: '50%', sm: 'auto' }, margin: { xs: '20px 0', sm: 0 } }}>
                            {seikkailija.kuva ?
                                <CardMedia sx={{ height: { xs: '100%', sm: 'auto' }, width: { xs: '90%', sm: 200 } }}
                                    component='img'
                                    image={'/api/lataa/' + seikkailija.kuva}
                                    //image={'http://localhost:8080/lataa/' + seikkailija.kuva}
                                    alt={seikkailija.nimi}
                                />
                                :
                                <CardMedia sx={{ height: { xs: '100%', sm: 'auto' }, width: { xs: '90%', sm: 200 } }}
                                    component='img'
                                    image={'/api/lataa/' + lisatty[lisatty.length - 1].kuva}
                                    //image={'http://localhost:8080/lataa/' + lisatty[lisatty.length - 1].kuva}
                                    alt={seikkailija.nimi}
                                />
                            }
                        </Box>
                        :
                        <Box sx={{ height: 'auto', width: 'auto' }}></Box>
                    }
                    <Box sx={{ height: { xs: '100%', sm: 'auto' }, margin: { xs: '0 20px', sm: 0 } }}>
                        <ViestiNakyma viesti={viesti} />
                    </Box>

                </Box>
            </PaperOpaque>
        </Stack>
    );
}

export default Varvaa;

