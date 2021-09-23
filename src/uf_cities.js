require("dotenv").config();
const axios = require('axios').default;
const ufBox = document.getElementById("uf");
const citiesBox = document.getElementById("city");
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
    // console.log(response.data[0].sigla);
    for (let row of response.data) {
      option = document.createElement("option");
      option.innerText = row.sigla;
      option.classList = row.id;
      ufBox.appendChild(option);
      arr[i] = row.uf;
      i++;
    }

    ufBox.addEventListener("change", function (event){
      while (citiesBox.firstChild) {
        citiesBox.removeChild(citiesBox.lastChild);
      }
      citiesBox.disabled = false;
      console.log(ufBox.children[ufBox.selectedIndex].innerText);
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufBox.children[ufBox.selectedIndex].innerText}/municipios`)
      .then(function (response) {
        let cities = response; 
        for (let city of response.data) {
          option = document.createElement("option");
          option.innerText = city.nome;
          option.classList = city.id;
          citiesBox.appendChild(option);
        } 
      }); 
    })   
  });
     
