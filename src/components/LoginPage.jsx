import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);
  const [viesti, setViesti] = useState('');
  const [dialogivalinta, setDialogivalinta] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    if (username.length < 4 || password.length < 4) {
      setError(['Nimen ja salasanan on oltava', 'vähintään neljä merkkiä pitkä.']);
      return;
    }
    if (isLogin) {
      // Login
      try {
        const response = await axios.post('/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        navigate('/app');
      } catch (err) {
        setError(['Väärä nimi tai salasana.']);
      }
    } else {
      // Register
      try {
        const response = await axios.post('/api/register', { username, password });
        setViesti('Rekisteröytyminen onnistui, nyt voit kirjautua.');
        setDialogivalinta(
          <DialogActions>
            <Button onClick={handleClose} autoFocus>Sulje</Button>
          </DialogActions>
        );
        handleClickOpen();
        setIsLogin(true);
      } catch (err) {
        setError(['Rekisteröityminen epäonnistui.', 'Käyttäjänimi voi olla jo olemassa.']);
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        <h2>{isLogin ? 'Sisäänkirjautuminen' : 'Rekisteröityminen'}</h2>
        <form style={{ marginTop: '30px', width: '280px' }} onSubmit={handleSubmit}>
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
          <Button fullWidth type='submit' sx={{ margin: '30px 0 15px 0' }} variant='outlined' color="secondary">{isLogin ? 'Kirjaudu sisään' : 'Rekisteröidy'}</Button>
        </form>
        <Button fullWidth variant='outlined' color="primary" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Tarvitsetko rekisteröitymistä?' : 'Käyttäjätili jo tehtynä?'}
        </Button>
        {error.length > 0
          ? (<p style={{ color: 'white', height: '20px' }}>
            {error.map((line, index) => (
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
    </div>
  );
};

export default LoginPage;
