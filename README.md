# Pelin valikko

**React + Node.js + Express + SQLite -projekti, jossa toteutetaan pelin valikkonäkymä ja siihen liittyviä toimintoja.**

## 📖 Projektin kuvaus

Kuvitteellisen pelin valikko. Siinä voi luoda pelihahmoja ja ostaa heille varusteita ja sen sellaista. Mukana muun muassa tietokanta ja REST API. Projekti toimii harjoituspohjana erilaisille käyttöliittymä- ja sovelluskehityskokeiluille.

## 🎮 Demo

Sovellus on julkaistu Render-palvelussa, ja ensilataus kestää minuutin tai pari ilmaisversion vuoksi.

[Kokeile sovellusta](https://pelivalikkoreactnode.onrender.com)

## ✨ Toiminnallisuudet

#### 1. Rekisteröityminen ja sisäänkirjautuminen
![Kirjautuminen](/kuvat/login.gif)

Sovellukseen kirjautuminen edellyttää pelaajatilin rekisteröimistä.
Sovellus validoi käyttäjän syötteet ja antaa ilmoituksen yleisissä
virhetilanteissa, kuten jos yrittää rekisteröidä jo olemassa olevan
käyttäjätunnuksen, tai jos käyttäjätunnus on väärä tai liian lyhyt.

---

#### 2. Värvääminen
![Värvääminen](/kuvat/varvaa.gif)

Pelaajalla on hallussaan seikkailijoiden ryhmä, jota voi kasvattaa 
värväämällä uusia seikkailijoita. Värvättävälle seikkailijalle valitaan
ammatti valmiista listasta sekä ikä liukusäätimellä. Mikäli ammattia
ei valita, sovellus näyttää virheilmoituksen. Seikkailijan nimi
arvotaan REST API:n kautta (https://fantasyname.lukewh.com/).
Kuva arvotaan valitun ammatin sekä satunnaisen sukupuolen perusteella.
Ryhmän maksimikoko on kuusi seikkailijaa. Mikäli värväystä yritetään
tämän rajan yli, sovellus antaa ilmoituksen.

---

#### 3. Seikkailijoiden hallinta
![Seikkailijoiden hallinta](/kuvat/seikkailijat.gif)

Seikkailijat esitetään rinnakkain kortteina, joissa näkyvät kunkin
seikkailijan keskeiset tiedot. Korttia klikkaamalla avautuu näkymä,
jossa kyseisen seikkailijan tietoja voidaan muokata.

![Seikkailijan hallinta](/kuvat/seikkailija.gif)

Muokattavissa ovat seikkailijan nimi, ammatti ja ase. Valittavissa
olevat aseet määräytyvät valitun ammatin perusteella. Jos muutokset
yritetään vahvistaa ilman valittua asetta, sovellus näyttää
virheilmoituksen. Seikkailijan voi myös poistaa eli irtisanoa ryhmästä.

---

#### 4. Kauppa

![Kauppa](/kuvat/kauppa.gif)

Kauppanäkymä koostuu kahdesta sarakkeesta: vasemmalla pelaajan
omistamat tavarat ja oikealla kaupan valikoima. Pelaajalla on
käytössään rajallinen määrä kultaa, jolla tavaroita voidaan ostaa
kaupasta. Pelaaja voi myös myydä omia tavaroitaan kaupalle.
Ostetut tavarat ovat käytettävissä seikkailijoiden varusteita
valittaessa. Tämä on mahdollista, koska pelaajan omistamat
tavarat tallennetaan tietokantaan.

## 🛠️ Teknologiat

**Frontend**
- React
- Vite

**Backend**
- Node.js
- Express.js
- SQLite
- REST API

## ⚙️ Asennus

```bash
git clone https://github.com/toivoantero/pelinvalikko
```
```bash
cd pelinvalikko
```
```bash
npm install
```
```bash
node pelivalikkoServer.cjs
```
```bash
npm run dev
```


