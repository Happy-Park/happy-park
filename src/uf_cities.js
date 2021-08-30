require("dotenv").config();

const client = require("../src/postgres");
client.connect();
const ufs = "select * from estados";
const ufBox = document.getElementById("uf");
const citiesBox = document.getElementById("city");
var query = "";
let arr = [];

client.query(ufs, (err, res) => {
  if (err) {
    console.error(err);
  }

  let i = 1;
  for (let row of res.rows) {
    const option = document.createElement("option");
    option.innerText = row.uf;
    option.classList = uf.codigo;
    ufBox.appendChild(option);
    arr[i] = row.uf;
    i++;
  }
  ufBox.addEventListener("change", function (event) {
    while (citiesBox.firstChild) {
      citiesBox.removeChild(citiesBox.lastChild);
    }
    for (let i = 0; i <= arr.length; i++) {
      if (arr[i] === event.target.value) {
        query = "select * from cidades where cidades.id_estado = " + i;
        client.query(query, (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          for (let city of res.rows) {
            const option = document.createElement("option");
            option.innerText = city.nome;
            option.classList = city.nome;
            citiesBox.appendChild(option);
          }
        });
      }
    }
  });
});
