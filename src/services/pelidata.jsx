import axios from 'axios';

let palvelinSeikkailijat = 'https://pelivalikkoreactnode.onrender.com/api/seikkailija/';
let palvelinPelaaja = 'https://pelivalikkoreactnode.onrender.com/api/pelaaja/';
let palvelinVarusteet = 'https://pelivalikkoreactnode.onrender.com/api/varusteet/';
let palvelinNimet = 'https://pelivalikkoreactnode.onrender.com/api/nimet/';
/*
let palvelinSeikkailijat = '/api/seikkailija/';
let palvelinPelaaja = '/api/pelaaja/';
let palvelinVarusteet = '/api/varusteet/';
let palvelinNimet = '/api/nimet/';
*/
const tunnisteAsetukset = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const haeSeikkailijat = async () => {
  try {
    const response = await axios.get(palvelinSeikkailijat + 'all', tunnisteAsetukset());
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}

export const haePelaaja = async () => {
  try {
    const response = await axios.get(palvelinPelaaja + 'all', tunnisteAsetukset());
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}

export const lisaaSeikkailija = async (seikkailija) => {
  try {
    const response = await axios.post(palvelinSeikkailijat + 'add', seikkailija, tunnisteAsetukset());
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Virhe lisäyksessä:', error.response.data || error.response.statusText);
    return { status: error.response.status, message: 'Lisäys ei onnistunut: ' + error.message };
  }
}

export const poistaSeikkailija = async (id) => {
  try {
    const response = await axios.delete(palvelinSeikkailijat + 'delete/' + id, tunnisteAsetukset());
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Poisto ei onnistunut: ' + error.message })
  }
}

export const paivitaSeikkailija = async (id, data) => {
  try {
    const response = await axios.put(palvelinSeikkailijat + 'update/' + id, data, tunnisteAsetukset());
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Muokkaus ei onnistunut: ' + error.message })
  }
}

export const haeVarusteet = async () => {
  try {
    const response = await axios.get(palvelinVarusteet + 'all', tunnisteAsetukset());
    return response;
  } catch (error) {
    console.error('Virhe haettaessa varusteita:', error);
    throw error;
  }
};

export const haeNimet = async () => {
  try {
    const response = await axios.get(palvelinNimet);
    return response.data;
  } catch (error) {
    console.error('Nimien haku epäonnistui:', error);
    return { nainen: 'Megara', mies: 'Balthasar' };
  }
};

export const paivitaVarusteet = async (id, data) => {
  try {
    const response = await axios.put(palvelinVarusteet + 'update/' + id, data, tunnisteAsetukset());
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Muokkaus ei onnistunut: ' + error.message })
  }
}
