let userData = JSON.parse(localStorage.getItem('user')) || null;

export function getEmail(){
    if (userData === null) return

    const email = userData.email

    return email
}

export default function registration() {
    const inputName = document.querySelector('.name');
    const registrationBtn = document.querySelector('.register-btn');
    const inputEmail = document.querySelector('.email');
    const registerForm = document.querySelector('.register-form');
    const greetMessage = document.querySelector('.greeting');
    const bg = document.querySelector('.bg')

    if (userData) {
        greetMessage.innerHTML = `Добрый день, <p class="name-text">${userData.name}</p>`;
        registerForm.classList.remove('is-active')
        bg.classList.remove('is-active')
        bg.classList.remove('is-home')
    } else {
        registerForm.classList.add('is-active')
        bg.classList.add('is-active')
        bg.classList.add('is-home')
    }

    registrationBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const name = inputName.value.trim();
        const email = inputEmail.value.trim();

        if (!name || !email) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        userData = { name, email };
        localStorage.setItem('user', JSON.stringify(userData));

        greetMessage.innerHTML = `Добрый день, <p class="name-text">${userData.name}</p>`;
        registerForm.classList.remove('is-active')
        bg.classList.remove('is-active')
        bg.classList.remove('is-home')

        inputName.value = '';
        inputEmail.value = ''
    });
}
