const crypto = require("crypto");
const db = require("../src/postgres").client;
const updateErrorLog = require('../src/postgres').updateErrorLog


const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});
db.connect();
const button = document.getElementById("login-btn");
const user = document.getElementById("username");

button.addEventListener("click", function () {
  let password = document.getElementById("password").value;
  const query = `select email, senha, funcionario, admin from usuario where email='${user.value}'`;
  db.query(query, (err, res) => {
    if (err) {
      console.error(err);
      updateErrorLog(query, err);
    }
    password = crypto.createHash("sha256").update(password).digest("hex");

    if (res.rowCount === 0) {
      notyf.error("Usuário não encontrado");
      updateErrorLog(query, err);
    } else {
      if (res.rows[0].email === user.value) {
        if (res.rows[0].senha === password) {
          if (res.rows[0].admin === true) {
            window.location.href = "../pages/home_admin.html";
          } 
          else if(res.rows[0].funcionario === true){
            window.location.href = "../pages/home.html";
          }
          else {
            window.location.href = "../pages/home_user.html";
          }
        } else {
          notyf.error("Senha incorreta!");
        }
      }
    }
  });
});
