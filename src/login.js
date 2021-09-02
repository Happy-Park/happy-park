const crypto = require("crypto");
const db = require("../src/postgres");

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
  const query = `select usuario.email, usuario.senha, usuario.funcionario from usuario where usuario.email='${user.value}'`;
  db.query(query, (err, res) => {
    if (err) {
      console.error(err);
    }
    password = crypto.createHash("sha256").update(password).digest("hex");

    if (res.rowCount === 0) {
      notyf.error("Usuário não encontrado");
    } else {
      if (res.rows[0].email === user.value) {
        if (res.rows[0].senha === password) {
          if (res.rows[0].funcionario === true) {
            window.location.href = "../pages/home.html";
          } else {
            window.location.href = "../pages/home_user.html";
          }
        } else {
          notyf.error("Senha incorreta!");
        }
      }
    }
  });
});
