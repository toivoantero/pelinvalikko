import Valilehdet from './components/Valilehdet';
import LuoHahmo from './components/LuoHahmo';
import Hahmovalikko from './components/Hahmovalikko';
import Kauppa from './components/Kauppa';
import MuutaHahmo from './components/MuutaHahmo';

const hahmot = [
  {
    id: 1,
    nimi: 'Guillermo',
    ammatti: 'Ritari',
    ika: 39,
    kokemuspisteet: 11.453,
    kuva: 'kuvat/ritari.png',
  },
  {
    id: 2,
    nimi: 'Varis',
    ammatti: 'Tiedustelija',
    ika: 26,
    kokemuspisteet: 6.498,
    kuva: 'kuvat/tiedustelija.png',
  },
  {
    id: 3,
    nimi: 'Sibylla',
    ammatti: 'Strategi',
    ika: 42,
    kokemuspisteet: 10.223,
    kuva: 'kuvat/strategi.png',
  }
];

const varusteetOmat = [
  {
    id: 1,
    nimi: 'Hopeatikari',
    vahinko: 13,
    paino: 1,
    hinta: 95,
    tyyppi: 'Yhden käden',
  },
  {
    id: 2,
    nimi: 'Gladius',
    vahinko: 33,
    paino: 9,
    hinta: 129,
    tyyppi: 'Yhden käden',
  },
  {
    id: 3,
    nimi: 'Vastakaarijousi',
    vahinko: 21,
    paino: 2,
    hinta: 87,
    tyyppi: 'Kahden käden',
  },
  {
    id: 4,
    nimi: 'Paimensauva',
    vahinko: 11,
    paino: 3,
    hinta: 15,
    tyyppi: 'Kahden käden',
  },
  {
    id: 5,
    nimi: 'Claymore',
    vahinko: 51,
    paino: 15,
    hinta: 160,
    tyyppi: 'Kahden käden',
  },
  {
    id: 6,
    nimi: 'Rapiiri',
    vahinko: 20,
    paino: 2,
    hinta: 100,
    tyyppi: 'Yhden käden',
  },
  {
    id: 7,
    nimi: 'Kivi',
    vahinko: 5,
    paino: 2,
    hinta: 1,
    tyyppi: 'Yhden käden',
  }
  ,{
    id: 8,
    nimi: 'Hilpari',
    vahinko: 42,
    paino: 10,
    hinta: 90,
    tyyppi: 'Kahden käden',
  }
];

const varusteetKauppa = [
  {
    id: 1,
    nimi: 'Pronssitikari',
    vahinko: 11,
    paino: 1,
    hinta: 45,
    tyyppi: 'Yhden käden',
  },
  {
    id: 2,
    nimi: 'Paimenen linko',
    vahinko: 7,
    paino: 1,
    hinta: 5,
    tyyppi: 'Yhden käden',
  },
  {
    id: 3,
    nimi: 'Pronssimiekka',
    vahinko: 30,
    paino: 9,
    hinta: 80,
    tyyppi: 'Yhden käden',
  },
  {
    id: 4,
    nimi: 'Savupommi',
    vahinko: 10,
    paino: 3,
    hinta: 90,
    tyyppi: 'Yhden käden',
  }
];

function App() {
  return (
    <div>
      <Valilehdet hahmolista={hahmot} varusteetOmat={varusteetOmat} varusteetKauppa={varusteetKauppa} />
    </div>
  );
}

export default App
