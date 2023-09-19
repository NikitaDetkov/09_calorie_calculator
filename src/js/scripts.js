// Объект со всеми имеющимися продуктами
let listProducts = {};
// Счетчик продуктов
let counterProductId = 0;
// Список продуктов в HTML документе 
const listProductsHTML = document.querySelector('#list-products')
// Кнопка для добавления нового продукта
const btnAddProduct = document.querySelector('#btn-add-product')
// Кнопка переключения на список продуктов
const btnMenuProducts = document.querySelector('#btn-menu-products');
// Кнопка переключения на график потребления
const btnMenuConsumptionChart= document.querySelector('#btn-menu-consumption-chart');
// Контейнер с списком продуктов
const containerMenuProducts = document.querySelector('#list-products-wrapper');
// Контейнер с графиком потребления
const containerMenuConsumptionChart = document.querySelector('#consumption-chart-wrapper');
// Кнопка для удаления всех продуктов
const btnDeleteAllProducts = document.querySelector('#btn-delete-all-products');
// График
const chart = document.querySelector('#chart');
// Input с датой
const inputDate = document.querySelector('#date'); 
// Текущая дата
let dateNow =  new Date();
let dataNowInFormat = getDateInFormat(dateNow);
inputDate.value = dataNowInFormat;
// Кнопка задания лимита потребления
const btnSetLimit = document.querySelector('#btn-set-limit');
// Лимит потребления
let consumptionLimit = 0;
// Поле с значением лимита потребления
const limitField = document.querySelector('#limit');

// Массив для сортировки (с копией данных для отображения)
let listProductsArray = [];

// Класс для продукта
class Product {
    id;
    name = '';
    calories = '';
    date = '';
    weight = '';
    
    constructor(id, values) {
        this.id = id;

        // Установка выбранной даты
        this.setDate(inputDate.value);

        if (values !== undefined) {
            this.setAllValues(values);
        }  
    }
    // Установить название продукта
    setName(name) {
        this.name = name;
    }
    // Установить количество калорий
    setCalories(calories) {
        this.calories = calories;
    }
    // Установить дату
    setWieght(weight) {
        this.weight = weight;
    }
    // Установить дату
    setDate(date) {
        this.date = date;
    }
    // Установить все значения
    setAllValues(values) {
        this.name = values.name;
        this.weight = values.weight
        this.date = values.date;
        this.calories = values.calories;
    }
}

// Получить список продуктов из localstorage
getProductsFromLocalStorage();
// Копировать данные в массив
setListProductsArray();
// Отобразить список продуктов
showProducts();

// Слушатели событий ==============================================

// Слушатель событий для добавления новго продукта
btnAddProduct.addEventListener('click', addProduct);
// Слушатель событий для кнопки переключения на список продуктов
btnMenuProducts.addEventListener('click', showMenuProducts);
// Слушатель событий для кнопки переключения на график потребления
btnMenuConsumptionChart.addEventListener('click', showMenuConsumptionChart);
// Слушатель событий для кнопки, удаляющей все продукты
btnDeleteAllProducts.addEventListener('click', deleteAllProducts);
// Слушатель событий для кнопки задания лимита потребления
btnSetLimit.addEventListener('click', setLimit);

// Функции ========================================================

// Функция для отображения меню с продуктами
function showMenuProducts() {
    containerMenuConsumptionChart.classList.remove('show');
    containerMenuProducts.classList.remove('hide');
}

// Функция для отображения меню с графиком потребления
function showMenuConsumptionChart() {
    containerMenuConsumptionChart.classList.add('show');
    containerMenuProducts.classList.add('hide');

    // Отобразить график потребления
    showChart();
}

// Функция для выведения списка всех продутов
function showProducts() {
    listProductsHTML.innerHTML = '';

    const tableHeader = document.createElement('tr');
    tableHeader.classList.add('list-products__elem');
    tableHeader.classList.add('table-header');
    tableHeader.id = 'table-header';
    const tmpl = document.querySelector('#template-table-header');
    tableHeader.append(tmpl.content.cloneNode(true));
    listProductsHTML.append(tableHeader);

    // Отобразить все продукты из объекта с продуктами
    for (let key in listProductsArray) {
        const productHTML = createProductHtml(listProductsArray[key]);

        // Добавить в HTML-документ (после заголовка)
        document.querySelector('#table-header').after(productHTML);
    }
}

