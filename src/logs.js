const db = require("../src/postgres");
db.connect();
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let currentClientSelected = [2];
var table = new Tabulator("#tableLogs", {
  rowClick: function (e, row) {
    //saves the client's name and email for the selected row
    currentClientSelected[0] = row.getData().ID;
    currentClientSelected[1] = row.getData();
    openLogDetails(currentClientSelected[0]);
  },
  //ORDER BY DATA
  selectable: 1,
  layout: "fitColumns",
  reactiveData: true,
  columns: [
    {
      title: "ID",
      field: "ID",
      headerFilter: "number",
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar ID",
    },
    {
      title: "Data",
      field: "Data",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Data",
    },
    {
      title: "Usuário",
      field: "Usuario",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Usuário",
    },
    {
      title: "Tipo",
      field: "Tipo",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Tipo",
    },
    {
      title: "Tabela",
      field: "Tabela",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Tabela",
    },
  ],
});

let tableData = [];

downloadTable.addEventListener("click", function () {
  table.download("pdf", "TabelaFuncionarios.pdf");
});

const updateTable = () => {
  table.clearData();
  const query = "select * from log";
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar os usuários. Verifique!");
      console.log(err);
    } else {
      let i = 0;
      //For each client in the array, adds its data to it
      res.rows.forEach((element) => {
        console.log(element);
        let data = new Date(element.data);
        data = data.toISOString().split("T")[0];
        tableData[i] = {
          ID: element.id,
          Tipo: element.tipo,
          Tabela: element.tabela,
          Data: data,
          Comando: element.comando,
          Ip: element.ip,
          Usuario: element.usuario,
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const openLogDetails = (id) => {
  let query = `select * from log where id = ${id}`
};

updateTable();
