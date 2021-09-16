const db = require("./postgres");
const crypto = require("crypto");
const Cleave = require("cleave.js");
window.jsPDF = window.jspdf.jsPDF;
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const downloadTable = document.getElementById("downloadTable");
let currentAtracaoSelected = [2];
var table = new Tabulator("#tableAtracao", {
  rowClick: function (row) {
    //saves the client's name and email for the selected row
    currentAtracaoSelected[0] = row.getData().Email;
    currentAtracaoSelected[1] = row.getData().Nome;
    editClientEmail(currentAtracaoSelected[0]);
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

const readClientEmail = (email) => {
  var x = "";
  const query = `select * from usuario where email='${email}'`;
  db.query(query, (err, res) => {
    if (err) {
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};

const updateAtracao = (index, atracao) => {
  const query = `UPDATE atracao SET cpf = ${client.cpf}, nome = '${client.nome}', telefone = '${client.telefone}', email = '${client.email}', senha ='${client.senha}', nascimento = '${client.nascimento}', admin = ${client.admin} WHERE id = ${index}`;
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
  const query = `insert into atracao values(default,${client.cpf},'${client.nome}','${client.telefone}','${client.email}','${client.senha}','${client.nascimento}',${client.admin},true, '${client.cidade}', '${client.uf}')`;
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
  const query = "select * from atracao where funcionario = true";
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
          Email: element.Nome,
          Capacidade: element.Capacidade,
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
  senha.value = atracao.senha;
};

const editClientEmail = (email) => {
  db.query(`select * from usuario where email ='${email}'`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      let client = res.rows[0];
      let data = new Date(client.nascimento);
      let date = data.toISOString().split("T")[0];
      client.nascimento = date;
      fillFields(client);
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
  let client;
  let city = document.getElementById("city").value;
  let uf = document.getElementById("uf").value;
  client = {
    nome: document.getElementById("name").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("phone").value.replaceAll(" ", ""),
    cpf: document
      .getElementById("cpf")
      .value.replaceAll(".", "")
      .replaceAll("-", ""),
    nascimento: birthdate.value,
    senha: crypto
      .createHash("sha256")
      .update(document.getElementById("password").value)
      .digest("hex"),
    admin: document.getElementById("admin").checked,
    cidade: city,
    uf: uf,
    funcionario: true,
  };
  if (novo == true) {
    createClient(client);
    updateTable();
    closeModal();
    novo = false;
  } else {
    let index;
    db.query(
      // FAZER WHERE USANDO ID PARA PODER ALTERAR QUALQUER CAMPO
      `select usuario.id from usuario where usuario.cpf='${client.cpf}'`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          index = res.rows[0].id;
          updateClient(index, client);
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
  document.getElementById("password").disabled = false;
  document.getElementById("uf").disabled = false;
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