// Функция для добавления продукта
function addProduct() {
    // Добавить в объект с продуктами
    const newProduct = new Product('product-' + counterProductId);
    listProducts[newProduct.id] = newProduct;  
    // Увеличить счетчик продуктов
    counterProductId++;
    localStorage.setItem('counterProductId', counterProductId);
    // Добавить в HTML-документ (после заголовка)
    const newProductHTML = createProductHtml(newProduct);
    document.querySelector('#table-header').after(newProductHTML);
    // Добавить в localStorage
    localStorage.setItem(newProduct.id, JSON.stringify(newProduct));
}

// Функция для удаления какого-либо продукта
function deleteProduct(productId) {
    // Удалить из объекта с продуктами
    delete listProducts[productId];
    // Удалить из HTML-документа
    const product = document.querySelector(`#${productId}`);
    product.remove();
    // Удалить из localStorage
    localStorage.removeItem(productId);
}

// Функция для создания HTML-записи с продуктом
function createProductHtml(product) {
    const productHTML = document.createElement('tr');
    productHTML.classList.add('list-products__elem');
    productHTML.id = product.id;

    // Название продукта
    let td = document.createElement('td');
    const name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.value = product.name;
    name.id = `name-${product.id}`;
    name.placeholder = 'Product name';
    name.setAttribute('oninput', `changeProductName("${product.id}","${name.id}")`);
    td.append(name);
    productHTML.append(td);

    // Калории
    td = document.createElement('td');
    const calories = document.createElement('input');
    calories.setAttribute('type', 'text')
    calories.value = product.calories;
    calories.id = `calories-${product.id}`;
    calories.placeholder = 'Product calories';
    calories.setAttribute('oninput', `changeProductCalories("${product.id}","${calories.id}")`);
    td.append(calories);
    productHTML.append(td);

    // Вес
    td = document.createElement('td');
    const weight = document.createElement('input');
    weight.setAttribute('type', 'text')
    weight.value = product.weight;
    weight.id = `weight-${product.id}`;
    weight.placeholder = 'Product weight';
    weight.setAttribute('oninput', `changeProductWeight("${product.id}","${weight.id}")`);
    td.append(weight);
    productHTML.append(td);

    // Дата
    td = document.createElement('td');
    const date = document.createElement('input');
    date.setAttribute('type', 'date');
    date.value = product.date;
    date.id = `date-${product.id}`;
    date.disabled = true;
    td.append(date);
    productHTML.append(td);

    // Кнопка удаления
    td = document.createElement('td');
    td.classList.add('td-delete');
    const btnDelete = document.createElement('button');
    btnDelete.innerHTML = 'X';
    btnDelete.classList.add('btn');
    btnDelete.classList.add('btn-delete');
    btnDelete.setAttribute('onclick', `deleteProduct("${product.id}")`);
    td.append(btnDelete);
    productHTML.append(td);

    return productHTML;
}

// Функция для изменения название продукта
function changeProductName(productId, productNameId) {
    const productName = document.querySelector(`#${productNameId}`);
    // Изменить запись о продукте в объекте с продуктами
    listProducts[productId].setName(productName.value);
    // Изменить запись о продукте в localStorage
    localStorage.setItem(productId, JSON.stringify(listProducts[productId]));
}

// Функция для изменения количества калорий продукта
function changeProductCalories(productId, productCaloriesId) {
    const productCalories = document.querySelector(`#${productCaloriesId}`);
    // Изменить запись о продукте в объекте с продуктами
    listProducts[productId].setCalories(productCalories.value);
    // Изменить запись о продукте в localStorage
    localStorage.setItem(productId, JSON.stringify(listProducts[productId]));
}

