const db = require("../src/postgres");
const crypto = require("crypto");
const Cleave = require("cleave.js");
require("cleave.js/dist/addons/cleave-phone.br");
require("cleave.js/src/addons/phone-type-formatter.br");
const button = document.getElementById("register-btn");
const name = document.getElementById("name");
const email = document.getElementById("email");
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
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

// button.addEventListener("click", function () {
//   let password = document.getElementById("password").value;
//   password = crypto.createHash("sha256").update(password).digest("hex");
//   let date = Date.now();
//   var cityNumber;
//   let city = document.getElementById("city");
//   city = capitalize(city.value);
//   let phone = document.getElementById("phone");
//   let cpf = document.getElementById("cpf");
//   phone = phone.value.replaceAll(" ", "");
//   let admin = document.getElementById("admin");
//   admin = admin.checked;

//   db.query(
//     `select cidades.id from cidades where cidades.nome='${city}'`,
//     (err, res) => {
//       if (err) {
//         console.log(err);
//       }
//       cityNumber = res.rows[0].id;
//       const query = `insert into usuario values(default,${cpf.value.replaceAll(".", "").replaceAll("-", "")},'${name.value}','${phone.value}','${email.value}','${password}','${birthdate.value}',${cityNumber},${admin},'true')`;
//       console.log(query);
//       db.query(query, (err, res) => {
//         if (err) {
//           // notyf.error("Não foi possível realizar seu cadastro. Verifique!");
//           console.log(err);
//         } else {
//           notyf.success("Cadastro realizado com sucesso!");
//           window.location.href = "../pages/home.html";
//         }
//         console.log(res);
//       });
//     }
//   );
// });

// CRUD - create read update delete
const deleteClient = (index) => {
  let query = `delete from USUARIO where ID=${index} truncate`;
  db.query(query, (err, res) => {
    if (err) {
      notyf.error("Erro ao excluir o usuário. Verifique!");
      console.log(err);
    } else {
      notyf.success("Usuário excluído com sucesso!");
      updateTable();  
    }
  });
}

const readClient = (index) => {
  debugger;
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
  const query = `UPDATE tbl_cadarço SET cpf = ${client.cpf}, nome = ${client.nome}, telefone = ${client.phone}, email = ${client.email}, senha = ${client.senha}, nascimento = ${client.nascimento}, cidade = ${client.cidade}, admin = ${client.admin} FROM usuario WHERE id = ${index}`;
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
  const query = `insert into usuario values(default,${client.cpf},'${client.nome}','${client.phone}','${client.email}','${client.senha}','${client.nascimento}',${client.cidade},${client.admin},'true')`;
  console.log(query);
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
  debugger
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
  document.getElementById('name').value = client.nome
  document.getElementById('email').value = client.email
  document.getElementById('phone').value = client.telefone
  document.getElementById('cidade').value = client.cidade
  document.getElementById('cpf').value = client.cpf
  document.getElementById('nascimento').value = client.nascimento
  document.getElementById('admin').checked = client.admin
}

const editClient = (index) => {
  const client = readClient(index);
  fillFields(client);
  openModal();
}

const editDelete = (event) => {
  debugger;
  if (event.target.type == 'button') {

      const [action, index] = event.target.id.split('-')

      if (action == 'edit') {
          editClient(index)
      } else {
          const client = readClient(index);
          const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
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

const saveClient = () => {
  debugger;
  var city = document.getElementById('city').value
  db.query(`select cidades.id from cidades where cidades.nome='${city}'`,
    (err, res) => {
    if (err) {
      console.log(err);
    }
    city = res.rows[0].id;
  });  
  const client = {
      nome: document.getElementById('name').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('phone').value,
      cpf: document.getElementById("cpf").replaceAll(".", "").replaceAll("-", ""),
      nascimento: birthdate.value,
      senha: crypto.createHash("sha256").update(document.getElementById("password").value).digest("hex"),
      admin:document.getElementById("admin").checked,
      cidade:city,
      funcionario: True
  }
  if (novo == true) {
      createClient(client)
      updateTable()
      closeModal()
      novo = false;
  } else {
      updateClient(index, client)
      updateTable()
      closeModal()
  }
}

const openModal = () => document.getElementById('modal')
    .classList.add('active');

const cadastrarCliente = () => {
  novo = true;
  document.getElementById('modal').classList.add('active');
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