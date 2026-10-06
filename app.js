// 1. Класс Store из Лабораторной работы №4
class Store {
  constructor() {
    this.items = [];
  }

  add(item) {
    // Каждому товару присваиваем уникальный id
    const newItem = { ...item, id: Date.now() };
    this.items.push(newItem);
    return newItem;
  }

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
  }

  updateQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.remove(id);
      }
    }
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}

// 2. Инициализация хранилища и стартовых данных
const store = new Store();
store.add({ name: 'Ноутбук', price: 350000, qty: 1 });
store.add({ name: 'Мышь', price: 8500, qty: 2 });

// DOM Элементы
const productList = document.getElementById('product-list');
const totalPriceEl = document.getElementById('total-price');
const form = document.getElementById('add-product-form');

const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const qtyInput = document.getElementById('product-qty');

const errorName = document.getElementById('error-name');
const errorPrice = document.getElementById('error-price');
const errorQty = document.getElementById('error-qty');

// 3. Рендеринг списка товаров и Живой Total
function render() {
  productList.innerHTML = '';

  if (store.items.length === 0) {
    productList.innerHTML = `<tr><td colspan="5">Список товаров пуст</td></tr>`;
  } else {
    store.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price.toLocaleString()} ₸</td>
        <td>
          <div class="qty-controls">
            <button class="btn btn-qty btn-dec" data-action="dec">-</button>
            <span>${item.qty}</span>
            <button class="btn btn-qty btn-inc" data-action="inc">+</button>
          </div>
        </td>
        <td>${(item.price * item.qty).toLocaleString()} ₸</td>
        <td>
          <button class="btn btn-danger" data-action="delete">Удалить</button>
        </td>
      `;
      productList.appendChild(tr);
    });
  }

  // Обновление итоговой суммы без перезагрузки
  totalPriceEl.textContent = store.getTotalPrice().toLocaleString();
}

// 4. Валидация формы в DOM (без alert)
function validateForm() {
  let isValid = true;

  // Очистка предыдущих ошибок
  errorName.textContent = '';
  errorPrice.textContent = '';
  errorQty.textContent = '';
  nameInput.classList.remove('invalid');
  priceInput.classList.remove('invalid');
  qtyInput.classList.remove('invalid');

  const nameVal = nameInput.value.trim();
  const priceVal = parseFloat(priceInput.value);
  const qtyVal = parseInt(qtyInput.value, 10);

  if (!nameVal) {
    errorName.textContent = 'Имя товара не может быть пустым';
    nameInput.classList.add('invalid');
    isValid = false;
  }

  if (isNaN(priceVal) || priceVal <= 0) {
    errorPrice.textContent = 'Цена должна быть числом больше 0';
    priceInput.classList.add('invalid');
    isValid = false;
  }

  if (isNaN(qtyVal) || qtyVal <= 0 || !Number.isInteger(qtyVal)) {
    errorQty.textContent = 'Количество должно быть целым положительным числом';
    qtyInput.classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

// Обработчик отправки формы
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (validateForm()) {
    store.add({
      name: nameInput.value.trim(),
      price: parseFloat(priceInput.value),
      qty: parseInt(qtyInput.value, 10)
    });

    form.reset();
    render();
  }
});

// 5. Делегирование событий (один слушатель на таблицу)
productList.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const tr = e.target.closest('tr');
  const id = Number(tr.dataset.id);

  if (action === 'delete') {
    store.remove(id);
  } else if (action === 'inc') {
    store.updateQty(id, 1);
  } else if (action === 'dec') {
    store.updateQty(id, -1);
  }

  render();
});

// Первоначальный рендер при загрузке
render();
