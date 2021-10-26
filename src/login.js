sessionStorage.setItem("user", null);
const crypto = require("crypto");
const db = require("../src/postgres").client;
const updateErrorLog = require('../src/postgres').updateErrorLog
//get pc's ip address
let {networkInterfaces} = require('os');
const nets = networkInterfaces();
let results = Object.create(null); 
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
//iterate through the results and find the first one
let ip = '';
for (const name of Object.keys(results)) {
    ip = results[name][0];
}
console.log(ip)

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
            sessionStorage.setItem("user", 'admin');
          } 
          else if(res.rows[0].funcionario === true){
            window.location.href = "../pages/home.html";
            sessionStorage.setItem("user", 'worker');
          }
          else {
            window.location.href = "../pages/home_user.html";
            sessionStorage.setItem("user", 'client');
          }
        } else {
          notyf.error("Senha incorreta!");
        }
      }
    }
  });
});
