import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';

const Kirjautuminen = () => {
  const [kirjaudutaan, setKirjaudutaan] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [virheet, setVirheet] = useState([]);
  const [viesti, setViesti] = useState('');
  const [dialoginToiminnot, setDialoginToiminnot] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const kasitteleLahetys = async (e) => {
    e.preventDefault();
    setVirheet([]);
    if (username.length < 4 || password.length < 4) {
      setVirheet(['Nimen ja salasanan on oltava', 'vähintään neljä merkkiä pitkä.']);
      return;
    }
    if (kirjaudutaan) {
      // Login
      try {
        const response = await axios.post('/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        navigate('/app');
      } catch (err) {
        setVirheet(['Väärä nimi tai salasana.']);
      }
    } else {
      // Register
      try {
        const response = await axios.post('/api/auth/register', { username, password });
        setViesti('Rekisteröytyminen onnistui, nyt voit kirjautua.');
        setDialoginToiminnot(
          <DialogActions>
            <Button onClick={suljeDialogi} autoFocus>Sulje</Button>
          </DialogActions>
        );
        avaaDialogi();
        setKirjaudutaan(true);
      } catch (err) {
        setVirheet(['Rekisteröityminen epäonnistui.', 'Käyttäjänimi voi olla jo olemassa.']);
      }
    }
  };

  const [dialogiAuki, setDialogiAuki] = useState(false);

  const avaaDialogi = () => {
    setDialogiAuki(true);
  };

  const suljeDialogi = () => {
    setDialogiAuki(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      height: '90vh',
    }}>
      <div>
        <h2>{kirjaudutaan ? 'Sisäänkirjautuminen' : 'Rekisteröityminen'}</h2>
        <form style={{ marginTop: '30px', width: '280px' }} onSubmit={kasitteleLahetys}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ margin: '0 8px 8px 0', textAlign: 'right', height: '20px' }}>Nimi</label>
              <label style={{ margin: '0 8px 0 0', height: '20px' }}>Salasana</label>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', width: '100%' }}>
              <input
                style={{ height: '20px', margin: '0 0 8px 0' }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                style={{ height: '20px' }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button fullWidth type='submit' sx={{ margin: '30px 0 15px 0' }} variant='outlined' color="secondary">{kirjaudutaan ? 'Kirjaudu sisään' : 'Rekisteröidy'}</Button>
        </form>
        <Button fullWidth variant='outlined' color="primary" onClick={() => setKirjaudutaan(!kirjaudutaan)}>
          {kirjaudutaan ? 'Tarvitsetko rekisteröitymistä?' : 'Käyttäjätili jo tehtynä?'}
        </Button>
        {virheet.length > 0
          ? (<p style={{ color: 'white', height: '20px' }}>
            {virheet.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>)
          :
          <p style={{ height: '20px' }}></p>}
      </div>
      <Dialog
        open={dialogiAuki}
        onClose={suljeDialogi}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {viesti}
          </DialogContentText>
        </DialogContent>
        {dialoginToiminnot}
      </Dialog>
    </div>
  );
};

export default Kirjautuminen;
