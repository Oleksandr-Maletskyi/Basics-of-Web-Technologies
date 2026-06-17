// ============================================================
// Завдання 5 — Пошук країн з debounce + AbortController
// ============================================================
// API:
//   GET https://restcountries.com/v3.1/name/{query}
//   Повертає масив країн із полями: name.common, capital, population, flag (emoji)
//
// Вимоги:
//   1. event "input" на #search → fetch
//   2. Debounce 300 мс через setTimeout/clearTimeout
//   3. AbortController — скасовує попередній запит
//   4. Рендер: flag, name, capital, population
//   5. Стан #status: "Шукаю...", "Знайдено N", "Нічого не знайдено", "Помилка"
//   6. Якщо query.length < 2 — нічого не робити
// ============================================================

const API = "https://restcountries.com/v3.1/name/";

// TODO

const searchInput = document.getElementById('search');
const statusEl = document.getElementById('status');
const resultsContainer = document.getElementById('results');

let timeoutId, controller;

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    clearTimeout(timeoutId);

    if (query.length < 2) {
        if (controller) controller.abort();
        resultsContainer.innerHTML = '';
        statusEl.textContent = '';
        return;
    }

    timeoutId = setTimeout(async () => {
        if (controller) controller.abort();
        console.log("Аборт запиту", controller);
        controller = new AbortController();
        console.log("Створено новий запит", controller);

        statusEl.textContent = 'Шукаю...';
        statusEl.style.color = '#888';
        resultsContainer.innerHTML = '';

        try {
            const res = await fetch(API + query, { signal: controller.signal });
            
            if (res.status === 404) throw new Error('Нічого не знайдено');
            if (!res.ok) throw new Error('Помилка сервера');

            const data = await res.json();
            statusEl.textContent = `Знайдено: ${data.length}`;

            resultsContainer.innerHTML = data.map(c => `
                <div class="country">
                    <img src="${c.flags?.svg || ''}" alt="Прапор" style="width: 50px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;">
                    <h3>${c.name?.common || 'Невідомо'}</h3>
                    <div class="meta">
                        <div><strong>Столиця:</strong> ${c.capital?.[0] || 'Немає'}</div>
                        <div><strong>Населення:</strong> ${c.population?.toLocaleString('uk-UA') || 0}</div>
                    </div>
                </div>
            `).join('');

        } catch (err) {
            if (err.name !== 'AbortError') {
                statusEl.textContent = err.message;
                statusEl.style.color = 'red';
            }
        }
    }, 300);
});