document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById('username').value
        const passwordInput = document.getElementById('password').value
        console.log(usernameInput +" "+ passwordInput);
})
})