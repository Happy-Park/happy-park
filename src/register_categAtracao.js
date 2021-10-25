const db = require("../src/postgres").client;
db.connect()
const updateErrorLog = require('../src/postgres').updateErrorLog
window.jsPDF = window.jspdf.jsPDF;
let currentAtracaoSelected = [2];
var table = new Tabulator("#tableAtracao", {
  rowClick: function (e,row) {
    currentAtracaoSelected[0] = row.getData().Descricao;
    currentAtracaoSelected[1] = row.getData().Situacao;
    editAtracao(currentAtracaoSelected[0]);
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
      headerFilterPlaceholder: "Filtrar ID",
    },
    {
      title: "Descrição",
      field: "Descrição",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtrar Descrição",
    },
    {
      title: "Situação",
      field: "Situação",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtrar Situação",
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

// CRUD - create read update delete
function deleteAtracao(atracao) {
  if (atracao != null && atracao != undefined) {
    const response = confirm(
      `Deseja realmente excluir a atração '${atracao[1]}'?`
    );
    if (response) {
      let query = `delete from atracaocateg where descricao='${atracao[0]}'`;
      db.query(query, (err, res) => {
        if (err) {
          notyf.error("Erro ao excluir a atração. Verifique!");
          console.log(err);
        } else {
          notyf.success("Atração excluída com sucesso!");
          updateTable();
          closeModal();
        }
      });
    }
  }
}

const toDeleteAtracao = () => {
  deleteAtracao(currentAtracaoSelected);
};

const readAtracao = (index) => {
  var x = "";
  const query = `select * from atracaocateg where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};


const updateatracaocateg = (index, atracaoCateg) => {
  const query = `UPDATE atracaocateg SET descricao = '${atracaoCateg.descricao}',situacao =${atracao.situacao} WHERE id = ${index}`;
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

const createatracaocateg= (atracaoCateg) => {
  const query = `insert into atracaocateg values(default,'${atracaoCateg.descricao}','${atracaoCateg.situacao}')`;
 console.log(query)
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
  const query = "select * from atracaocateg";
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Erro ao carregar as atrações. Verifique!");
      console.log(err);
    } else {
      let i = 0;
      res.rows.forEach((element) => {
        tableData[i] = {
          ID: element.id,
          Descrição: element.descricao,
          Situação: element.situacao,
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};


const fillFields = (atracaoCateg) => {
  document.getElementById("descricao").value = atracaoCateg.descricao;
  document.getElementById("situacao").value = atracaoCateg.situacao;
};

const editAtracao = (descricao) => {
  db.query(`select * from atracaocateg where descricao ='${descricao}'`, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let atracaocateg = res.rows[0];
      console.log(atracaocateg)
      fillFields(atracaocateg);
      document.getElementById("deletar").disabled = false;
      openModal();
    }
  });
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const saveatracaocateg = (event) => {
  let atracaocateg;
  atracaocateg = {
    descricao: document.getElementById("descricao").value,
    situacao: document.getElementById("situacao").value
  };
  if (novo == true) {
    createatracaocateg(atracaocateg);
    updateTable();
    closeModal();
    novo = false;
  } else {
    let index;
    db.query(
      // FAZER WHERE USANDO ID PARA PODER ALTERAR QUALQUER CAMPO
      `select atracaocateg.id from atracaocateg where atracaocateg.descricao='${atracaocateg.descricao}'`,
      (err, res) => {
        if (err) {
          updateErrorLog(query, err);
          console.log(err);
        } else {
          index = res.rows[0].id;
          updateatracaocateg(index, atracaocateg);
          updateTable();
          closeModal();
        }
      }
    );
  }
};

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const cadastraratracaocateg = () => {
  novo = true;
  document.getElementById("modal").classList.add("active");
};

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
  document.getElementById("deletar").disabled = true;
  novo = false;
};

updateTable();

document
  .getElementById("cadastrarAtracao")
  .addEventListener("click", cadastraratracaocateg);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveatracaocateg);

document.getElementById("deletar").addEventListener("click", toDeleteAtracao);

document.getElementById("cancelar").addEventListener("click", closeModal);
