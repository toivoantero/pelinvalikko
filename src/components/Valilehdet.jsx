import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemText, Box, AppBar, Tabs, Tab, Typography, Button, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Outlet, useNavigate } from "react-router-dom";

function Valilehdet() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const kasitteleMuutos = (e, val) => {
    setValue(val);
  }

  const [ankkuriMenu, setMenuAuki] = useState(null);

  const menuAuki = (e) => {
    setMenuAuki(e.currentTarget);
  }

  const menuKiinni = () => {
    setMenuAuki(null);
  }

  const uusiPeli = () => {
    navigate('/login');
  }

  return (
    <Box>
      <AppBar position='static' sx={{ flexDirection: "row", backgroundColor: "rgb(12,17,25)" }}>

        <IconButton sx={{ color: "rgb(220,220,220)", fontSize: "16px" }} onClick={menuAuki}>Pelivalinnat<MenuIcon /></IconButton>
        <Menu
          anchorEl={ankkuriMenu}
          open={Boolean(ankkuriMenu)}
          onClose={menuKiinni}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Lopeta peli' onClick={uusiPeli} />
          </MenuItem>
        </Menu>

        <Tabs value={value} onChange={kasitteleMuutos}
          variant='fullWidth' centered textColor='inherit'
          sx={{ flexGrow: 1 }}>
          <Tab component={Link} to='varvaa' label='Värvää' />
          <Tab component={Link} to='varustus' label='Seikkailijat' />
          <Tab component={Link} to='kauppa' label='Kauppa' />

        </Tabs>
      </AppBar>
      <Outlet />
    </Box>
  )
}

export default Valilehdet;