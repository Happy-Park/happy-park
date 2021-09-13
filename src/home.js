require("dotenv/config");
let cepBtn = document.getElementById("get-cep");
let wheater = document.getElementById("weather");
let img = document.getElementById("img-weather");
let apiKey = process.env.API_KEY_FORECAST;
let cityName;
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
  console.log(info);
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
    if (parseInt(response.condition_code) in [0,1,3,4,37,38,39,47]){
      img.src = "../assets/img/weather/tempestade.png";
    }
    else if (parseInt(response.condition_code) in [9,11,12,35,40,45]){
      img.src = "../assets/img/weather/chuva.png";
    }
    else if (parseInt(response.condition_code) in [2,15,21,23,24]){
      img.src = "../assets/img/weather/vento.png";
    }
    else if (parseInt(response.condition_code) in [13,15,16,17,18,41,42,43,46]){
      img.src = "../assets/img/weather/inverno.png";
    }
    else if (parseInt(response.condition_code) in [25,27,31,32,33,44]){
      img.src = "../assets/img/weather/nuvem.png";
    }
    else {
      img.src = "../assets/img/weather/nublado.png";
    }

    wheater.innerText +=
      ` ${cityName}: ` + response.temp +"°C, " +response.description +". Hora: " + response.time;
    // forecast.innerText +=" Miníma:" + response.forecast[1].min +" °C Máxima:" + response.forecast[1].max + " °C. Descrição: " +
    //   response.forecast[1].description;
    console.log(response);
  };
};


