let glide = require('@glidejs/glide')
new glide('.glide', {
    type: 'slider',
    startAt: 0,
    focusAt: 'center',
    perView:2,
    gap:10
    
}).mount()

var map = L.map('map').setView([-29.4446788,-51.9583461], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-29.4446788,-51.9583461]).addTo(map).bindPopup('Happy Park');

let userAccountButton = document.getElementById('user-account')

userAccountButton.addEventListener('click', () => {
    window.location.href = '../pages/user_account.html'
})