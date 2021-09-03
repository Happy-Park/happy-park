require("dotenv").config();

const client = require("../src/postgres");
const query = "select lojacateg.descricao from lojacateg";
const categBox = document.getElementById("category");

client.query(query, (err, res) => {
  if (err) {
    console.error(err);
  }
  else{
    let option = document.createElement("option");
  option.innerText = "Categoria";
  categBox.appendChild(option);
  for (let row of res.rows) {
    option = document.createElement("option");
    option.innerText = row.descricao;
    option.classList = row.descricao;
    categBox.appendChild(option);
  }
  }
});