// Функция для изменения веса продукта
function changeProductWeight(productId, productWeightId) {
    const productWeight = document.querySelector(`#${productWeightId}`);
    // Изменить запись о продукте в объекте с продуктами
    listProducts[productId].setWieght(productWeight.value);
    // Изменить запись о продукте в localStorage
    localStorage.setItem(productId, JSON.stringify(listProducts[productId]));
}

// Функция для получения даты в формате yyyy-mm-dd
function getDateInFormat(data) {
    let year = data.getFullYear();

    let mounth = data.getMonth() + 1;
    if (mounth < 10) {
        mounth = '0' + mounth;
    }

    let day = data.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return year + '-' + mounth + '-' + day;
}

// Подсчитать калории одного продукта
function calculateCaloriesProduct(product) {
    const calories = product.calories;
    const weight = product.weight;
    if (!isNaN(Number(calories)) && !isNaN(Number(weight))) {
        return Math.round(Number(calories) * Number(weight) / 100);
    } else {
        return 0;
    }
}

// Подсчитать калории всех продуктов
// Принимает: дату в формате строки YYYY-MM-DD
// Возвращает: сумму калорий за эту дату
function calculateCaloriesAllProducts(date) {
    let caloriesSum = 0;

    for (let key in listProducts) {
        if (listProducts[key].date === date) {
            caloriesSum += calculateCaloriesProduct(listProducts[key]);
        }
    }

    return caloriesSum;
}

// Функция для удаления всех продуктов
function deleteAllProducts() {
    // Удалить из localStorage все записи с продуктами
    for (let key in listProducts) {
        localStorage.removeItem(key);
    }
    listProducts = {};
    // Обнулить счетчик продуктов
    counterProductId = 0;
    localStorage.removeItem('counterProductId');
    // Копировать данные в массив
    setListProductsArray();
    // Отобразить данные
    showProducts();
}

// Функция для получения из localstorage списка продуктов
function getProductsFromLocalStorage() {
    listProducts = {};
    const counter = localStorage.getItem('counterProductId'); 

    if (counter !== null) {
        counterProductId = counter;

        for (const [key, value] of Object.entries(localStorage)) {
            if (key !== 'counterProductId' && key !== 'consumptionLimit') {
                const productInfo = JSON.parse(value);
                listProducts[key] = new Product(key, {
                    name: productInfo.name, weight: productInfo.weight,
                    calories: productInfo.calories, date: productInfo.date});
            }
        }
    }
}

// Функция для отрисовки графика калорий за последние 30 дней
function showChart() {
    chart.innerHTML = '';
    
    let date = new Date();
    date.setDate(date.getDate() - 29);

    // Калории за день и за месяц
    let caloriesDay = 0;
    let caloriesMonth = 0;
    
    // Отрисовать потребление за последние 30 дней
    for (let i = 0; i < 30; i++) {
        // Получить количество калорий за определенную дату
        const dateInFormat = getDateInFormat(date);
        const calories = calculateCaloriesAllProducts(dateInFormat);
        // Калории за месяц 
        caloriesMonth += calories;

        // Добавить элемент на график
        addChartElem(calories, dateInFormat);

        if (i === 29) {
            caloriesDay = calories;
        } else {
            // Прибавить день в дату
            date.setDate(date.getDate() + 1);
        }
    }

    // Отобразить информацию о потреблении
    showChartInfo(caloriesDay, caloriesMonth);
}

// Функция для отображения информации о потреблении калорий и лимита
// Принимает: значение калорий за день, значение калорий за месяц
function showChartInfo(caloriesDay, caloriesMonth) {
    const caloriesDayHTML = document.querySelector('#calories-day');
    const caloriesMonthHTML = document.querySelector('#calories-month');

    caloriesDayHTML.innerHTML = caloriesDay;
    caloriesMonthHTML.innerHTML = caloriesMonth;  

    // Установить предел потребления калорий, если он есть в localstorage
    const limit = localStorage.getItem('consumptionLimit');
    if (limit !== null) {
        consumptionLimit = limit;
        limitField.value = consumptionLimit;
        setLimit();
    }
}

