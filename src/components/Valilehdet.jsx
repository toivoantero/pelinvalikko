import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemText, Box, AppBar, Tabs, Tab, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Outlet } from "react-router-dom";

function Valilehdet() {
  const [value, setValue] = useState(0);

  const handleChange = (e, val) => {
    setValue(val);
  }

  const [ankkuriMenu, setMenuAuki] = useState(null);

  const menuAuki = (e) => {
    setMenuAuki(e.currentTarget);
  }

  const menuKiinni = () => {
    setMenuAuki(null);
  }

  const ilmoitus = () => {
    alert('Tämä toiminto ei ole vielä toimintakunnossa. Tällä hetkellä sovelluksen toimivat osat ovat: (1) Värvääminen, (2) Seikkailijoiden tietojen tarkastelu. Toimimattomia osia ovat: (3) Värvättyjen seikkailijoiden tietojen muuttaminen, (4) Kauppa, (5) ”Pelivalinnat”-valikko.');
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
            <ListItemText primary='Uusi peli' onClick={ilmoitus} />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Tallenna peli' onClick={ilmoitus} />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Lataa peli' onClick={ilmoitus} />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Palaa päävalikkoon' onClick={ilmoitus} />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Lopeta peli' onClick={ilmoitus} />
          </MenuItem>
        </Menu>

        <Tabs value={value} onChange={handleChange}
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