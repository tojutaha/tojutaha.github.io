/*
 * Kuvaus
 * Toteuta JavaScriptillä perinteinen hedelmäpeli, jossa on tavoitteena saada tiettyjä kuviosarjoja. Pelin vaatimukset ovat seuraavat:
 *
 * 1. Pelin alussa on käytössä rahaa x euroa.
 * 2. Pelissä on neljä arvottavaa rullaa.
 * 3. Pelissä voidaan asettaa panos, joka on minimissään 1€. Maksimiarvon voin miettiä itse.
 * 4. Kun painetaan Pelaa-painiketta arvotaan rullien paikalle kuvat. Erilaisia kuvia on viisi:
 *    - omena, päärynä, kirsikka, meloni, numero 7
 *    - tai voit itse keksiä sopivammat kuvat. Niiden määrä pitää olla kuitenkin vähintään 5.
 * 5. Kun kuvat on arvottu ohjelma kertoo, saadaanko sillä voittoa. 
 * 6. Jos ensimmäisen pyöräytyksen jälkeen ei saatu voittoa, voi käyttäjä lukita haluamansa rullat, ja painaa uudelleen Pelaa-painiketta. 
 *    Lukittuihin rulliin ei arvota uusia kuvia. Tämän jälkeen tarkistetaan voitto uudelleen. 
 *    Tämän lukitut rullat vapautuvat ja seuraavalla Pelaa-painikkeen painalluksella kaikkiin rulliin arvotaan jälleen kuvat.
 * 7. Voitot määräytyvät seuraavasti:
 *    - neljä x 7 => voitto = 10 x panos
 *    - neljä x omena => voitto = 6 x panos
 *    - neljä x meloni => voitto = 5 x panos
 *    - neljä x päärymä => voitto = 4 x panos
 *    - neljä x kirsikka => voitto = 3 x panos
 *    - kolme kertaa 7 => voitto = 5 x panos
 * 8. Jokainen pelikierros kuluttaa panoksen verran peljaalla olevia rahoja. Kierroksen voitoista tulee ilmoittaa pelaajalle ja voitot lisätään pelaajan käytössä olevaan rahamäärään.
 * 9. Pelijä ei voi jatkaa jos panos on suurempi kuin käytössä olevat rahat.
 *
*/
