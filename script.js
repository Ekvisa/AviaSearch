//////////////////////////////////////////////////////////////////////////////////
// Выбор городов:
const from = document.querySelector("#from");
const to = document.querySelector("#to");

function getCities() {
  // http://localhost:3000/cities
  fetch("https://aviasearch.onrender.com/cities")
    .then((Response) => Response.json())
    .then((data) => {
      showCities(from, data);
      showCities(to, data);
    });
}

getCities();

function showCities(sel, arr) {
  arr.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.value;
    option.textContent = city.name;
    sel.append(option);
  });
}

//////////////////////////////////////////////////////////////////////////////////
// Заполнение количества пассажиров и типа билетов:
const openPassMenu = document.querySelector("#passengers");
const passMenu = document.querySelector("#pass_menu");
setupPopup(openPassMenu, passMenu);
let numberOutput = 1;
let categoryOutput = "любой";
openPassMenu.value = `${numberOutput} ${categoryOutput}`;

const passengers = {
  adults: 1,
  children: 0,
  babies: 0,
};

const minusBtns = document.querySelectorAll(".minus");
const plusBtns = document.querySelectorAll(".plus");
const counters = document.querySelectorAll(".counter");

const passengersUl = passMenu.querySelector(".pass_number");
const categoriesUl = passMenu.querySelector(".pass_class");

function countPassengers(passengersObject) {
  return Object.values(passengersObject).reduce((acc, n) => acc + n);
}

let passCount = countPassengers(passengers);
switchButtons(minusBtns, false);

let ticketsClasses = categoriesUl.querySelectorAll("li");
[...ticketsClasses][0].classList.add("active");

numberOutput = countPassengers(passengers);
let ticketClass = [...ticketsClasses][0].textContent;
categoryOutput = ticketClass;
openPassMenu.value = `${numberOutput} ${categoryOutput}`;

// Выбор пассажиров:
passengersUl.addEventListener("click", (e) => {
  // если нажали по кнопке,
  if (e.target.matches(".plus, .minus")) {
    // то найдём строку, содержащую кнопку:
    const item = e.target.closest(".pass_type");
    // потом узнаем data-type этой строки:
    const type = item.dataset.type;
    // и найдём счётчик в этой строке и его значение:
    const counter = item.querySelector(".counter");
    let value = +counter.textContent;
    // если нажали "+" и пассажиров < 9, увеличим значение счётчика:
    if (e.target.classList.contains("plus")) {
      if (passCount < 9) {
        value++;
        // и, если нужно, сделаем активным соответствующий "-" :
        const minusBtn = item.querySelector(".minus");
        if (minusBtn.disabled === true) {
          switchButtons(minusBtn, true);
        }
      }
    }

    // если нажали "-" :
    if (e.target.classList.contains("minus")) {
      // и при этом число пассажиров максимально:
      if (passCount === 9) {
        // включим кнопки "+" :
        switchButtons(plusBtns, true);
      }
      // и изменим значение счётчика :
      value--;
      // если количество взрослых уменьшилось до одного, запретим уменьшать его дальше:
      if (item.dataset.type === "adults" && value === 1) {
        switchButtons(e.target, false);
      }
      // если дошли до нуля, запретим уменьшать дальше:
      if (value === 0) {
        switchButtons(e.target, false);
      }
    }

    // впишем новое значение в счётчик, обновим соответствующее поле у passengers, пересчитаем число пассажиров:
    counter.textContent = value;
    passengers[type] = value;
    passCount = countPassengers(passengers);
    console.log(`passCount = ${passCount}`);
    // если пассажиров стало 9, запретим увеличивать:
    if (passCount === 9) {
      switchButtons(plusBtns, false);
    }
    numberOutput = countPassengers(passengers);
    openPassMenu.value = `${numberOutput} ${categoryOutput}`;
  }
});

// Выбор класса:
categoriesUl.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    ticketsClasses.forEach((el) => el.classList.remove("active"));
    e.target.classList.add("active");
    ticketClass = e.target.textContent;
    categoryOutput = ticketClass;
    openPassMenu.value = `${numberOutput} ${categoryOutput}`;
  }
});

