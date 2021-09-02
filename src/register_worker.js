const db = require("../src/postgres");
const crypto = require("crypto");
const Cleave = require("cleave.js");
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const button = document.getElementById("register-btn");
const name = document.getElementById("name");
const email = document.getElementById("email");
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  }});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var cleave = new Cleave(".input-phone", {
  phone: true,
  phoneRegionCode: "br",
});

var cpfCleave = new Cleave("#cpf", {
  delimiters: [".", ".", "-"],
  blocks: [3, 3, 3, 2],
  numericOnly: true,
});

button.addEventListener("click", function () {
  let password = document.getElementById("password").value;
  password = crypto.createHash("sha256").update(password).digest("hex");
  let date = Date.now();
  var cityNumber;
  let city = document.getElementById("city");
  city = capitalize(city.value);
  let phone = document.getElementById("phone");
  let cpf = document.getElementById("cpf");
  phone = phone.value.replaceAll(" ", "");
  let admin = document.getElementById("admin");
  admin = admin.checked;

  db.query(
    `select cidades.id from cidades where cidades.nome='${city}'`,
    (err, res) => {
      if (err) {
        console.log(err);
      }
      cityNumber = res.rows[0].id;
      const query = `insert into usuario values(default,${cpf.value.replaceAll(".", "").replaceAll("-", "")},'${name.value}','${phone.value}','${email.value}','${password}','${birthdate.value}',${cityNumber},${admin},'true')`;
      console.log(query);
      db.query(query, (err, res) => {
        if (err) {
          notyf.error("Não foi possível realizar seu cadastro. Verifique!");
          console.log(err);
        } else {
          notyf.success("Cadastro realizado com sucesso!");
          window.location.href = "../pages/home.html";
        }
        console.log(res);
      });
    }
  );
});
