const db = require("../src/postgres").client;
db.connect()
const query = require("../src/postgres").insert;
const tableFunctions = require('../src/tableFunctions')
const crypto = require("crypto");
const Cleave = require("cleave.js");
const { getEnvironmentData } = require("worker_threads");
const updateErrorLog = require('../src/postgres').updateErrorLog
window.jsPDF = window.jspdf.jsPDF;
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const downloadTable = document.getElementById("downloadTable");
let currentClientSelected = [2];
var table = new Tabulator("#tableClient", {
  rowClick: function (e, row) {
    //saves the client's name and email for the selected row
    currentClientSelected[0] = row.getData().Email;
    currentClientSelected[1] = row.getData().Nome;
    editClientEmail(currentClientSelected[0]);
  },
  selectable: 1,
  layout: "fitColumns",
  reactiveData: true,
  columns: [
    {
      title: "Nome",
      field: "Nome",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar nome",
    },
    {
      title: "Email",
      field: "Email",
      headerFilter: true,
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar Email",
    },
    {
      title: "Telefone",
      field: "Telefone",
      headerFilter: "number",
      headerFilterLiveFilter: true,
      headerFilterPlaceholder: "Filtar telefone",
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

var cleave = new Cleave("#phone", {
  phone: true,
  phoneRegionCode: "br",
});

var cpfCleave = new Cleave("#cpf", {
  delimiters: [".", ".", "-"],
  blocks: [3, 3, 3, 2],
  numericOnly: true,
});

downloadTable.addEventListener("click", function () {
  table.download("pdf", "TabelaFuncionarios.pdf",{
    title: 'Relatório de Funcionários',
    autoTable: {
      theme: 'grid'
    },
    rowGroupStyles: 'grid'
    
  });
});

// CRUD - create read update delete
function deleteClient(user) {
  if (user != null && user != undefined) {
    const response = confirm(
      `Deseja realmente excluir o cliente '${user[1]}'?`
    );
    if (response) {
      let query = `delete from USUARIO where email='${user[0]}'`;
      db.query(query, (err, res) => {
        if (err) {
          updateErrorLog(query, err);
          notyf.error("Erro ao excluir o usuário. Verifique!");
          console.log(err);
        } else {
          notyf.success("Usuário excluído com sucesso!");
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

const readClient = (index) => {
  var x = "";
  const query = `select * from usuario where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
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
      updateErrorLog(query, err);
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};

const updateClient = (index, client) => {
  // COLOCAR CAMPO CIDADE DE VOLTA
  const query = `UPDATE usuario SET cpf = ${client.cpf}, nome = '${client.nome}', telefone = '${client.telefone}', email = '${client.email}', senha ='${client.senha}', nascimento = '${client.nascimento}', admin = ${client.admin} WHERE id = ${index}`;
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

const createClient = (client) => {
  const query = `insert into usuario values(default,${client.cpf},'${client.nome}','${client.telefone}','${client.email}','${client.senha}','${client.nascimento}',${client.admin},true, '${client.cidade}', '${client.uf}')`;
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
  const query = "select * from usuario where funcionario = true";
  db.query(query, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      notyf.error("Erro ao carregar os usuários. Verifique!");
      console.log(err);
    } else {
      let i = 0;
      //For each client in the array, adds its data to it
      res.rows.forEach((element) => {
        tableData[i] = {
          Nome: element.nome,
          Email: element.email,
          Telefone: element.telefone,
        };
        i++;
      });
      table.addData(tableData);
    }
  });
};

const createRow = (client) => {
  tableData.push({
    Nome: client.nome,
    Email: client.email,
    Telefone: client.telefone,
  });
};

const editClientEmail = (email) => {
  db.query(`select * from usuario where email ='${email}'`, (err, res) => {
    if (err) {
      updateErrorLog(query, err);
      console.log(err);
    } else {
      let client = res.rows[0];
      let data = new Date(client.nascimento);
      let date = data.toISOString().split("T")[0];
      client.nascimento = date;
      tableFunctions.fillFields(client)
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
          updateErrorLog(query, err);
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
