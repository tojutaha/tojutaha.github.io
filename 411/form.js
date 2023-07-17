const userid = document.getElementById('userid');
const password = document.getElementById('password');
const name = document.getElementById('name');
const address = document.getElementById('address');
const country = document.getElementById('country');
const zipcode = document.getElementById('zipcode');
const email = document.getElementById('email');
const genderLabel = document.querySelector('.gender-label');
const genderOption1 = document.getElementById('genderOption1');
const genderOption2 = document.getElementById('genderOption2');
const languageLabel = document.querySelector('.language-label');
const languageOption1 = document.getElementById('languageOption1');
const languageOption2 = document.getElementById('languageOption2');

const form = document.querySelector('form');

genderOption1.addEventListener('click', HandleRadioButtonClick);
genderOption2.addEventListener('click', HandleRadioButtonClick);

function HandleRadioButtonClick(event)
{
    genderOption1.checked = false;
    genderOption2.checked = false;

    event.target.checked = true;
}

function IsEmpty(value)
{
    return value === '' ? true : false;
}

function ShorterThan(length, min)
{
    return length < min ? false : true;
}

function IsAllNumbers(input)
{
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char < "0" || char > "9") {
            return false;
        }
    }

    return true;
}

function OnSuccess(input)
{
    const container = input.parentElement;
    container.classList.remove('invalid');
    container.classList.add('valid');
    const error = container.querySelector('small');
    error.textContent = '';
}

function OnError(input, message)
{
    const container = input.parentElement;
    container.classList.remove('valid');
    container.classList.add('invalid');
    const error = container.querySelector('small');
    error.textContent = message;
}

function CheckID()
{
    const min = 6;
    const input = userid.value.trim();

    if (IsEmpty(input)) {
        OnError(userid, 'Käyttäjä ID ei voi olla tyhjä.');
    } else if (!ShorterThan(input.length, min)) {
        OnError(userid, `Käyttäjä ID:n pitää olla vähintään ${min} merkkiä pitkä.`);
    } else {
        OnSuccess(userid);
        return true;
    }

    return false;
}

function CheckPassword()
{
    const input = password.value.trim();

    if (IsEmpty(input)) {
        OnError(password, 'Salasana ei voi olla tyhjä.');
    } else {
        OnSuccess(password);
        return true;
    }

    return false;
}

function CheckName()
{
    const input = name.value.trim();
    if (IsEmpty(input)) {
        OnError(name, 'Nimi ei voi olla tyhjä.');
    } else {
        OnSuccess(name);
        return true;
    }

    return false;
}

function CheckAddress()
{
    const input = address.value.trim();
    if (IsEmpty(input)) {
        OnError(address, 'Osoite ei voi olla tyhjä.');
    } else {
        OnSuccess(address);
        return true;
    }

    return false;
}

function CheckCountry()
{
    if (country.value == 'none') {
        OnError(country, 'Valitse maa.');
    } else {
        OnSuccess(country);
        return true;
    }

    return false;
}

function CheckZipcode()
{
    const input = zipcode.value.trim();
    const min = 5;

    if (IsEmpty(input)) {
        OnError(zipcode, 'Postinumero ei voi olla tyhjä.');
    } else if (!ShorterThan(input.length, min)) {
        OnError(zipcode, `Postinumeron pitää olla vähintään ${min} merkkiä pitkä.`);
    } else if (!IsAllNumbers(input)) {
        OnError(zipcode, 'Postinumero voi muodostua ainoastaan numeroista.');
    } else {
        OnSuccess(zipcode);
        return true;
    }

    return false;
}

function CheckEmail()
{
    //https://www.w3resource.com/javascript/form/email-validation.php
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const input = email.value;

    if (IsEmpty(input)) {
        OnError(email, 'Sähköposti ei voi olla tyhjä.');
    } else if (!regex.test(email.value)) {
        OnError(email, 'Ei ole validi sähköpostiosoite.');
    } else {
        OnSuccess(email);
        return true;
    }

    return false;
}

function CheckGender()
{
    if (!genderOption1.checked && !genderOption2.checked) {
        OnError(genderLabel, 'Valitse sukupuoli.');
    } else {
        OnSuccess(genderLabel);
        return true;
    }

    return false;
}

function CheckLanguage()
{
    if (!languageOption1.checked && !languageOption2.checked) {
        OnError(languageLabel, 'Valitse kieli.');
    } else {
        OnSuccess(languageLabel);
        return true;
    }
    return false;
}

form.addEventListener('submit', function(e)
{
    e.preventDefault();

    const isValidID = CheckID();
    const isValidPassword = CheckPassword();
    const isValidName = CheckName();
    const isValidAddress = CheckAddress();
    const isValidCountry = CheckCountry();
    const isValidZipcode = CheckZipcode();
    const isValidEmail = CheckEmail();
    const isValidGender = CheckGender();
    const isValidLanguage = CheckLanguage();

    const isValidForm = isValidID &&
            isValidPassword       &&
            isValidName           &&
            isValidAddress        &&
            isValidCountry        &&
            isValidZipcode        &&
            isValidEmail          &&
            isValidGender         &&
            isValidLanguage;

    if (isValidForm) {
        console.log('Lähetys onnistui!');
    }
});

