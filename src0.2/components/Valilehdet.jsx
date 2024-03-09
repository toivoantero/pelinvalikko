import { useState } from 'react';
import { IconButton, Toolbar, Menu, MenuItem, List, ListItem, ListItemText, ListItemIcon, ListItemButton, Drawer, Box, AppBar, Tabs, Tab, } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import ListIcon from '@mui/icons-material/List';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';

import LuoHahmo from '../components/LuoHahmo';
import MuutaHahmo from '../components/MuutaHahmo';
import Hahmovalikko from '../components/Hahmovalikko';
import Kauppa from '../components/Kauppa';

function Valilehdet({ hahmolista, varusteetOmat, varusteetKauppa }) {
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

  return (
    <Box>
      <AppBar position='static' sx={{ flexDirection: "row" }}>

        <IconButton sx={{ color: "white" }} onClick={menuAuki}><MenuIcon /></IconButton>
        <Menu
          anchorEl={ankkuriMenu}
          open={Boolean(ankkuriMenu)}
          onClose={menuKiinni}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>

          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Uusi peli' />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Tallenna peli' />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Lataa peli' />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Palaa päävalikkoon' />
          </MenuItem>
          <MenuItem onClick={menuKiinni}>
            <ListItemText primary='Lopeta peli' />
          </MenuItem>
        </Menu>

        <Tabs value={value} onChange={handleChange}
          variant='fullWidth' centered textColor='inherit'
          sx={{ flexGrow: 1 }}>
          <Tab label='Luo hahmo' />
          <Tab label='Muuta hahmo' />
          <Tab label='Näytä hahmot' />
          <Tab label='Kauppa' />

        </Tabs>
      </AppBar>

      {value === 0 && <LuoHahmo />}
      {value === 1 && <MuutaHahmo />}
      {value === 2 && <Hahmovalikko varusteet={varusteetOmat} hahmolista={hahmolista} />}
      {value === 3 && <Kauppa varusteetOmat={varusteetOmat} varusteetKauppa={varusteetKauppa} />}
    </Box>
  )
}

export default Valilehdet;