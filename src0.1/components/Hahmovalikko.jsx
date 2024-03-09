function Hahmovalikko({ hahmolista, varusteet }) {

    const aseValinta = (hahmo) => {
        if (hahmo.ammatti == "Tiedustelija") {
            return tiedustelijaAseet[Math.floor(Math.random() * tiedustelijaAseet.length)].nimi;
        } else if (hahmo.ammatti == "Ritari") {
            return ritariAseet[Math.floor(Math.random() * ritariAseet.length)].nimi;
        } else if (hahmo.ammatti == "Strategi") {
            return strategiAseet[Math.floor(Math.random() * strategiAseet.length)].nimi;
        }
    }

    let strategiAseet = varusteet.filter(ase => ase.tyyppi == "Yhden käden" && ase.paino < 5);
    let tiedustelijaAseet = varusteet.filter(ase => ase.paino < 10);
    let ritariAseet = varusteet.filter(ase => ase.paino > 8);

    return (
        <div>
        <div style={{padding:"20px"}}>
            <h3>Varustus</h3>
            <div style={{display:"flex", flexDirection:"row"}}>
                {hahmolista.map(objekti => {
                    return (
                        <form key={objekti.nimi} style={{ padding: "5px 20px" }}>
                            <div>
                                Nimi: {objekti.nimi} <br />
                                Ammatti: {objekti.ammatti} <br />
                                Ikä: {objekti.ika} <br />
                                Taso: {Math.floor(objekti.kokemuspisteet)} <br />
                            </div>
                            <label>Ase:
                                <select name='ase'>
                                    <option value={aseValinta(objekti)}>{aseValinta(objekti)}</option>
                                    <option value="Puumiekka">Puumiekka</option>
                                    <option value="Paimenen linko">Paimenen linko</option>
                                </select><br />
                            </label>

                        </form>
                    );
                })}
            </div>
        </div>
        <hr />
        </div>
    );
}
export default Hahmovalikko;