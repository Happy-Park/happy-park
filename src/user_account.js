let db = require("../src/postgres").client;
let loggedUser = JSON.parse(sessionStorage.getItem("user"));
db.connect();
let nomeField = document.getElementById("nome");
let emailField = document.getElementById("email");
let celularField = document.getElementById("celular");
let ingressoField = document.getElementById("ingresso");
let valorField = document.getElementById("valor");
let quantidadeField = document.getElementById("quantidade");
db.query(
  `select vi.validade, vi.valortotal, vi.quantidade, vi.ingresso, u.nome from vendingresso vi, usuario u where vi.usuario = ${loggedUser.id} and u.id = ${loggedUser.id}`,
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows);
      let temp = new Date(res.rows[0].validade)
      console.log(temp.toLocaleDateString('pt-br'))
      nomeField.value = res.rows[0].nome;
      emailField.value = res.rows[0].email;
      celularField.value = res.rows[0].telefone;
      valorField.value = res.rows[0].valortotal
      quantidadeField.value = res.rows[0].quantidade
      ingressoField.value = res.rows[0].ingresso
    }
  }
);
