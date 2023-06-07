
// Versio 1
/////////////////////////////////////////////////

function tyhjennaLista() {
    let lista = document.getElementById('lista');
    if (lista) {
        const li = lista.getElementsByTagName('li');
        for (let i = li.length - 1; i >= 0; i--) {
            lista.removeChild(li[i]);
        }
    }
}

function kysyKaverit() {
    tyhjennaLista();

    let syotteet = [];
    for (let i = 0; i < 10; i++) {
        let nimi = prompt("Anna kaverin nimi:");
        if (nimi == null || nimi == "") {
            return;
        } else {
            syotteet.push(nimi);
        }
    }

    let lista = document.getElementById('lista');
    if (lista) {
        for (let i = 0; i < syotteet.length; ++i) {
            let uusiLi = document.createElement('li');
            uusiLi.appendChild(document.createTextNode(syotteet[i]));
            lista.appendChild(uusiLi);
        }
    }
}

// Versio 2
/////////////////////////////////////////////////

let kaveriLista = [];

const btnLisaa = document.getElementById('btnLisaa');
if (btnLisaa != null) {
    btnLisaa.addEventListener('click', lisaaKaveri);
}

const btnPoista = document.getElementById('btnPoista');
if (btnPoista != null) {
    btnPoista.addEventListener('click', poistaKaveri);
}

const btnJarjesta = document.getElementById('btnJarjesta');
if (btnPoista != null) {
    btnJarjesta.addEventListener('click', jarjestaKaverit);
}

function lisaaKaveri() {
    let nimi = document.getElementById('syote').value;
    if (nimi.length < 1) {
        alert("Pitää olla vähintään yksi kirjain!")
        return;
    }

    let lista = document.getElementById('lista');
    if (lista) {
        kaveriLista.push(nimi);
        let uusiLi = document.createElement('li');
        uusiLi.appendChild(document.createTextNode(nimi));
        lista.appendChild(uusiLi);
        document.getElementById('syote').value = "";
    }
}

function poistaKaveri() {
    let nimi = document.getElementById('syote').value;
    if (nimi.length < 1) {
        alert("Pitää olla vähintään yksi kirjain!")
        return;
    }

    let lista = document.getElementById('lista');
    if (lista) {
        const index = kaveriLista.indexOf(nimi);
        if (index !== -1) {
            kaveriLista.splice(index, 1);

            const kaverit = lista.getElementsByTagName('li');
            for (let i = 0; i < kaverit.length; ++i) {
                if (kaverit[i].textContent === nimi) {
                    lista.removeChild(kaverit[i]);
                    document.getElementById('syote').value = "";
                    break;
                }
            }
        } else {
            alert("Nimeä ei löytynyt. Tarkista syöte");
        }
    }
}

function jarjestaKaverit() {
    let lista = document.getElementById('lista');
    if (lista) {
        kaveriLista.sort();
        for (let i = 0; i < kaveriLista.length; ++i) {
            lista.children[i].innerText = kaveriLista[i];
        }
    }
}
