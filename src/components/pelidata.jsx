import axios from 'axios';

let palvelinSeikkailijat = 'https://pelivalikkoreactnode.onrender.com/api/seikkailija/';
let palvelinPelaaja = 'https://pelivalikkoreactnode.onrender.com/api/pelaaja/';
let palvelinVarusteet = 'https://pelivalikkoreactnode.onrender.com/api/varusteet/';
/*
let palvelinSeikkailijat = 'http://localhost:8080/api/seikkailija/';
let palvelinPelaaja = '/api/pelaaja/';
let palvelinVarusteet = '/api/varusteet/';
*/
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

export const getNimet = async () => {
    try {
        const [respNainen, respMies] = await Promise.all([
            axios.get('https://fantasyname.lukewh.com/?gender=f'),
            axios.get('https://fantasyname.lukewh.com/?gender=m')
        ]);

        const parseNimi = (data) => {
            if (!data) return '';
            if (Array.isArray(data) && data.length > 0) return data[0];
            if (typeof data === 'object' && data.name) return data.name;
            if (typeof data === 'string') return data;
            return '';
        };

        const nimiNainen = parseNimi(respNainen.data);
        const nimiMies = parseNimi(respMies.data);

        return {
            nainen: nimiNainen || 'Megara',
            mies: nimiMies || 'Balthasar'
        };
    } catch (error) {
        console.error('Fantasy name API error:', error?.message || error);
        return {
            nainen: 'Megara',
            mies: 'Balthasar'
        };
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
