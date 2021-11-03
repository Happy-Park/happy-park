const db = require("../src/postgres").client;
db.connect();
const updateErrorLog = require("../src/postgres").updateErrorLog;
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let currentClientSelected;
var table = new Tabulator("#tableClient", {
  rowClick: function (e, row) {
    //saves the client's name and email for the selected row
    currentClientSelected = row.getData().ID;
    editClientEmail(currentClientSelected);
  },
  selectable: 1,
  layout: "fitColumns",
  reactiveData: true,
  columns: [
    {
      title: "ID",
      field: "ID",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar ID",
    },
    {
      title: "Descrição",
      field: "Descrição",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Descrição",
    },
    {
      title: "Valor",
      field: "Valor",
      headerFilter: "number",
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Valor",
    },
  ],
});

let tableData = [];
const notyf = new Notyf({
  duration: 2000,
  position: {
    x: "right",
    y: "top",
  },
});
var novo = false;

downloadTable.addEventListener("click", function () {
  table.download("pdf", "TabelaIngressos.pdf", {
    title: "Relatório de Ingressos",
    autoTable: {
      theme: "grid",
    },
    rowGroupStyles: "grid",
  });
});

// CRUD - create read update delete
function deleteClient(ingresso) {
  if (ingresso != null && ingresso != undefined) {
    const response = confirm(`Deseja realmente excluir este ingresso?`);
    if (response) {
      let query = `delete from ingresso where id='${ingresso[0]}'`;
      db.query(query, (err, res) => {
        if (err) {
          updateErrorLog(query, err);
          notyf.error("Erro ao excluir o ingresso. Verifique!");
          console.log(err);
        } else {
          notyf.success("Ingresso excluído com sucesso!");
          updateTable();
          closeModal();
        }
      });
    }
  }
}

const toDeleteClient = () => {
  deleteClient(currentClientSelected);
};

const updateClient = (index, ingresso) => {
  const query = `UPDATE ingresso SET descricao = '${ingresso.descricao}', valor = ${ingresso.valor} WHERE id = ${index}`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Não foi possível editar o cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Edição realizada com sucesso!");
    }
  });
};

const createClient = (ingresso) => {
  const query = `insert into ingresso values(default,${ingresso.valor},'${ingresso.descricao}')`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Não foi possível realizar seu cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Cadastro realizado com sucesso!");
    }
  });
};

const updateTable = () => {
  table.clearData();
  const query = "select * from ingresso";
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Erro ao carregar os usuários. Verifique!");
      console.log(err);
    } else {
      let i = 0;
      res.rows.forEach((element) => {
        tableData[i] = {
          ID: element.id,
          Descrição: element.descricao,
          Valor: element.valor,
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};

function fillFields(ingresso){
    document.getElementById("id").value = ingresso.id;
    document.getElementById("name").value = ingresso.descricao;
    document.getElementById("valor").value = ingresso.valor;
}

const editClientEmail = (id) => {
  db.query(`select * from ingresso where id ='${id}'`, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let ingresso = res.rows[0];
      fillFields(ingresso);
      document.getElementById("deletar").disabled = false;
      openModal();
    }
  });
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const saveClient = (event) => {
  let ingresso = {
    id : document.getElementById("id").value,
    descricao: document.getElementById("name").value,
    valor: document.getElementById("valor").value,
  };
  if (novo == true) {
      document.getElementById("id").hidden = true;
    createClient(ingresso);
    updateTable();
    closeModal();
    novo = false;
  } else {
    let index;
    db.query(
      `select ingresso.id from ingresso where ingresso.id='${ingresso.id}'`,
      (err, res) => {
        if (err) {
          updateErrorLog(query, err);
          console.log(err);
        } else {
            console.log(res)
          index = res.rows[0].id;
          updateClient(index, ingresso);
          updateTable();
          closeModal();
        }
      }
    );
  }
};

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const cadastrarCliente = () => {
  novo = true;
  document.getElementById("modal").classList.add("active");
  document.getElementById("deletar").disabled = false;
};

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
  document.getElementById("deletar").disabled = true;
  novo = false;
};

updateTable();

document
  .getElementById("cadastrarCliente")
  .addEventListener("click", cadastrarCliente);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document.getElementById("deletar").addEventListener("click", toDeleteClient);

document.getElementById("cancelar").addEventListener("click", closeModal);
