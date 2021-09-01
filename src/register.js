const db = require("../src/postgres");
const Cleave = require("cleave.js");
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const crypto = require("crypto");
const button = document.getElementById("login-btn");
const name = document.getElementById("name");
const email = document.getElementById("email");
const birthdate = document.getElementById("birthdate");
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  }});

var cleave = new Cleave(".input-phone", {
  phone: true,
  phoneRegionCode: "br",
});

var cpfCleave = new Cleave("#cpf", {
  delimiters: [".", ".", "-"],
  blocks: [3, 3, 3, 2],
  numericOnly: true,
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

button.addEventListener("click", function () {
  let password = document.getElementById("password").value;
  var cityNumber;
  let city = document.getElementById("city");
  password = crypto.createHash("sha256").update(password).digest("hex");
  city = capitalize(city.value);
  let phone = document.getElementById("phone");
  let cpf = document.getElementById("cpf");
  phone = phone.value.replaceAll(" ", "");
  db.query(
    `select cidades.id from cidades where cidades.nome='${city}'`,
    (err, res) => {
      if (err) {
        console.log(err);
      }
      cityNumber = res.rows[0].id;
      const query = `insert into usuario values(default,${cpf.value.replaceAll(".", "").replaceAll("-", "")},'${name.value}','${phone.value}','${email.value}','${password}','${birthdate.value}',${cityNumber})`;
      console.log(query);
      db.query(query, (err, res) => {
        if (err) {
          notyf.error("Não foi possível realizar seu cadastro. Verifique!");
        }else{
          notyf.success("Cadastro realizado com sucesso!");
          window.location.href = "../pages/login.html";
        }
      });
    }
  );
});
