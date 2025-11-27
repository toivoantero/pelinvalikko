import axios from 'axios';
/*
let palvelinSeikkailijat = 'https://pelivalikkoreactnode.onrender.com/api/seikkailija/';
let palvelinPelaaja = 'https://pelivalikkoreactnode.onrender.com/api/pelaaja/';
let palvelinVarusteet = 'https://pelivalikkoreactnode.onrender.com/api/varusteet/';
*/
let palvelinSeikkailijat = '/api/seikkailija/';
let palvelinPelaaja = '/api/pelaaja/';
let palvelinVarusteet = '/api/varusteet/';
let palvelinNimet = '/api/nimet/';

export const getSeikkailijat = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(palvelinSeikkailijat + 'all', config);
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}

export const getPelaaja = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(palvelinPelaaja + 'all', config);
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}

export const addSeikkailija = async (seikkailija) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(palvelinSeikkailijat + 'add', seikkailija, config);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Virhe lisäyksessä:', error.response.data || error.response.statusText);
    return { status: error.response.status, message: 'Lisäys ei onnistunut: ' + error.message };
  }
}

export const deleteSeikkailija = async (id) => {
  try {
    const response = await axios.delete(palvelinSeikkailijat + 'delete/' +  id);
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: error.response.status, message: 'Poisto ei onnistunut: ' + error.message })
  }
}

export const updateSeikkailija = async (id, data) => {
  try {
      const response = await axios.put(palvelinSeikkailijat + 'update/' + id, data);
      return ({ status: response.status, data: response.data });
  } catch (error) {
      return ({ status: error.response.status, message: 'Muokkaus ei onnistunut: ' + error.message })
  }
}

export const getVarusteet = async () => {
    try {
        const token = localStorage.getItem('token'); // Hae JWT-tunniste localStoragesta
        const response = await axios.get('/api/varusteet/all', {
            headers: {
                'Authorization': `Bearer ${token}` // Lisää JWT-tunniste pyyntöön
            }
        });
        return response;
    } catch (error) {
        console.error('Virhe haettaessa varusteita:', error);
        throw error;
    }
};

// hae nimet ulkoisesta API:sta
export const getNimet = async () => {
    try {
        const response = await axios.get(palvelinNimet);
        return response.data;
    } catch (error) {
        console.error('Nimien haku epäonnistui:', error);
        return { nainen: 'Megara', mies: 'Balthasar' };
    }
};

export const updateVarusteet = async (id, data) => {
  try {
      const response = await axios.put(palvelinVarusteet + 'update/' + id, data);
      return ({ status: response.status, data: response.data });
  } catch (error) {
      return ({ status: error.response.status, message: 'Muokkaus ei onnistunut: ' + error.message })
  }
}
