const db = require("../src/postgres");
const crypto = require("crypto");
const Cleave = require("cleave.js");
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const button = document.getElementById("register-btn");
const name = document.getElementById("name");
const email = document.getElementById("email");
var table = new Tabulator("#tableClient", {
  rowClick: function(e,row){
    editClientEmail(row.getData().Email);
  },
  selectable: 1,
  layout: "fitColumns",
  reactiveData: true,
  columns: [
    { title: "Nome", field: "Nome" },
    { title: "Email", field: "Email" },
    { title: "Telefone", field: "Telefone" },
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

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var cleave = new Cleave("#phone", {
  phone: true,
  phoneRegionCode: "br",
});

var cpfCleave = new Cleave("#cpf", {
  delimiters: [".", ".", "-"],
  blocks: [3, 3, 3, 2],
  numericOnly: true,
});

// CRUD - create read update delete
const deleteClient = (index) => {
  let query = `delete from USUARIO where ID=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao excluir o usuário. Verifique!");
      console.log(err);
    } else {
      notyf.success("Usuário excluído com sucesso!");
      updateTable();
    }
  });
};

const readClient = (index) => {
  //debugger;
  var x = "";
  const query = `select * from usuario where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
};

const readClientEmail = (email) => {
  //debugger;
  var x = "";
  const query = `select * from usuario where email='${index}'`;
  db.query(query, (err, res) => {
    if (err) {
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
      notyf.error("Não foi possível editar o cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Edição realizada com sucesso!");
    }
  });
};

const createClient = (client) => {
  const query = `insert into usuario values(default,${client.cpf},'${client.nome}','${client.telefone}','${client.email}','${client.senha}','${client.nascimento}',${client.cidade},${client.admin}, true)`;
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Não foi possível realizar seu cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Cadastro realizado com sucesso!");
    }
  });
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableClient>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  table.clearData();
  //debugger
  const query = "select * from usuario where funcionario = true";
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar os usuários. Verifique!");
      console.log(err);
    } else {
      let i = 0;
      res.rows.forEach((element) => {
        tableData[i] = {
          Nome: element.nome,
          Email: element.email,
          Telefone: element.telefone,
        };
        i++;
      });
      //     for (let i = 0; i < res.rows.length; i++) {
      //   tableData[i] = {name:res.rows.nome, email:res.rows.email, telefone:res.rows.telefone}
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

const fillFields = (client) => {
  let rows;
  db.query(
    `select cidades.nome, estados.uf from cidades, estados where cidades.id=${client.cidade} and cidades.id_estado=estados.id`,
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        rows = res.rows;
      }
      document.getElementById("name").value = client.nome;
      document.getElementById("email").value = client.email;
      document.getElementById("phone").value = client.telefone;
      document.getElementById("uf").disabled = true;
      //document.getElementById('uf').value = rows[0].uf
      document.getElementById("cpf").value = client.cpf;
      document.getElementById("birthdate").value = client.nascimento;
      document.getElementById("admin").checked = client.admin;
      let senha = document.getElementById("password");
      senha.value = client.senha;
      senha.disabled = true;
      document.getElementById("city").disabled = true;
      //document.getElementById('city').selected = rows[0].nome
    }
  );
};

const editClient = (index) => {
  db.query(`select * from usuario where id=${index}`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      let client = res.rows[0];
      let data = new Date(client.nascimento);
      let date = data.toISOString().split("T")[0];
      client.nascimento = date;
      fillFields(client);
      openModal();
    }
  });
};

const editClientEmail = (email) => {
  db.query(`select * from usuario where email ='${email}'`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      let client = res.rows[0];
      console.log(client)
      let data = new Date(client.nascimento);
      let date = data.toISOString().split("T")[0];
      client.nascimento = date;
      fillFields(client);
      openModal();
    }
  });
};

const editDelete = (event) => {
  console.log(event)
  //debugger;
  if (event.type == "click") {
      let client = readClient(index);
      const response = confirm(
        `Deseja realmente excluir o cliente ${client.nome}?`
      );
      if (response) {
        deleteClient(index);
        updateTable();
      }
    }
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

//problema de escopo de variaveis na funcao saveClient
const saveClient = (event) => {
  //debugger;
  let client;
  let city = document.getElementById("city").value;
  db.query(
    `select cidades.id from cidades where cidades.nome='${city}'`,
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        if (res.rowCount > 0) {
          city = res.rows[0].id;
        }
      }
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
        funcionario: true,
      };
      console.log(client);
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
    }
  );
};

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const cadastrarCliente = () => {
  novo = true;
  document.getElementById("modal").classList.add("active");
  document.getElementById("password").disabled = false;
};

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
  novo = false;
};

updateTable();

document
  .getElementById("cadastrarCliente")
  .addEventListener("click", cadastrarCliente);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document.getElementById('delete').addEventListener('click', editDelete);

document.getElementById("cancelar").addEventListener("click", closeModal);
