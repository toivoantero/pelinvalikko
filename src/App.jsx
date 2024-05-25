import Valilehdet from './components/Valilehdet';
import Varvaa/*, { LomakeAction } */from './components/Varvaa';
import Varustus, { VarustusLoader } from './components/Varustus';
import Kauppa from './components/Kauppa';
import Identiteetti, { YksiloLoader, PoistoAction } from './components/Identiteetti';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { createContext, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { styled } from '@mui/system';
import './hahmovalikko.css';

export const HahmoContext = createContext();

const teema = createTheme({
  palette: {
    primary: { main: '#98a5b3', contrastText: '#FFFFFF' },
    secondary: { main: '#FFCC33', contrastText: '#FFFFFF' },
    tertiary: { main: 'rgb(255,255,255)', contrastText: '#FFFFFF' },
    text: { primary: '#FFCC33', secondary: '#FFCC33', contrastText: '#FFFFFF' },
    background: { default: 'rgb(0,0,0)' },
  },
  typography: {
    fontFamily: "'Tektur', cursive",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#98a5b3",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#6b7a8a',
          color: 'white',
        },
      },
    },
  },
});

export const PaperOpaque = styled(Paper)(() => ({
  width: "auto",
  background: "rgba(40,60,85,0.4)",
  padding: 3,
}));

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/app',
    element: <ProtectedRoute><Valilehdet /></ProtectedRoute>,
    children: [
      {
        path: '/app/',
        element: <Varvaa />,
      },
      {
        path: '/app/varvaa',
        element: <Varvaa />,
      },
      {
        path: '/app/varustus',
        element: <Varustus />,
        loader: VarustusLoader,
      },
      {
        path: '/app/poisto',
        action: PoistoAction,
      },
      {
        path: '/app/muokkaa/:id/:nimi/:ammatti/:ika/:kokemuspisteet/:ase/:kuva',
        element: <Identiteetti />,
        loader: YksiloLoader,
      },
      {
        path: '/app/kauppa',
        element: <Kauppa />,
      },
    ],
  },
]);

function App() {

  return (
    <div>
      <ThemeProvider theme={teema}>
        <CssBaseline />
          <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App
