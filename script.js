const openPassMenu = document.querySelector("#passengers");
const passMenu = document.querySelector("#pass_menu");
const okPass = passMenu.querySelector(".ok");
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

let isPassMenuShown = false;
openPassMenu.addEventListener("click", () => {
  console.log(passMenu);
  if (isPassMenuShown) {
    passMenu.style.display = "none";
  } else {
    passMenu.style.display = "flex";
  }
  isPassMenuShown = !isPassMenuShown;
});
okPass.addEventListener("click", () => {
  passMenu.style.display = "none";
  isPassMenuShown = !isPassMenuShown;
});

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

//Вытащим топ-10 компаний из джейсона:
function getCompanies() {
  fetch("http://localhost:3000/companies")
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
    const rating = document.createElement("b");
    name.textContent = element.name;
    rating.textContent = element.rating;
    box.append(name, rating);
    li.append(box);
    ol.append(li);
  });
}
