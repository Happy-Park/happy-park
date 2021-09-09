let wheater = document.getElementById('weather')
let forecast = document.getElementById('forecast')
let apiKey  = 'baddcdc6'
let url = `https://api.hgbrasil.com/weather?format=json-cors&key=${apiKey}&city_name=Lajeado,RS`


let request = new XMLHttpRequest();
request.open('GET', url)
request.responseType = 'json';
request.send();

request.onload = function() {
  var response = request.response.results;
wheater.innerText +=' ' + response.temp + 'C, ' + response.description + '. Hora: ' + response.time
forecast.innerText += ' miníma:' + response.forecast[1].min + ' C. Máxima:' + response.forecast[1].max + ' C. Descrição: ' + response.forecast[1].description
console.log(response)
}