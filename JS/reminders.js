import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { getEmail } from './registration.js';

const supabaseUrl = 'https://lawseqpqqhkefdabnelm.supabase.co';
const supabaseKey = 'sb_publishable_oHo8FU1rfBko0-aJrZNXzA_iDwlj-FT';
const supabase = createClient(supabaseUrl, supabaseKey);

export let remindersArray = JSON.parse(localStorage.getItem('reminder')) || [];

function saveToLocalStorage() {
  localStorage.setItem('reminder', JSON.stringify(remindersArray));
}

function getTodayString() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
}

export default async function reminders() {
  const addBtn = document.querySelector('.add-btn');
  const inputText = document.querySelector('.text');
  const inputDate = document.querySelector('.date');
  const list = document.querySelector('.reminders-list');
  const inputContainer = document.querySelector('.input-container')
  const bg = document.querySelector('.bg')

  if (!addBtn || !inputText || !inputDate || !list) {
    return;
  }

  const userEmail = getEmail();
  if (!userEmail) {
    console.error('Ошибка: пользователь не авторизован (нет email)');
    return;
  }

  const today = getTodayString();

  function renderReminders(itemsToRender = remindersArray) {
    list.innerHTML = '';
    itemsToRender.forEach((item) => {
      createReminderElement(item.text, item.date, item.id);
    });
  }

  function createReminderElement(text, date, id = crypto.randomUUID()) {
    const item = document.createElement('div');
    item.className = 'reminder';
    item.dataset.id = id;
    item.dataset.date = date;

    const mainText = document.createElement('p');
    mainText.className = 'main-text';
    mainText.textContent = text;

    const timeText = document.createElement('p');
    timeText.className = 'time-to-remind';
    timeText.textContent = `Напомнить: ${date}`;
    
    const moreBtn = document.createElement('button')
    moreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.8"/>
                            <circle cx="12" cy="12" r="1.8"/>
                            <circle cx="12" cy="19" r="1.8"/>
                        </svg>`
    moreBtn.className = 'more-btn'

    item.append(mainText, timeText, moreBtn);
    list.appendChild(item);
    return item;
  }

  remindersArray = remindersArray.filter((item) => item.date >= today);
  saveToLocalStorage();
  renderReminders();

  const { error: deleteError } = await supabase
    .from('reminders')
    .delete()
    .eq('email', userEmail)
    .lt('date', today);

  if (deleteError) {
    console.error('Ошибка при удалении старых записей:', deleteError.message);
  }

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('email', userEmail)
    .order('date', { ascending: true });

  if (error) {
    console.error('Ошибка при загрузке:', error.message);
    return;
  }

  if (data) {
    remindersArray = data;
    saveToLocalStorage();
    renderReminders();
  }

  addBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    const date = inputDate.value.trim();
    const email = getEmail();
    const currentToday = getTodayString();

    if (!email) {
      console.error('Нет такого имейла');
      return;
    }

    if (text === '' || date === '' || date < currentToday) {
      return;
    }

    addBtn.disabled = true;

    const { data: newReminder, error: insertError } = await supabase
      .from('reminders')
      .insert([{ text, date, email }])
      .select()
      .single();

    addBtn.disabled = false;

    if (insertError) {
      console.error('Ошибка при добавлении:', insertError.message);
      return;
    }

    remindersArray.push(newReminder);
    remindersArray.sort((a, b) => a.date.localeCompare(b.date));
    saveToLocalStorage();
    renderReminders();

    inputContainer.classList.remove('is-active')
    bg.classList.remove('is-active')

    inputText.value = '';
    inputDate.value = '';
  });
}