
function MuutaHahmo() {

    return (
        <div>
        <div style={{padding:"20px"}}>
            <form id="hahmonluonti">
                <h3>Muuta seikkailijan nimi tai ammatti</h3>
                <label>Nimi
                    <input type='text' name='nimi' /><br />
                </label>
                <label>Ammatti
                    <select name='ammatti'>
                        <option value=""></option>
                        <option value="Ritari">Ritari</option>
                        <option value="Tiedustelija">Tiedustelija</option>
                        <option value="Strategi">Strategi</option>
                    </select><br />
                </label>

                <input type='button' value='Muuta' />
                <p></p>
            </form>
        </div>
        <hr />
        </div>
    );
}
export default MuutaHahmo;