let items = [];

function loadData() {
    const savedData = localStorage.getItem('buyListItems');
    
    if (savedData) {
        items = JSON.parse(savedData);
    } else {
        items = [
            { id: Date.now() + 1, name: 'Помідори', amount: 2, isBought: false },
            { id: Date.now() + 2, name: 'Печиво', amount: 2, isBought: false },
            { id: Date.now() + 3, name: 'Сир', amount: 1, isBought: false }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('buyListItems', JSON.stringify(items));
}

loadData();

const itemsListContainer = document.getElementById('items-list-container');
const statsLeftContainer = document.getElementById('stats-left');
const statsBoughtContainer = document.getElementById('stats-bought');

function render() {
    const existingItems = itemsListContainer.querySelectorAll('.item-row');
    existingItems.forEach(item => item.remove());

    statsLeftContainer.innerHTML = '';
    statsBoughtContainer.innerHTML = '';

    items.forEach(item => {
        let itemHTML = '';

        if (item.isBought) {
            itemHTML = `
            <div class="item-row" data-id="${item.id}">
                <div class="item-name2">${item.name}</div>
                <div class="item-amount-controls">
                    <span class="amount">${item.amount}</span>
                </div>
                <div class="item-actions">
                    <button class="status-btn bought" data-tooltip="Куплено">Куплено</button>
                </div>
            </div>`;
        } else {
            const disabledMinus = item.amount === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
            
            itemHTML = `
            <div class="item-row" data-id="${item.id}">
                <div class="item-name">${item.name}</div>
                <div class="item-amount-controls">
                    <button class="btn-minus" data-tooltip="Зменшити" ${disabledMinus}>-</button>
                    <span class="amount">${item.amount}</span>
                    <button class="btn-plus" data-tooltip="Збільшити">+</button>
                </div>
                <div class="item-actions">
                    <button class="status-btn not-bought" data-tooltip="Не куплено">Не куплено</button>
                    <button class="btn-delete" data-tooltip="Видалити">✖</button>
                </div>
            </div>`;
        }
        
        itemsListContainer.insertAdjacentHTML('beforeend', itemHTML);

        if (item.isBought) {
            statsBoughtContainer.insertAdjacentHTML('beforeend', `
            <div class="kup">
                <span class="status-name2">${item.name}</span>
                <span class="status-amount">${item.amount}</span>
            </div>`);
        } else {
            statsLeftContainer.insertAdjacentHTML('beforeend', `
            <div class="zal">
                <span class="status-name">${item.name}</span>
                <span class="status-amount">${item.amount}</span>
            </div>`);
        }
    });
}

render();

const inputElement = document.getElementById('new-item-input');
const addButton = document.getElementById('add-item-btn');

function addItem() {
    const itemName = inputElement.value.trim(); 

    if (itemName !== '') {
        const newItem = {
            id: Date.now(),
            name: itemName,
            amount: 1, 
            isBought: false
        };

        items.push(newItem);
        saveData();
        render();

        inputElement.value = '';
        inputElement.focus();
    }
}

addButton.addEventListener('click', addItem);

inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

itemsListContainer.addEventListener('click', function(event) {
    const itemRow = event.target.closest('.item-row');
    if (!itemRow) return;

    const itemId = Number(itemRow.dataset.id);
    const item = items.find(i => i.id === itemId);

    let needsRender = false;

    if (event.target.classList.contains('btn-delete')) {
        items = items.filter(i => i.id !== itemId);
        needsRender = true;
    }

    if (event.target.classList.contains('btn-plus')) {
        item.amount++;
        needsRender = true;
    }

    if (event.target.classList.contains('btn-minus')) {
        if (item.amount > 1) {
            item.amount--;
            needsRender = true;
        }
    }

    if (event.target.classList.contains('status-btn')) {
        item.isBought = !item.isBought;
        needsRender = true;
    }

    if (event.target.classList.contains('item-name')) {
        const currentName = item.name;
        const nameContainer = event.target;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'item-input'; 
        input.style.width = '100%'; 
        input.style.padding = '5px';
        input.style.boxSizing = 'border-box';

        nameContainer.innerHTML = '';
        nameContainer.appendChild(input);
        input.focus();

        const saveNewName = () => {
            const newName = input.value.trim();
            if (newName !== '') {
                item.name = newName;
            }
            saveData();
            render();
        };

        input.addEventListener('blur', saveNewName);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveNewName();
        });
    }

    if (needsRender) {
        saveData();
        render();
    }
});