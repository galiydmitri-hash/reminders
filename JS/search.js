export default function search(){
    const searchInput = document.querySelector('.search');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const searchInputValue = searchInput.value.trim().toLowerCase();
        const listItems = document.querySelectorAll('.reminders-list .reminder');

        listItems.forEach((item) => {
            const textEl = item.querySelector('.main-text'); 
            if (!textEl) return;

            const text = textEl.textContent.toLowerCase();

            if (text.includes(searchInputValue)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}