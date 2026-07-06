import { haeSeikkailijat, haeVarusteet, poistaSeikkailija } from '../services/pelidata';
import { redirect } from 'react-router-dom';

export async function VarustusLoader() {
  try {
    const res = await haeSeikkailijat();
    if (!res || res.status >= 400) throw new Error(res?.message || 'Palvelinvirhe');
    return { seikkailijat: res.data };
  } catch (err) {
    return { seikkailijat: [], loaderError: err.message };
  }
}

export async function YksiloLoader() {
  try {
    const res = await haeVarusteet();
    if (!res || res.status >= 400) throw new Error(res?.message || 'Palvelinvirhe');
    return { varusteet: res.data };
  } catch (err) {
    return { varusteet: [], loaderError: err.message };
  }
}

export async function PoistoAction({ request }) {
  const formData = await request.formData();
  const id = formData.get('id');
  const response = await poistaSeikkailija(id);
  if (response.status === 400) {
    throw Error(response.message);
  }

  return redirect('/app/varustus');
}