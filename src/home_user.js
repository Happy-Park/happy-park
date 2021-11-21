let glide = require('@glidejs/glide')
new glide('.glide', {
    type: 'slider',
    startAt: 0,
    focusAt: 'center',
    perView:2,
    gap:10
    
}).mount()

let userAccountButton = document.getElementById('user-account')

userAccountButton.addEventListener('click', () => {
    window.location.href = '../pages/user_account.html'
})