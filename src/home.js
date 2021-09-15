require("dotenv/config");
let wheater = document.getElementById("weather");
let wheaterDescription = document.getElementById("weather-description");
let hour = document.getElementById("hour");
let img = document.getElementById("img-weather");
let apiKey = process.env.API_KEY_FORECAST;
let url;
let request = new XMLHttpRequest();

//Atualiza previsão do tempo
wheater.innerText = "Temperatura em ";
// forecast.innerText = "Previsão para amanhã:";
let cep = document.getElementById("cep");

request.open("GET", `https://brasilapi.com.br/api/cep/v2/95900030`);
request.send();
request.responseType = "json";
request.onload = () => {
let info = request.response;
  let cityName = info.city;
  let uf = info.state;
  // url = `https://api.hgbrasil.com/weather?format=json-cors&fields=only_results,temp,description,time&key=${apiKey}&city_name=${info.city}`; API SÓ O BASICO
  url = `https://api.hgbrasil.com/weather?format=json-cors&key=${apiKey}&city_name=${info.city}`;
  request.open("GET", url);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    var response = request.response.results;

    //Ajeita imagem conforme o clima
    var condition = parseInt(response.condition_code)
    if ([0,1,3,4,37,38,39,47].includes(condition)){
      img.src = "../assets/img/weather/tempestade.png";
    }
    else if ([9,11,12,35,40,45].includes(condition)){
      img.src = "../assets/img/weather/chuva.png";
    }
    else if ([2,15,21,23,24].includes(condition)){
      img.src = "../assets/img/weather/vento.png";
    }
    else if ([13,15,16,17,18,41,42,43,46].includes(condition)){
      img.src = "../assets/img/weather/inverno.png";
    }
    else if ([25,27,31,32,33,44].includes(condition)){
      img.src = "../assets/img/weather/nuvem.png";
    }
    else {
      img.src = "../assets/img/weather/nublado.png";
    }

    wheaterDescription.innerText = response.description;
    wheater.innerText = ` ${cityName}: ` + response.temp +"°C, "; 
  };
};

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function startTime() {
today = new Date();
h = today.getHours();
m = today.getMinutes();
// add a zero in front of numbers<10
m = checkTime(m);
hour.innerText = h + ":" + m;
t = setTimeout(function() {
  startTime()
}, 500);
}

startTime();


