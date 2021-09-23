const db = require("../src/postgres").client;
db.connect()
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let rowId;
var table = new Tabulator("#tableLogs", {
  rowClick: function (e, row) {
    rowId = row.getData();
    openLogDetails(rowId);
  },
  groupBy: ["Tabela", "Tipo"],
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
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let i = 0;
      res.rows.forEach((element) => {
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
          ValorNovo: element.valornovo,
          ValorAnt: element.valorant
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
    document.getElementById('tipo').value = rowId.Tipo;
    document.getElementById('tabela').value = rowId.Tabela;
    document.getElementById('comando').value = rowId.Comando;
    document.getElementById('ip').value = rowId.Ip;
    document.getElementById('data').value = rowId.Data;
    document.getElementById('usuario').value = rowId.Usuario;
    document.getElementById('valornovo').value = rowId.ValorNovo;
    document.getElementById('valorant').value = rowId.ValorAnt;
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
  let query = `select * from log where id=${id.ID}`
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