function switchButtons(btns, isAvailable) {
  if (!btns) return;
  // превратим btns в массив из нескольких или одного элемента и изменим свойство disabled у каждого элемента полученного массива:
  const elements =
    btns instanceof NodeList || Array.isArray(btns) ? [...btns] : [btns];
  elements.forEach((b) => (b.disabled = !isAvailable));
}

//////////////////////////////////////////////////////////////////////////////////
//Вытащим топ-10 компаний из джейсона:
function getCompanies() {
  // http://localhost:3000/companies
  fetch("https://aviasearch.onrender.com/companies")
    .then((Response) => Response.json())
    .then((data) => {
      showCompanies(data);
    });
}

getCompanies();

function showCompanies(arr) {
  const ol = document.querySelector(".top10 article ol");
  const sorted = arr.sort((a, b) => b.rating - a.rating);
  const sliced = sorted.slice(0, 10);
  console.log(sliced);
  sliced.forEach((element) => {
    const li = document.createElement("li");
    const box = document.createElement("div");
    const name = document.createElement("a");
    name.href = "#";
    const rating = document.createElement("b");
    name.textContent = element.name;
    rating.textContent = element.rating;
    box.append(name, rating);
    li.append(box);
    ol.append(li);
  });
}

//////////////////////////////////////////////////////////////////////////////////
// Выбор дат из календаря:
const monthsNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

let date = new Date();
const CUR_MONTH = date.getMonth();
// let visibleMonth = CUR_MONTH;
const CUR_YEAR = date.getFullYear();
// let visibleYear = CUR_YEAR;
const CUR_DAY = date.getDate();

//Определим первый и второй календарные листы:
let sheet1 = document.getElementsByClassName("calendarsheet")[0];
let sheet2 = document.getElementsByClassName("calendarsheet")[1];

// Первому листу зададим текущие год и месяц:
sheet1.dataset.year = CUR_YEAR;
sheet1.dataset.month = CUR_MONTH;

const next = new Date(CUR_YEAR, CUR_MONTH + 1);
sheet2.dataset.year = next.getFullYear();
sheet2.dataset.month = next.getMonth();

let isIntervalStarted = false;
let startDate;
let endDate;
let selectedRange = [];

function showMonth(s) {
  // Подпишем календарный лист месяцем и годом:
  let year = +s.dataset.year;
  let month = +s.dataset.month;
  let VisMonthTitle = s.querySelector(".month");
  VisMonthTitle.textContent = `${monthsNames[month]} ${year}`;

  // И удалим старые даты:
  clearSheet(s);

  // Будем заполнять пустотами дни предыдущего месяца.
  // Для этого найдём первую и последнюю даты, которые будем показывать на календарном листе:
  let lastDateOfPrevMonth = new Date(year, month, 0); // последняя дата предыдущего месяца
  let lastDayOfPrevMonth = lastDateOfPrevMonth.getDay(); // день недели последней даты предыдущего месяца от 0 до 6 (от вс до сб)
  let firstDateInSheet = new Date(lastDateOfPrevMonth);
  firstDateInSheet.setDate(firstDateInSheet.getDate() - lastDayOfPrevMonth + 1); // дата первого дня на календарном листе (+1 из-за начала недели с пн)
  let lastDateOfVisMonth = new Date(year, month + 1, 0); // последняя дата отображаемого месяца, она же последняя дата на календарном листе
  printDates(s, firstDateInSheet, lastDateOfVisMonth);
}

