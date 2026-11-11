function getFormattedDate(daysOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function renderFilteredList(items) {
  const list = document.querySelector('.reminders-list');
  if (!list) return;

  list.innerHTML = '';

  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'reminder';
    div.dataset.id = item.id;
    div.dataset.date = item.date;

    const mainText = document.createElement('p');
    mainText.className = 'main-text';
    mainText.textContent = item.text;

    const timeText = document.createElement('p');
    timeText.className = 'time-to-remind';
    timeText.textContent = `Напомнить: ${item.date}`;

    const moreBtn = document.createElement('button')
    moreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.8"/>
                            <circle cx="12" cy="12" r="1.8"/>
                            <circle cx="12" cy="19" r="1.8"/>
                        </svg>`
    moreBtn.className = 'more-btn'

    div.append(mainText, timeText, moreBtn);
    list.appendChild(div);
  });
}

export default function filter() {
  const filterList = document.querySelector('.filter-list');
  if (!filterList) return;

  filterList.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter');
    if (!btn) return;

    const remindersArray = JSON.parse(localStorage.getItem('reminder')) || [];
    const textBtn = btn.textContent.trim().toLowerCase();

    filterList.querySelectorAll('.filter').forEach((el) => el.classList.remove('is-active'));
    btn.classList.add('is-active');

    let filtered = remindersArray;

    if (textBtn === 'всё' || textBtn === 'все') {
      filtered = remindersArray;
    } else if (textBtn === 'завтра') {
      const tomorrowStr = getFormattedDate(1);
      filtered = remindersArray.filter((reminder) => reminder.date === tomorrowStr);
    } else if (textBtn === 'Эта неделя') {
      const todayStr = getFormattedDate(0);
      const nextWeekStr = getFormattedDate(7);
      filtered = remindersArray.filter(
        (reminder) => reminder.date >= todayStr && reminder.date <= nextWeekStr
      );
    }

    renderFilteredList(filtered);
  });
}
