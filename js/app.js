const form = document.querySelector("#cotizar-seguro");

function Secure(manufacturer, year, typeSecure) {
  this.manufacturer = manufacturer;
  this.year = year;
  this.typeSecure = typeSecure;
}

Secure.prototype.getManufacturerName = function () {
  const manufacturers = [
    { id: "1", name: "americano" },
    { id: "2", name: "asiatico" },
    { id: "3", name: "europeo" },
  ];

  return manufacturers.find(
    (manufacturer) => manufacturer.id === this.manufacturer
  ).name;
};

Secure.prototype.calculateInsurance = function () {
  /*
    1 = american 15%
    2 = asian 5%
    3 = european 35%
  */

  let quantity;
  const base = 2000;

  switch (this.manufacturer) {
    case "1":
      quantity = base * 1.15;
      break;
    case "2":
      quantity = base * 1.05;
      break;
    case "3":
      quantity = base * 1.35;
      break;
    default:
      break;
  }

  const diferentYear = new Date().getFullYear() - this.year;
  quantity -= (diferentYear * 3 * quantity) / 100;

  if (this.typeSecure === "basico") {
    quantity *= 1.3;
  } else {
    quantity *= 1.5;
  }

  return quantity;
};

function UI() {}

UI.prototype.fillYears = () => {
  const maxYear = new Date().getFullYear();
  const minYear = maxYear - 20;
  const selectYears = document.querySelector("#year");

  for (let i = maxYear; i > minYear; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYears.appendChild(option);
  }
};

UI.prototype.showMessage = (message, typeMessage) => {
  const div = document.createElement("div");

  if (typeMessage === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }
  div.classList.add("mensaje", "mt-10");
  div.textContent = message;

  form.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.showResult = (secure, total) => {
  const { year, typeSecure } = secure;
  const result = document.querySelector("#resultado");
  const div = document.createElement("div");
  div.classList.add("mt-10");
  div.innerHTML = `
    <p class="header">Your resmum:</p>
    <p class="font-bold">Manufacturer: <span class="font-normal capitalize">${secure.getManufacturerName()}</span></p>
    <p class="font-bold">Year: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Type: <span class="font-normal capitalize">${typeSecure}</span></p>
    <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
  `;

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none";
    result.appendChild(div);
  }, 3000);
};

const ui = new UI();

function quoteInsurance(e) {
  e.preventDefault();

  const manufacturer = document.querySelector("#marca").value;
  const year = document.querySelector("#year").value;
  const typeSecure = document.querySelector("input[type=radio]:checked").value;

  if (manufacturer === "" || year === "" || typeSecure === "") {
    ui.showMessage("All fields must be filled", "error");
    return;
  }

  ui.showMessage("Quoting...", "correcto");
  const results = document.querySelector("#resultado div");
  if (results != null) {
    results.remove();
  }

  const secure = new Secure(manufacturer, year, typeSecure);
  const total = secure.calculateInsurance();

  ui.showResult(secure, total);
}

eventListeners();
function eventListeners() {
  form.addEventListener("submit", quoteInsurance);
}

document.addEventListener("DOMContentLoaded", () => {
  ui.fillYears();
});