function printDates(s, fromDate, toDate) {
  // Заполним календарный лист новыми датами:
  let dateForOutput = new Date(fromDate);
  const today = new Date();
  while (dateForOutput <= toDate) {
    let dateElement = document.createElement("li");
    // Заполним данными элементы дней отображаемого месяца:
    if (dateForOutput.getMonth() === +s.dataset.month) {
      dateElement.dataset.date = dateForOutput.getDate();
      dateElement.dataset.month = dateForOutput.getMonth();
      dateElement.dataset.year = dateForOutput.getFullYear();
      dateElement.textContent = dateElement.dataset.date;
      // Если выводимая дата не раньше сегодняшней, сделаем её активной для выбора и повесим на неё обработчик:
      if (compareDates(dateForOutput, today) >= 0) {
        dateElement.classList.add("active");
        dateElement.addEventListener("click", (event) => {
          event.stopPropagation(); // не дать событию всплыть до document
          createRange(event.target);
        });
        // ...а если ещё и равна сегодняшней, то пометим её дополнительным классом:
        if (compareDates(dateForOutput, today) === 0) {
          dateElement.classList.add("today");
        }
      }
      // Если обрабатываемый элемент выбран началом интервала, пометим его классом:
      if (isIntervalStarted) {
        if (compareDates(dateForOutput, selectedRange[0]) === 0) {
          dateElement.classList.add("borderdate");
        }
      } else {
        // Если обрабатываемый элемент выбран концом интервала, пометим классами граничные и промежуточные дни интервала:
        if (selectedRange.length > 0) {
          if (
            selectedRange.some(
              (item) => compareDates(item, dateForOutput) === 0
            )
          ) {
            dateElement.classList.add("selected");
            if (compareDates(dateForOutput, selectedRange[0]) === 0) {
              dateElement.classList.add("startdate");
            }
            if (
              compareDates(
                dateForOutput,
                selectedRange[selectedRange.length - 1]
              ) === 0
            ) {
              dateElement.classList.add("enddate");
            }
          }
        }
      }
    }
    let sheetDates = s.querySelector(".dates");
    sheetDates.append(dateElement);
    dateForOutput.setDate(dateForOutput.getDate() + 1);
  }

  function createRange(d) {
    if (!isIntervalStarted) {
      // Если это первый клик, то поместим в массив кликнутую дату
      selectedRange = [];
      startDate = new Date(d.dataset.year, d.dataset.month, d.dataset.date);
      selectedRange.push(startDate);
      isIntervalStarted = true;
      showMonth(sheet1);
      showMonth(sheet2);
    } else {
      // Если это второй клик, то поместим в массив весь интервал
      endDate = new Date(d.dataset.year, d.dataset.month, d.dataset.date);
      isIntervalStarted = false;
      if (startDate > endDate) [startDate, endDate] = [endDate, startDate];
      // Поместим даты в поля:
      document.querySelector(".dates input#forth").value =
        startDate.toLocaleDateString("ru-RU");
      document.querySelector(".dates input#back").value =
        endDate.toLocaleDateString("ru-RU");

      selectedRange = getDatesBetween(startDate, endDate);
      showMonth(sheet1);
      showMonth(sheet2);
      return selectedRange;
    }
  }
}

function compareDates(a, b) {
  //Уберём у дат время и сравним полученные даты:
  return a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0);
}

