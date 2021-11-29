let db = require("../src/postgres").client;
let loggedUser = JSON.parse(sessionStorage.getItem("user"));
db.connect();
const ticketsContainer = document.getElementById("tickets-inside");
let nomeField = document.getElementById("nome");
let emailField = document.getElementById("email");
let celularField = document.getElementById("celular");

db.query(
  `select vi.validade, vi.valortotal, vi.quantidade, vi.ingresso, u.nome, u.telefone,u.email from vendingresso vi, usuario u where vi.usuario = ${loggedUser.id} and u.id = ${loggedUser.id}`,
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.rows.forEach((element) => {
        let temp = new Date(element.validade);
        createTicketDetail(
          element.ingresso,
          Math.round(element.valortotal * 100) / 100,
          element.quantidade,
          temp.toLocaleDateString("pt-br")
        );
        console.log(element);
      });
      console.log(res.rows)
      nomeField.value = res.rows[0].nome;
      emailField.value = res.rows[0].email;
      celularField.value = res.rows[0].telefone;
    }
  }
);

function createTicketDetail(ingresso, valor, quantidade, validade) {
  ticketsContainer.style.height = "60vh"
  let card = document.createElement("div");
  card.classList.add("ticket-details");
  card.innerHTML = `
  <span>Ingresso: </span>
  <input type="text" id="ingresso" value="${ingresso}" readonly/>
  <span>Valor:</span>
  <input type="text" id="valor" value="${valor}" readonly/>
  <span>Quantidade:</span>
  <input type="text" id="quantidade" value="${quantidade}" readonly/>
  <span>Validade:</span>
  <input type="text" id="validade" value="${validade}" readonly/>`;
  ticketsContainer.append(card);
}
