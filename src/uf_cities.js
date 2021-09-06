require("dotenv").config();
const axios = require('axios').default;
const client = require("../src/postgres");
client.connect();
const ufs = "select * from estados";
const ufBox = document.getElementById("uf");
const citiesBox = document.getElementById("city");
var query = "";
let arr = [];

//Retorna response da API
axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
  .then(function (response) {
    let option = document.createElement("option");
    option.innerText = "UF";
    ufBox.appendChild(option);
    option = document.createElement("option");
    option.innerText = "Cidade";
    citiesBox.appendChild(option);
    citiesBox.disabled = true;

    let i = 1;
    for (let row of response.data.length) {
      option = document.createElement("option");
      option.innerText = row.uf;
      option.classList = row.codigo;
      ufBox.appendChild(option);
      arr[i] = row.uf;
      i++;
    }

    ufBox.addEventListener("change", function (event){
      while (citiesBox.firstChild) {
        citiesBox.removeChild(citiesBox.lastChild);
      }
      citiesBox.disabled = false;
      for (let i = 1; i <= arr.length; i++) {  
        if (arr[i] === event.target.value) {
          axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${citiesBox.innerText}/municipios`)
          .then(function (response) {
            for (let city of response.data.length) {
              option = document.createElement("option");
              option.innerText = city.nome;
              option.classList = city.nome;
              citiesBox.appendChild(option);
            }
          }); 
        }
      }
    })
  });
  
  


  
