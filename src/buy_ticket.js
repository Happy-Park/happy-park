const db = require("../src/postgres").client;
db.connect();
// const { Litepicker } = require('litepicker')
// const picker = new Litepicker({
//     element: document.getElementById('datepicker'),
//     allowRepick: true,
//     singleMode: false,
//     tooltipText: {
//       one: 'night',
//       other: 'nights'
//     },
//     tooltipNumber: (totalDays) => {
//       return totalDays - 1;
//     }
// })

let tickets = document.getElementById("select-ticket");
function createTicketCard(ticket) {
  let card = document.createElement("div");
  card.classList.add("ticket-type");
  card.id = ticket.id;
  card.innerHTML = `
  <span>Descrição:</span>
  <span id="descricao">${ticket.descricao}</span>
  <br>
  <span>Preço: R$</span>
<span id="preco">${ticket.valor}</span>
<br>
<span>Quantidade:</span>
<input type="number" id="quantidade">
<br>
<input class="checkbox" type="checkbox">`;
  tickets.appendChild(card);
}

window.addEventListener("load", () => {
  db.query("select * from ingresso", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.rows.forEach((ticket) => {
        createTicketCard(ticket);
      });
      console.log(res.rows);
    }
  });
});

let confirmButton = document.getElementById("finish-purchase");
confirmButton.addEventListener("click", () => {
  //select all selecet checkbox
  let selectedBoxes = document.querySelectorAll(".checkbox:checked");
  let selectedTickets = [];
  let sessionTickets = [];
  selectedBoxes.forEach((ticket) => {
    selectedTickets.push(ticket.parentElement.id);
  });
  selectedTickets.forEach((id) => {
    let ticket = document.getElementById(id);
    let ticketTemp = {
      id: ticket.id,
      descricao: ticket.querySelector("#descricao").innerText,
      valor: ticket.querySelector("#preco").innerText,
      quantidade: ticket.querySelector("#quantidade").value,
    };
    sessionTickets.push(ticketTemp);
  });
  sessionStorage.setItem("tickets", JSON.stringify(sessionTickets));
  console.log(sessionStorage.getItem("tickets"));
  if (sessionTickets.length > 0) {
    window.location.href = "../pages/checkout.html";
  } else {
    alert("Selecione um ingresso!");
  }
});
