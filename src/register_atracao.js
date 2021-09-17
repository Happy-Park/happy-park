const db = require("../src/postgres");
const crypto = require("crypto");
const Cleave = require("cleave.js");
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let currentAtracaoSelected = [2];
var table = new Tabulator("#tableAtracao", {
  rowClick: function (row) {
    //saves the client's name and email for the selected row
    currentAtracaoSelected[0] = row.getData().Nome;
    currentAtracaoSelected[1] = row.getData().Capacidade;
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
      title: "Nome",
      field: "Nome",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtrar Nome",
    },
    {
      title: "Capacidade",
      field: "Capacidade",
      headerFilter: "number",
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtrar Capacidade",
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
  table.download("pdf", "TabelaAtracoes.pdf");
});

// CRUD - create read update delete
function deleteAtracao(atracao) {
  if (atracao != null && atracao != undefined) {
    const response = confirm(
      `Deseja realmente excluir a atração '${atracao[1]}'?`
    );
    if (response) {
      let query = `delete from atracao where nome='${atracao[0]}'`;
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
  const query = `select * from atracao where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};


const updateAtracao = (index, atracao) => {
  const query = `UPDATE atracao SET nome = '${atracao.nome}',capacidade =${atracao.capacidade} WHERE id = ${index}`;
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Não foi possível editar o cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Edição realizada com sucesso!");
    }
  });
};

const createAtracao= (atracao) => {
  const query = `insert into atracao values(default,'${atracao.nome}',${atracao.capacidade})`;
 console.log(query)
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Não foi possível realizar seu cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Cadastro realizado com sucesso!");
    }
  });
};

const updateTable = () => {
  table.clearData();
  const query = "select * from atracao";
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar os as atrações. Verifique!");
      console.log(err);
    } else {
      let i = 0;
      //For each atracao in the array, adds its data to it
      res.rows.forEach((element) => {
        tableData[i] = {
          ID: element.ID,
          Nome: element.Nome,
          Capacidade: element.Capacidade,
          Categoria: element.Categoria
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};

const createRow = (atracao) => {
  tableData.push({
    ID: atracao.id,
    Nome: atracao.nome,
    Capacidade: atracao.capacidade,
  });
};

const fillFields = (atracao) => {
  document.getElementById("name").value = atracao.nome;
  document.getElementById("capacidade").value = atracao.email;
};

const editAtracao = (nome) => {
  db.query(`select * from atracao where nome ='${nome}'`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      let atracao = res.rows[0];
      fillFields(atracao);
      document.getElementById("deletar").disabled = false;
      openModal();
    }
  });
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const saveAtracao = (event) => {
  let atracao;
  atracao = {
    nome: document.getElementById("name").value,
    capacidade: document.getElementById("capacidade").value
  };
  if (novo == true) {
    createAtracao(atracao);
    updateTable();
    closeModal();
    novo = false;
  } else {
    let index;
    db.query(
      // FAZER WHERE USANDO ID PARA PODER ALTERAR QUALQUER CAMPO
      `select atracao.id from atracao where atracao.nome='${atracao.nome}'`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          index = res.rows[0].id;
          updateAtracao(index, atracao);
          updateTable();
          closeModal();
        }
      }
    );
  }
};

const openModal = () => {
  let atracaoCateg = document.getElementById('atracaoCateg')
  db.query(`select descricao from atracaocateg`, (err, res) => {
    if(err){
      console.log(err)
    }
    else{
      let option = document.createElement("option");
      option.innerText = "Categoria";
      atracaoCateg.appendChild(option);
      for(let row of res.rows){
        option 
      }
      document.getElementById("modal").classList.add("active");
    }
  })
  
  
}
  

const cadastrarAtracao = () => {
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
  .addEventListener("click", cadastrarAtracao);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveAtracao);

document.getElementById("deletar").addEventListener("click", toDeleteAtracao);

document.getElementById("cancelar").addEventListener("click", closeModal);
