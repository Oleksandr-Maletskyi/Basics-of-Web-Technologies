// ============================================================
// Завдання 4 — Аккордеон
// ============================================================
// Вимоги:
//   1. Клік на .panel-title відкриває/закриває .panel-content
//      (додається/прибирається клас .open на .panel).
//   2. Одночасно відкрита ЛИШЕ ОДНА панель.
//   3. EVENT DELEGATION на .accordion.
//   4. КЛАВІАТУРА: Enter і Space на .panel-title (з tabindex=0).
//   5. ARIA: aria-expanded="true"/"false" оновлюється.
// ============================================================

// TODO

const accordion = document.querySelector('.accordion');

accordion.addEventListener('click', (event) => {
    const targetTitle = event.target.closest('.panel-title');
    if(!targetTitle) return;
    togglePanel(targetTitle);
})

accordion.addEventListener('keydown', (event) => {
    const targetTitle = event.target.closest('.panel-title');
    if (!targetTitle) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePanel(targetTitle);
    }
});

function togglePanel(targetTitle) {
    const currentPanel = targetTitle.closest('.panel');
    const isCurrentlyOpen = targetTitle.classList.contains('open');

    const allPanels = accordion.querySelectorAll('.panel');

    allPanels.forEach(panel => {
        panel.classList.remove('open');
        const title = panel.querySelector('.panel-title');
        if(title){
            title.setAttribute('aria-expanded', 'false');
        }

        if(!isCurrentlyOpen){
            currentPanel.classList.add('open');
            targetTitle.setAttribute('aria-expanded', 'true');
        }
    });
}