function getDatesBetween(start, end) {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function createCalendar() {
  // Повесим события на кнопки и создадим два календарных листа:
  document.getElementById("next").addEventListener("click", () => showNext());
  document.getElementById("prev").addEventListener("click", () => showPrev());

  showMonth(sheet1);
  fillWeekTitles(sheet1);
  showMonth(sheet2);
  fillWeekTitles(sheet2);
}

function fillWeekTitles(sheet) {
  let title = sheet.querySelector(".week");
  daysOfWeek.forEach((item) => {
    let day = document.createElement("li");
    day.textContent = item;
    title.append(day);
  });
}

function showNext() {
  // Зададим первому листу данные второго:
  sheet1.dataset.month = +sheet2.dataset.month;
  sheet1.dataset.year = +sheet2.dataset.year;
  // А второму листу зададим данные следующего за ним месяца:
  let m2 = +sheet2.dataset.month + 1;
  let y2 = +sheet2.dataset.year;
  if (m2 > 11) {
    m2 = 0;
    y2++;
  }
  sheet2.dataset.month = m2;
  sheet2.dataset.year = y2;
  // И отрисуем месяцы:
  showMonth(sheet1);
  showMonth(sheet2);
}

function showPrev() {
  // Зададим второму листу данные первого:
  sheet2.dataset.month = +sheet1.dataset.month;
  sheet2.dataset.year = +sheet1.dataset.year;
  // А первому листу зададим данные предшествующего ему месяца:
  let m1 = +sheet1.dataset.month - 1;
  let y1 = +sheet1.dataset.year;
  if (m1 < 0) {
    m1 = 11;
    y1--;
  }
  sheet1.dataset.month = m1;
  sheet1.dataset.year = y1;
  // И отрисуем месяцы:
  showMonth(sheet1);
  showMonth(sheet2);
}

function clearSheet(s) {
  s.querySelector(".dates").innerHTML = "";
}

createCalendar();

// Организуем показ блока
const calendarPopup = document.querySelector("#calendar_wrapper");
const calendarCall = document.querySelector(".inputs .dates");
setupPopup(calendarCall, calendarPopup);

//////////////////////////////////////////////////////////////////////////////////
// Вывод результата поиска:
const find = document.querySelector(".search button");
const result = document.querySelector("#result");
setupPopup(find, result);

find.addEventListener("click", () => {
  showResult(from, to);
});

function showResult(f, t) {
  console.log("выше крыш");
  // const text = `Выберите направление`;
  const p = result.querySelector("p");
  // result.append(p);
  if (from.value === "" || to.value === "") {
    p.innerHTML = `Выберите направление`;
  } else {
    const selectedFrom = f.options[f.selectedIndex].text;
    const selectedTo = t.options[t.selectedIndex].text;
    p.innerHTML = `💖<br>Где-то выше крыш обгоняет звук<br>рейс <b>${selectedFrom} - ${selectedTo}</b>.<br><br>Поиск — первый шаг к мечте!<br>✈️`;
  }
  result.style.display = "block";
}

// Показ и скрытие блока popup (по кнопке, по клику на кусочек формы openButton, по клику за пределами блока):
function setupPopup(openButton, popup) {
  const okButton = popup.querySelector(".ok");
  const popups = document.querySelectorAll(".popup");

  openButton.addEventListener("click", (e) => {
    e.stopPropagation();
    // Сначала закрываем все попапы
    popups.forEach((p) => (p.style.display = "none"));
    // Потом показываем нужный
    popup.style.display = "flex";
  });

  okButton.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.style.display = "none";
  });
}

// Глобальное закрытие попапов по клику вне
document.addEventListener("click", (e) => {
  const popups = document.querySelectorAll(".popup");
  const isInsidePopup = e.target.closest(".popup");
  const isPopupButton = e.target.closest(
    "#passengers, .inputs .dates, .search button"
  );

  // Если клик не по кнопке, открывающей попап, и не внутри попапа — закрываем все
  if (!isInsidePopup && !isPopupButton) {
    popups.forEach((p) => (p.style.display = "none"));
  }
});

// function setupPopup(openButton, popup) {
//   const okButton = popup.querySelector(".ok");
//   const popups = document.querySelectorAll(".popup");

//   // Открытие по форме
//   openButton.addEventListener("click", (e) => {
//     e.stopPropagation();
//     // console.log("Открытие по форме");

//     // Сначала закрываем все попапы
//     popups.forEach((p) => (p.style.display = "none"));
//     // console.log("закрываем все попапы");

//     // Потом показываем нужный
//     popup.style.display = "flex";
//     // console.log("показываем нужный");
//   });

//   // Закрытие по кнопке внутри попапа
//   okButton.addEventListener("click", (e) => {
//     e.stopPropagation();
//     popup.style.display = "none";
//     // console.log("Закрытие по кнопке внутри попапа");
//   });

//   // Закрытие по клику вне попапа
//   document.addEventListener("click", (e) => {
//     console.log(popup);
//     console.log(openButton);
//     console.log(e.target);
//     console.log(!popup.contains(e.target) && e.target !== openButton);

//     if (!popup.contains(e.target) && e.target !== openButton) {
//       popup.style.display = "none";
//     }
//     // console.log("Закрытие по клику вне попапа");
//   });
// }
