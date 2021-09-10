require("dotenv/config");
let cepBtn = document.getElementById("get-cep");
let wheater = document.getElementById("weather");
let forecast = document.getElementById("forecast");
let apiKey = process.env.HG_BRASIL_KEY;
let url;
let request = new XMLHttpRequest();

cepBtn.addEventListener("click", () => {
  wheater.innerText = "Temperatura em ";
  forecast.innerText = "Previsão para amanhã:";
  let cep = document.getElementById("cep");
  if (cep.value != null) {
    request.open("GET", `https://brasilapi.com.br/api/cep/v2/${cep.value}`);
    request.send();
    request.responseType = "json";
    request.onload = () => {
      let info = request.response;
      console.log(info);
      let cityName = info.city;
      let uf = info.state;
      url = `https://api.hgbrasil.com/weather?format=json-cors&key=${apiKey}&city_name=${cityName}`;
      request.open("GET", url);
      request.responseType = "json";
      request.send();
      request.onload = function () {
        var response = request.response.results;
        wheater.innerText +=
          ` ${cityName}: ` + response.temp +"C, " +response.description +". Hora: " + response.time;
        forecast.innerText +=" miníma:" + response.forecast[1].min +" C. Máxima:" + response.forecast[1].max + " C. Descrição: " +
          response.forecast[1].description;
        console.log(response);
      };
    };
  }
});
