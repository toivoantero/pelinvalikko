import { useState } from 'react';
import { useEffect } from 'react';

function Kauppa({ varusteetOmat, varusteetKauppa }) {

    const [myytava, setMyytava] = useState(null);
    const [ostettava, setOstettava] = useState(null);
    const [omatMuutos, setOmatMuutos] = useState([]);
    const [kaupanMuutos, setKaupanMuutos] = useState([]);
    const [rahat, setRahat] = useState(1000);

    useEffect(() => {
        setOmatMuutos(varusteetOmat);
    }, []);
    useEffect(() => {
        setKaupanMuutos(varusteetKauppa);
    }, []);

    const valitseMyytava = (e) => {
        e.target.style.background = "lightgray";
        setMyytava(omatMuutos.find(varuste => varuste.id == e.target.id));
        setOstettava(null);
    }
    const valitseOstettava = (e) => {
        e.target.style.background = "lightgray";
        setOstettava(kaupanMuutos.find(varuste => varuste.id == e.target.id));
        setMyytava(null);

    }

    const myy = () => {
        if (myytava != null) {
            setOmatMuutos(omatMuutos.filter(varuste => varuste.id != myytava.id));
            setKaupanMuutos([myytava, ...kaupanMuutos]);
            setRahat(rahat + myytava.hinta);
            console.log(myytava.nimi + " myyty.");
        }
    }
    const osta = () => {
        if (ostettava != null) {
            setKaupanMuutos(kaupanMuutos.filter(varuste => varuste.id != ostettava.id));
            setOmatMuutos([ostettava, ...omatMuutos]);
            setRahat(rahat - ostettava.hinta);
            console.log(ostettava.nimi + " ostettu.");
        }
    }

    const omat = omatMuutos.map(objekti => {
        return (
            <form key={objekti.nimi} id={objekti.id}
            style={{ padding: "5px 20px", border: "1px solid black" }}
            onClick={valitseMyytava}>
                {objekti.nimi} <br />
                Vahinko: {objekti.vahinko} <br />
                Paino: {objekti.paino} <br />
                Tyyppi: {objekti.tyyppi} <br />
                Hinta: {objekti.hinta} <br />
            </form>
        );
    })

    const kaupan = kaupanMuutos.map(objekti => {
        return (
            <form key={objekti.nimi} id={objekti.id}
            style={{ padding: "5px 20px", border: "1px solid black" }}
            onClick={valitseOstettava}>
                {objekti.nimi} <br />
                Vahinko: {objekti.vahinko} <br />
                Paino: {objekti.paino} <br />
                Tyyppi: {objekti.tyyppi} <br />
                Hinta: {objekti.hinta} <br />
            </form>
        );
    })

    return (
        <div>
        <div style={{padding:"20px", display:"flex", flexDirection:"row"}}>
            <div>
            <h3>Esineluettelo</h3>  
            <div style={{border:"1px solid black", height:"80vh", overflow:"auto"}}>
                {omat}
            </div>
            </div>
            
            <div style={{ display:"flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "0 10px" }}>
                <p style={{width:"100px",textAlign:"center"}}>{rahat} kultaa</p>
                <input type="button" style={{height:"50px"}} value="Osta" onClick={osta} /><br />
                <input type="button" style={{height:"50px"}} value="Myy" onClick={myy} />
            </div>

            <div>
            <h3>Kauppa</h3>
            <div style={{border:"1px solid black", height:"80vh", overflow:"auto"}}>
                {kaupan}
            </div>
            </div>
        </div>
        </div>
    );
}
export default Kauppa;