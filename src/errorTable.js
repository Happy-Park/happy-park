const db = require("../src/postgres").client;
db.connect()
const updateErrorLog = require('../src/postgres').updateErrorLog
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let rowId;
var table = new Tabulator("#tableErros", {
  rowClick: function (e, row) {
    rowId = row.getData();
    openLogDetails(rowId);
  },
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
      title: "Erro",
      field: "Erro",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Erro",
    },
    {
      title: "Query",
      field: "Query",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Query",
    },
    {
      title: "Data",
      field: "Data",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Data",
    },
  ],
});
let tableData = [];

downloadTable.addEventListener("click", function () {
  table.download("pdf", "TabelaFuncionarios.pdf");
});

const updateTable = () => {
  table.clearData();
  const query = "select * from erro";
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar os usuários. Verifique!");
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let i = 0;
      res.rows.forEach((element) => {
        let data = new Date(element.data);
        data = data.toISOString().split("T")[0];
        tableData[i] = {
          ID: element.id,
          Erro: element.error,
          Query: element.query,
          Data: data
        };
        i++;
      });
      table.addData(tableData);
      table.setSort("ID", "desc")
    }
  });
};

const fillFields = () => {
    document.getElementById('ID').value = rowId.ID;
    document.getElementById('erro').value = rowId.Erro;
    document.getElementById('query').value = rowId.Query;
    document.getElementById('data').value = rowId.Data;
}

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const openModal = () => {
  document.getElementById("modal").classList.add("active");
}

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const openLogDetails = (id) => {
  console.log(id)
  let query = `select * from erro where id=${id.ID}`
  db.query(query, (err,res) => {
    if(err){
      updateErrorLog(query, err);
      console.log(err)
    }
    else{
      fillFields();
      openModal();
    }
  })
};

updateTable();

document.getElementById("modalClose").addEventListener("click", closeModal);