// Функция для добавления элемента графика
// Принимает: значение калорий, значение даты
function addChartElem(calories, date) {
    // Элемент графика
    const elemChart = document.createElement('div');
    elemChart.classList.add('chart__elem');
    
    // Добавление столбца элемента графика
    const elemChartLine = document.createElement('div');
    elemChartLine.classList.add('chart__elem-line');
    const elemChartLineFilld = document.createElement('div');
    elemChartLineFilld.classList.add('chart__elem-line-filld');
    // Перевод калорий в высоту в процентах
    elemChartLineFilld.style.height = convertCaloriesToHeight(calories);
    elemChartLine.append(elemChartLineFilld);
    elemChart.append(elemChartLine);

    // Добавление даты элемента графика
    const elemCharInfo = document.createElement('div');
    elemCharInfo.classList.add('chart__elem-info');
    const elemCharInfoText = document.createElement('div');
    elemCharInfoText.classList.add('chart__elem-info-text');
    elemCharInfoText.innerHTML = inverseDate(date);
    elemCharInfo.append(elemCharInfoText);
    elemChart.append(elemCharInfo);
    
    // Добавить элемент на поле графика
    chart.append(elemChart);
}

// Функция для инверсии даты (для большей читаемости)
// Принимает: строку с датой YYYY-MM-DD
// Возвращает: строку с датой DD-MM-YY
function inverseDate(date) {
    return date.split('-').reverse().join('-');
}

// Функция для задания лимита потребления
function setLimit() {
    const limitValue = Number(limitField.value);
    
    // Если значение валидно, то установить и отрисовать на графике
    if (!isNaN(limitValue) && limitValue > 0) {
        consumptionLimit = limitValue;

        // Запомнить в localstorage
        localStorage.setItem('consumptionLimit', consumptionLimit);

        // Отобразить на графике
        showLimitOnChart(consumptionLimit);
    }
}

// Функция для отображения лимита потребления на графике
// Принимает: значение лимита калорий
function showLimitOnChart(limit) {
    const limitChart = document.querySelector('#limit-chart');

    // Отображение лимита 
    limitChart.style.height = convertCaloriesToHeight(limit);
}


// Функция для перевода количества калорий в высоту в %
// Принимает: количество калорий
// Возвращает: строку с количеством процентов
function convertCaloriesToHeight(calories) {
    // Высота блока в px (вычитаем отступы)
    const scale = document.querySelector('#scale');
    const height = scale.offsetHeight - 100 - 5;

    return 0.9 * (height / 4500 * calories) / height * 100 + '%';
}

// 
function showSortList(fieldKey, rule) {
    // Копировать данные в массив
    setListProductsArray();
    // Отсортировать массив с данными
    sortList(fieldKey, rule);
    // Отобразить данные
    showProducts();
}

// Функция для сортировки данных
// Получет: 
//      массив объектов, 
//      ключ, по которому идет сортировка, 
//      правило сортировки - массив из двух значений: [1, -1] - прямая, [-1, 1] - обратная
function sortList(fieldKey, rule) {

    // Отсортировать массив
    listProductsArray.sort(function (elemA, elemB) { // правило сортировки
        // Сортировка, если элемент не определен
        if (elemA[fieldKey] === '') {
            return -1;
        } else if (elemB[fieldKey] === '') {
            return 1;
        }

        // Сортировка в случае чисел
        if (fieldKey === 'calories' || fieldKey === 'weight') {
            if (Number(elemA[fieldKey]) > Number(elemB[fieldKey])) {
                return rule[0];
            }
            if (Number(elemA[fieldKey]) < Number(elemB[fieldKey])) {
                return rule[1];
            }
        } else { // Сортировка в случае строк
            if (elemA[fieldKey] > elemB[fieldKey]) {
                return rule[0];
            }
            if (elemA[fieldKey] < elemB[fieldKey]) {
                return rule[1];
            }
        }
        return 0;
    })
}

// Функция для установки массива с продуктами
function setListProductsArray() {
    // Обнуление массива
    listProductsArray = [];
    // Копирование данных в массив
    for (let key in listProducts) {
        listProductsArray.push(listProducts[key]);
    }
}