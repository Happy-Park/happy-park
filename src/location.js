var map = L.map('map').setView([-29.4446788,-51.9583461], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-29.4446788,-51.9583461]).addTo(map).bindPopup('Happy Park');

var btnReturn = document.getElementById('return');
btnReturn.addEventListener('click', function() {
    window.location.href = 'home_user.html';
});