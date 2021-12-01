const db = require("../src/postgres").client;
db.connect();
const updateErrorLog = require("../src/postgres").updateErrorLog;
window.jsPDF = window.jspdf.jsPDF;
const downloadTable = document.getElementById("downloadTable");
let currentLojaSelected = [4];
var table = new Tabulator("#tableLoja", {
  rowClick: function (e, row) {
    //saves the client's name and email for the selected row
    currentLojaSelected[0] = row.getData().Nome;
    currentLojaSelected[1] = row.getData().CNPJ;
    currentLojaSelected[2] = row.getData().Categoria;
    currentLojaSelected[3] = row.getData().ID;
    editLoja(currentLojaSelected[3]);
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
      title: "CNPJ",
      field: "CNPJ",
      headerFilter: "number",
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtrar CNPJ",
    },
    {
      title: "Categoria",
      field: "Categoria",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtrar Categoria",
    },
  ],
});

const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

let tableData = [];
var novo = false;

downloadTable.addEventListener("click", function () {
  table.download("pdf", "TabelaLojas.pdf");
});

// CRUD - create read update delete
function deleteLoja(loja) {
  if (loja != null && loja != undefined) {
    const response = confirm(`Deseja realmente excluir a loja '${loja[1]}'?`);
    if (response) {
      let query = `delete from loja where nome='${loja[0]}'`;
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

const toDeleteLoja = () => {
  deleteLoja(currentLojaSelected);
};

const readLoja = (index) => {
  var x = "";
  const query = `select * from loja where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};

const updateloja = (index, loja) => {
  let nome = document.getElementById("name").value;
  const query = `UPDATE loja SET nome = '${nome}' WHERE id = ${index}`;
  console.log(query);
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

const createLoja = (loja) => {
  db.query(
    `select id from lojaCateg where descricao='${loja.categoria}'`,
    (err, res) => {
      if (err) {
        updateErrorLog(query, err);
        console.log(err);
      } else {
        let id = res.rows[0].id;
        const query = `insert into loja values(default,'${loja.cnpj}','${loja.nome}', ${id})`;
        db.query(query, (err, res) => {
          if (err) {
            updateErrorLog(query, err);
            notyf.error("Não foi possível realizar seu cadastro. Verifique!");
            console.log(err);
          } else {
            notyf.success("Cadastro realizado com sucesso!");
            updateTable();
          }
        });
      }
    }
  );
};

const updateTable = () => {
  table.clearData();
  const query = "select * from loja";
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar as lojas. Verifique!");
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let i = 0;
      //For each loja in the array, adds its data to it
      res.rows.forEach((element) => {
        tableData[i] = {
          ID: element.id,
          Nome: element.nome,
          CNPJ: element.cnpj,
          Categoria: element.lojacateg_id,
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};

const fillFields = (loja) => {
  document.getElementById("name").value = loja.nome;
  document.getElementById("cnpj").value = loja.cnpj;
};

const editLoja = (id) => {
  db.query(`select * from loja where id ='${id}'`, (err, res) => {
    if (err) {
      console.log(err);
      updateErrorLog(query, err);
    } else {
      let loja = res.rows[0];
      fillFields(loja);
      document.getElementById("deletar").disabled = false;
      openModal();
    }
  });
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const saveLoja = (event) => {
  let loja;
  loja = {
    nome: document.getElementById("name").value,
    cnpj: document.getElementById("cnpj").value,
    categoria: document.getElementById("lojaCateg").value,
  };
  if (novo == true) {
    createLoja(loja);
    updateTable();
    closeModal();
    novo = false;
  } else {
    loja = currentLojaSelected;
    console.log(loja);
    let index;
    db.query(
      // FAZER WHERE USANDO ID PARA PODER ALTERAR QUALQUER CAMPO
      `select loja.id from loja where loja.id='${loja[3]}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          updateErrorLog(query, err);
        } else {
          index = res.rows[0].id;
          updateloja(index, loja);
          updateTable();
          closeModal();
        }
      }
    );
  }
};

const openModal = () => {
  document.getElementById("modal").classList.add("active");
};

const cadastrarLoja = () => {
  novo = true;
  let lojaCateg = document.getElementById("lojaCateg");
  db.query(`select * from lojacateg`, (err, res) => {
    if (err) {
      console.log(err);
      updateErrorLog(query, err);
    } else {
      let results = [];
      let option = document.createElement("option");
      option.innerText = "Categoria";
      lojaCateg.appendChild(option);
      for (let row of res.rows) {
        results[0] = row.id;
        results[1] = row.descricao;
        option = document.createElement("option");
        option.innerText = results[1];
        option.classList = results[0];
        lojaCateg.appendChild(option);
      }
      document.getElementById("modal").classList.add("active");
    }
  });
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
  .addEventListener("click", cadastrarLoja);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveLoja);

document.getElementById("deletar").addEventListener("click", toDeleteLoja);

document.getElementById("cancelar").addEventListener("click", closeModal);
