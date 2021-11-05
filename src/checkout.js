let tickets = JSON.parse(sessionStorage.getItem("tickets"));
let button = document.getElementById("finish-purchase");
let info = document.getElementById('info')
const db = require("../src/postgres").client;
db.connect();
const notyf = new Notyf({
  duration: 2000,
  position: {
    x: "right",
    y: "top",
  },
});
let today = new Date();
const { Litepicker } = require("litepicker");
const picker = new Litepicker({
  lang: "pt",
  format: "YYYY-MM-DD",
  element: document.getElementById("datepicker"),
  allowRepick: true,
  singleMode: false,
  tooltipText: {
    one: "dia",
    other: "dias",
  },
  tooltipNumber: (totalDays) => {
    return totalDays - 1;
  },
});
let diff;
picker.on("tooltip", (tooltip, date) => {
  diff = tooltip.innerText //.substring(0, 2).replace(" ", "");
});

picker.on("selected", (start, finish) => {
  info.innerText = diff
  console.log(start.format("YYYY-MM-DD"));
  console.log(finish.format("YYYY-MM-DD"));
});
button.addEventListener("click", () => {
  let user = JSON.parse(sessionStorage.getItem("user"));
  if (picker.getDate() === null || picker.getDate() === undefined) {
    alert("Selecione uma data");
    return;
  }
  // if(picker.getStartDate().format('YYYY-MM-DD') > today.getDate()){
  //      alert("Data inválida");
  //   }
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  tickets.forEach((ticket) => {
    let total = ticket.valor * ticket.quantidade;
    let query = `insert into vendingresso values(default,'${date}', '${picker
      .getEndDate()
      .format("YYYY-MM-DD")}', ${total},${ticket.quantidade},${ticket.id},${
      user.id
    },2)`;
    db.query(query, (err, res) => {
      if (err) {
        console.log(err);
        notyf.success("Erro ao finalizar compra. Verifique!");
      } else {
        notyf.success("Ingressos comprados com sucesso!");
        window.location.href = "../pages/home_user.html";
      }
    });
  });
});
