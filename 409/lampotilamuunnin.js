document.getElementById('BtnMuunna').addEventListener('click', Muunna)

function ToFahrenheit(C) {
    return C * 1.8 + 32.0;
}

function ToCelsius(F) {
    return (F - 32.0) / 1.8;
}

function Muunna(event) {
    
    event.preventDefault();

    const valinta = document.getElementById('valinta').selectedIndex;
    const syote = parseFloat(document.getElementById('syote').value);
    if (syote.length < 1 || isNaN(syote)) {
        alert("Tarkista syöte");
        return;
    }

    const elementit = document.getElementsByName('desimaalit');
    let desimaalit = 1;
    for (let i = 0; i < elementit.length; i++) {
        if (elementit[i].checked) {
            desimaalit = elementit[i].value;
        }
    }
    
    let tulos = 0;
    switch(valinta) {
        case 0: {
            tulos = ToFahrenheit(syote).toFixed(desimaalit);
            if (tulos <= -459.67) {
                let doc = document.getElementById('tulos');
                doc.style.fontWeight = 'bold'
                doc.innerText = tulos + "°F" + " Kannattaa laittaa pipo päähän!";
            } else {
                let doc = document.getElementById('tulos');
                doc.style.fontWeight = 'normal';
                doc.innerText = tulos + "°F";
            }
        } break;

        case 1: {
            tulos = ToCelsius(syote);
            if (tulos <= -273.15) {
                let doc = document.getElementById('tulos');
                doc.style.fontWeight = 'bold'
                doc.innerText = tulos.toFixed(desimaalit) + "°C" + " Kannattaa laittaa pipo päähän!";
            } else {
                let doc = document.getElementById('tulos');
                doc.style.fontWeight = 'normal'
                doc.innerText = tulos.toFixed(desimaalit) + "°C";
            }
        } break;
    }
}