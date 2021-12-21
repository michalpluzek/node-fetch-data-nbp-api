import fetch from "node-fetch";
import fs from "fs";

const validCodes = ["usd", "eur", "gbp", "chf"];

const code = process.argv[2];

const isValid = validCodes.find((currency) => currency === code) ? true : false;

if (!isValid) {
  console.log("Zły kod waluty: ", code);
  process.exit();
}
const url = `http://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`;

fetch(url)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else throw new Error("Coś poszło nie tak. Status: " + response.status);
  })
  .then((data) => {
    const message = `Średnia cena ${data.currency} w dniu ${data.rates[0].effectiveDate} wynosi ${data.rates[0].mid} złotych`;

    fs.appendFile("currencies.txt", message + "\n", (err) => {
      console.log("Dane dodane do pliku");
    });

    console.log(message);
  })
  .catch((err) => console.log("Error: ", err));
