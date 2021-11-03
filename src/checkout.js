let tickets = JSON.parse(sessionStorage.getItem("tickets"));
let button = document.getElementById("finish-purchase");
const db = require("../src/postgres").client;
db.connect();
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

button.addEventListener("click", () => {
  if (picker.getDate() === null || picker.getDate() === undefined) {
    alert("Selecione uma data");
    return
  }
  // if(picker.getStartDate().format('YYYY-MM-DD') > today.getDate()){
  //      alert("Data inválida");
  //   }
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let total = 0;
  tickets.forEach((ticket) => {
    total += parseFloat(ticket.valor);
  });
  let query = `insert into vendingresso values(default,'${date}', '${picker.getEndDate().format('YYYY-MM-DD')}', ${total}. )`
    db.query(
});

// picker.on("selected", (date1, date2) => {
//   console.log(date1.format("YYYY-MM-DD"));
//   console.log(date2.format("YYYY-MM-DD"));
// });
