const db = require("../src/postgres").client;
db.connect()
const updateErrorLog = require('../src/postgres').updateErrorLog
window.jsPDF = window.jspdf.jsPDF;
let currentLojaSelected = [2];
var table = new Tabulator("#tableLoja", {
  rowClick: function (e,row) {
    currentLojaSelected[0] = row.getData().Descricao;
    currentLojaSelected[1] = row.getData().Situacao;
    editAtracao(currentLojaSelected[0]);
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
function deleteLoja(loja) {
  if (loja != null && loja != undefined) {
    const response = confirm(
      `Deseja realmente excluir a atração '${loja[1]}'?`
    );
    if (response) {
      let query = `delete from lojacateg where descricao='${loja[0]}'`;
      db.query(query, (err, res) => {
        if (err) {
          notyf.error("Erro ao excluir a loja. Verifique!");
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

const toDeleteLoja = () => {
  deleteLoja(currentLojaSelected);
};

const readLoja = (index) => {
  var x = "";
  const query = `select * from lojacateg where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};


const updatelojacateg = (index, lojaCateg) => {
  const query = `UPDATE lojacateg SET descricao = '${lojaCateg.descricao}',situacao =${lojaCateg.situacao} WHERE id = ${index}`;
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

const createlojacateg= (lojaCateg) => {
  const query = `insert into lojacateg values(default,'${lojaCateg.descricao}','${lojaCateg.situacao}')`;
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
  const query = "select * from lojacateg";
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Erro ao carregar as lojas. Verifique!");
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


const fillFields = (lojaCateg) => {
  document.getElementById("descricao").value = lojaCateg.descricao;
  document.getElementById("situacao").value = lojaCateg.situacao;
};

const editLoja = (descricao) => {
  db.query(`select * from lojacateg where descricao ='${descricao}'`, (err, res) => {
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

const savelojacateg = (event) => {
  let lojacateg;
  lojacateg = {
    descricao: document.getElementById("descricao").value,
    situacao: document.getElementById("situacao").value
  };
  if (novo == true) {
    createlojacateg(lojacateg);
    updateTable();
    closeModal();
    novo = false;
  } else {
    let index;
    db.query(
      `select lojacateg.id from atracaocateg where lojacateg.descricao='${lojacateg.descricao}'`,
      (err, res) => {
        if (err) {
          updateErrorLog(query, err);
          console.log(err);
        } else {
          index = res.rows[0].id;
          updatelojacateg(index, lojacateg);
          updateTable();
          closeModal();
        }
      }
    );
  }
};

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const cadastrarlojacateg = () => {
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
  .getElementById("cadastrarLoja")
  .addEventListener("click", cadastrarlojacateg);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", savelojacateg);

document.getElementById("deletar").addEventListener("click", toDeleteLoja);

document.getElementById("cancelar").addEventListener("click", closeModal);
