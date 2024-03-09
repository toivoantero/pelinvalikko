import { useState } from 'react';

function LuoHahmo() {
    const [hahmo, setHahmo] = useState({ nimi: '', ammatti: '', ika: 30, kokemuspisteet: 1.74 });
    const [lisatty, setLisatty] = useState([]);
    const [viesti, setViesti] = useState('');

    const muutaNimiIka = (e) => {
        setHahmo({ ...hahmo, [e.target.name]: e.target.value.toUpperCase() });
    }
    const muutaAmmatti = (e) => {
        setHahmo({ ...hahmo, ammatti: e.target.value });
    }
  
    const lisaaHahmo = () => {
        if (lisatty.length < 4) {
            setLisatty([...lisatty, hahmo]);
            setViesti('Lisätty: ');
        } else {
            setViesti('Hahmoja ei voi luoda enempää, kuin 4.');
        }
        setHahmo({ nimi: '', ammatti: '', ika: 30, kokemuspisteet: 1.74 });
    }

    return (
        <div>
        <div style={{padding:"20px", display:"flex", flexDirection:"row"}}>
            <form id="hahmonluonti">
                <h3>Värvää seikkailija</h3>
                <label>Nimi
                    <input type='text' name='nimi' value={hahmo.nimi}
                        onChange={muutaNimiIka} /><br />
                </label>
                <label>Ammatti
                    <select name='ammatti' value={hahmo.ammatti} onChange={muutaAmmatti}>
                        <option value=""></option>
                        <option value="Ritari">Ritari</option>
                        <option value="Tiedustelija">Tiedustelija</option>
                        <option value="Strategi">Strategi</option>
                    </select><br />
                </label>
                <label>Ikä
                    <input type="range" min="15" max="100" name='ika' 
                    value={hahmo.ika} onChange={muutaNimiIka} /><br />
                </label>

                <input type='button' value='Lisää' onClick={lisaaHahmo} />
            </form>
            <p style={{color:"crimson", padding:"0 20px"}}>{viesti}</p>
            {lisatty.length > 0 && (
                <div>
                    <p>Nimi: {lisatty[lisatty.length - 1].nimi}</p>
                    <p>Ammatti: {lisatty[lisatty.length - 1].ammatti}</p>
                    <p>Ikä: {lisatty[lisatty.length - 1].ika}</p>
                    <p>Taso: {Math.floor(lisatty[lisatty.length - 1].kokemuspisteet)}</p>
                </div>
            )}
        </div>
        <hr />
        </div>
    );
}
export default LuoHahmo;