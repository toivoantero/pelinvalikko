import axios from 'axios';

let palvelinHahmot = 'http://localhost:8080/hahmo/';
let palvelinVarusteetOmat = 'http://localhost:8080/omatvarusteet/';
let palvelinVarusteetKaupan = 'http://localhost:8080/kaupanvarusteet/';

export const getHahmot = async () => {
  try {
    const response = await axios.get(palvelinHahmot + 'all');
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}

export const addHahmo = async (hahmo) => {
  try {
    const response = await axios.post(palvelinHahmot + 'add', hahmo);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Virhe lisäyksessä:', error.response.data || error.response.statusText);
    return { status: error.response.status, message: 'Lisäys ei onnistunut: ' + error.message };
  }
}

export const deleteHahmo = async (id) => {
  try {
    const response = await axios.delete(palvelinHahmot + 'delete/' +  id);
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: response.status, message: 'Poisto ei onnistunut: ' + error.message })
  }
}

export const getVarusteetOmat = async () => {
  try {
    const response = await axios.get(palvelinVarusteetOmat + 'all');
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}

export const getVarusteetKaupan = async () => {
  try {
    const response = await axios.get(palvelinVarusteetKaupan + 'all');
    return ({ status: response.status, data: response.data });
  } catch (error) {
    return ({ status: response.status, message: 'Haku ei onnistunut: ' + error.message });
  }
}
