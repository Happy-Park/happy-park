const pg = require("pg");
require("dotenv").config();

const bd = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

bd.connect();

const ufs = "select * from estados";

const ufBox = document.getElementById("uf");
const citiesBox = document.getElementById("city");
var query = "";
let arr = [];

bd.query(ufs, (err, res) => {
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
    for (let i = 1; i <= arr.length; i++) {
      if (arr[i] === event.target.value) {
        query = "select * from cidades where cidades.id_estado = " + i;
        bd.query(query, (err, res) => {
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
