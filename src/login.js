const crypto = require("crypto");
const db = require("../src/postgres");
db.connect();
const button = document.getElementById("login-btn");
const user = document.getElementById("username");

button.addEventListener("click", function () {
  let password = document.getElementById("password").value;
  FAZER CAMPO ISWORKER NA TABELA USUARIO PARA FACILITAR O LOGIN 
  const query = `select usuario.email, usuario.senha from usuario where usuario.email='${user.value}'`;
  db.query(query, (err, res) => {
    if (err) {
      console.error(err);
    }
    password = crypto.createHash("sha256").update(password).digest("hex");

    if (res.rowCount === 0) {
      console.log("Usuário não encontrado");
    } else {
      if (res.rows[0].email === user.value) {
        if (res.rows[0].senha === password) {
          console.log("Tô dentro");
        } else {
          console.log("Senha incorreta");
        }
      }
    }
    // else {
    //   console.log("Usuário não encontrado");
    // }
  });
});
