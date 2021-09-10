const db = require("../src/postgres");
const crypto = require("crypto");
const Cleave = require("cleave.js");
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const button = document.getElementById("register-btn");
const name = document.getElementById("name");
const email = document.getElementById("email");
const notyf = new Notyf({
  duration: 2000,
  position: {
    x: "right",
    y: "top"
  }});
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
      //updateTable();  
    }
  });
}

const readClient = (index) => {
  //debugger;
  var x = '';
  const query = `select * from usuario where id=${index}`;
  db.query(query, (err, res) => {
    if (err) {
      console.log(err);
    }
    x = res.rows[0];
  });
  return x;
}

const updateClient = (index, client) => {
  // COLOCAR CAMPO CIDADE DE VOLTA
  const query = `UPDATE usuario SET cpf = ${client.cpf}, nome = '${client.nome}', telefone = '${client.telefone}', email = '${client.email}', senha ='${client.senha}', nascimento = '${client.nascimento}', admin = ${client.admin} WHERE id = ${index}`;
  console.log(query);
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Não foi possível editar o cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Edição realizada com sucesso!");
    }
    console.log(res);
  });
}

const createClient = (client) => {
  const query = `insert into usuario values(default,${client.cpf},'${client.nome}','${client.telefone}','${client.email}','${client.senha}','${client.nascimento}',${client.cidade},${client.admin}, true)`;
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Não foi possível realizar seu cadastro. Verifique!");
      console.log(err);
    } else {
      notyf.success("Cadastro realizado com sucesso!");
    }
    console.log(res);
  });
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr');
  rows.forEach(row => row.parentNode.removeChild(row));
}

const updateTable = () => {
  clearTable();
  //debugger
  const query = 'select * from usuario where funcionario = true';
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao carregar os usuários. Verifique!");
      console.log(err);
    } else {
      for (let i = 0; i < res.rows.length; i++) {
        createRow(res.rows[i]);
      } 
    }
  });
}

const createRow = (client) => {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
      <td>${client.nome}</td>
      <td>${client.email}</td>
      <td>${client.telefone}</td>
      <td>
          <button type="button" class="button green" id="edit-${client.id}">Editar</button>
          <button type="button" class="button red" id="delete-${client.id}" >Excluir</button>
      </td>
  `;
  document.querySelector('#tableClient>tbody').appendChild(newRow);
}

const fillFields = (client) => {
  let rows;
  db.query(`select cidades.nome, estados.uf from cidades, estados where cidades.id=${client.cidade} and cidades.id_estado=estados.id`, (err, res) => {
    if(err){
      console.log(err)
    }
    else{
    rows = res.rows;
    }
  document.getElementById('name').value = client.nome
  document.getElementById('email').value = client.email
  document.getElementById('phone').value = client.telefone
  document.getElementById('uf').disabled = true
  //document.getElementById('uf').value = rows[0].uf
  document.getElementById('cpf').value = client.cpf
  document.getElementById('birthdate').value = client.nascimento
  document.getElementById('admin').checked = client.admin
  let senha = document.getElementById('password');
  senha.value = client.senha
  senha.disabled = true;
  document.getElementById('city').disabled = true
  //document.getElementById('city').selected = rows[0].nome
})}

const editClient = (index) => {
  db.query(`select * from usuario where id=${index}`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      let client = res.rows[0];
      let data = new Date(client.nascimento)
      let date = data.toISOString().split("T")[0]
      client.nascimento = date
      fillFields(client);
      openModal();
    }
  });
};

const editDelete = (event) => {
  //debugger;
  if (event.target.type == 'button') {
      const [action, index] = event.target.id.split('-')
  
      if (action == 'edit') {
          editClient(index)
      } else {
          let client = readClient(index);
          const response = confirm(`Deseja realmente excluir o cliente ${client.nome}?`)
          if (response) {
              deleteClient(index)
              updateTable()
          }
      }
  }
}

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => field.value = "")
}

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
        console.log(res)
        if(res.rowCount > 0){
          city = res.rows[0].id;
        }
      }
      client = {
        nome: document.getElementById("name").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("phone").value.replaceAll(" ",""),
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
      console.log(client)
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

const openModal = () => document.getElementById('modal')
    .classList.add('active');

const cadastrarCliente = () => {
  novo = true;
  document.getElementById('modal').classList.add('active')
  document.getElementById('password').disabled = false;
}

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
    novo = false;
}

updateTable();

document.getElementById('cadastrarCliente')
    .addEventListener('click', cadastrarCliente);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', saveClient);

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete);

document.getElementById('cancelar')
    .addEventListener('click', closeModal);