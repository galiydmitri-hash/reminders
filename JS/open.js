export default function open(){
    const inputContainer = document.querySelector('.input-container')
    const bg = document.querySelector('.bg')
    const openBtn = document.querySelector('.open-btn')
    const closeBtn = document.querySelector('.close-btn')

    openBtn.addEventListener('click', () => {
        inputContainer.classList.add('is-active')
        bg.classList.add('is-active')
    })

    closeBtn.addEventListener('click', () => {
        inputContainer.classList.remove('is-active')
        bg.classList.remove('is-active')
    })
}