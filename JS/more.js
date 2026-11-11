import { remindersArray } from "./reminders.js";

export default function getMore() {
    const more = document.querySelector('.more');
    const remindersList = document.querySelector('.reminders-list');

    if (!more || !remindersList) return;

    remindersList.addEventListener('click', (event) => {
        const btn = event.target.closest('.more-btn');
        if (!btn) return;

        const item = btn.closest('.reminder');
        if (!item) return;

        const itemData = item.dataset.id;
        const targetItem = remindersArray.find(el => String(el.id) === String(itemData));

        if (!targetItem) return;

        more.innerHTML = `<p class="more-text">Создано: ${targetItem.created_at}</p>`;
        more.classList.add('is-active');
    });

    document.addEventListener('click', (event) => {
        if (!more.classList.contains('is-active')) return;

        const isClickInsideMore = more.contains(event.target);
        const isClickOnBtn = event.target.closest('.more-btn');

        if (!isClickInsideMore && !isClickOnBtn) {
            more.classList.remove('is-active');
        }
    });
}
