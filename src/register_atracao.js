const db = require("../src/postgres").client;
db.connect();
const updateErrorLog = require('../src/postgres').updateErrorLog
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let currentAtracaoSelected = [4];
var table = new Tabulator("#tableAtracao", {
  rowClick: function (e,row) {
    //saves the client's name and email for the selected row
    currentAtracaoSelected[0] = row.getData().Nome;
    currentAtracaoSelected[1] = row.getData().Capacidade;
    currentAtracaoSelected[2] = row.getData().Categoria;
    currentAtracaoSelected[3] = row.getData().ID;
    editAtracao(currentAtracaoSelected[3]);
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
    {title: 'Categoria',
  field:'Categoria',
  headerFilter: true,
  headerFilterLiveFilter: true,
  headerFilterPlaceholder: "Filtrar Categoria",}
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
      let query = `delete from atracao where descricao='${atracao[0]}'`;
      db.query(query, (err, res) => {
        if (err) {
          notyf.error("Erro ao excluir a atração. Verifique!");
          updateErrorLog(query, err);
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
      updateErrorLog(query, err);
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};


const updateAtracao = (index, atracao) => {
  let descricao = document.getElementById("name").value;
  let capacidade = document.getElementById("capacidade").value;
  const query = `UPDATE atracao SET descricao = '${descricao}',capacidade =${capacidade} WHERE id = ${index}`;
  console.log(query)
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Não foi possível editar o cadastro. Verifique!");
      updateErrorLog(query, err);
      console.log(err);
    } else {
      notyf.success("Edição realizada com sucesso!");
    }
  });
};

const createAtracao= (atracao) => {
  db.query(`select id from atracaoCateg where descricao='${atracao.categoria}'`, (err,res) => {
if(err){
  updateErrorLog(query, err);
  console.log(err)
}
else{
 let id = res.rows[0].id
  const query = `insert into atracao values(default,'${atracao.nome}',${atracao.capacidade}, ${id})`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Não foi possível realizar seu cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Cadastro realizado com sucesso!");
      updateTable()
    }
  });
}
  
})
};

const updateTable = () => {
  table.clearData();
  const query = "select * from atracao";
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar os as atrações. Verifique!");
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let i = 0;
      //For each atracao in the array, adds its data to it
      res.rows.forEach((element) => {
        tableData[i] = {
          ID: element.id,
          Nome: element.descricao,
          Capacidade: element.capacidade,
          Categoria: element.atracaocateg
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};

const fillFields = (atracao) => {
  document.getElementById("name").value = atracao.descricao;
  document.getElementById("capacidade").value = atracao.capacidade;
};

const editAtracao = (id) => {
  db.query(`select * from atracao where id ='${id}'`, (err, res) => {
    if (err) {
      console.log(err);
      updateErrorLog(query, err);
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
    capacidade: document.getElementById("capacidade").value,
    categoria: document.getElementById('atracaoCateg').value
  };
  if (novo == true) {
    createAtracao(atracao);
    updateTable();
    closeModal();
    novo = false;
  } else {
    atracao = currentAtracaoSelected;
    console.log(atracao)
    let index;
    db.query(
      // FAZER WHERE USANDO ID PARA PODER ALTERAR QUALQUER CAMPO
      `select atracao.id from atracao where atracao.id='${atracao[3]}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          updateErrorLog(query, err);
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
      document.getElementById("modal").classList.add("active");
}

const cadastrarAtracao = () => {
  novo = true;
  let atracaoCateg = document.getElementById('atracaoCateg')
  db.query(`select * from atracaocateg`, (err, res) => {
    if(err){
      console.log(err)
      updateErrorLog(query, err);
    }
    else{
      let results = []
      let option = document.createElement("option");
      option.innerText = "Categoria";
      atracaoCateg.appendChild(option);
      for(let row of res.rows){
        results[0] = row.id
        results[1] = row.descricao
        option = document.createElement('option')
        option.innerText = results[1]
        option.classList = results[0]
        atracaoCateg.appendChild(option)
      }
  document.getElementById("modal").classList.add("active");
  }})
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
