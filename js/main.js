const currentDate = new Date();
const year = currentDate.getFullYear();
let month = currentDate.getMonth()
const day = currentDate.getDate();
const setTitelMonth = currentDate.toLocaleString('sv-SE', { month: 'long' });
const setTitelYear = currentDate.toLocaleString('sv-SE', { year: 'numeric' });
const daysInMonth = getAllDaysInMonth(year, month);
const daysInNumbers = new Date(year, month + 1, 0).getDate();
const storedYear = localStorage.getItem("storedYear");
const storedMonth = localStorage.getItem("storedMonth");

let namesData = [];
let storageType;
let index;

// hasNetworkCheck();

// function hasNetworkCheck() {
//   if (navigator.onLine) {
//     document.getElementById("NoNetworkDiv").style.display = "none"
//   } else {
//     document.getElementById("NoNetworkDiv").style.display = "flex"
//   }
// }

function checkMonthChange() {
  const newMonth = new Date().getMonth();
  if (newMonth !== month) {
    window.location = window.location
  }
}
setInterval(checkMonthChange, 20345);

loadDate();

function loadDate() {

  for (let i = 1; i <= daysInMonth.length; i++) {

    document.getElementById("numer").innerHTML +=
      '<span class="numerRow">' +
      '<p class="numer">' + i + '</p>' +
      '</span>';
  }

  if (storedMonth != null && (storedYear != year || storedMonth != month)) {
    for (var key in localStorage) {
      if (key.startsWith('OLD_')) {
        localStorage.removeItem(key);
      }
    }
  }

  if (storedMonth != null && (storedYear != year || storedMonth != month)) {
    for (var key in localStorage) {
      if (key.startsWith('buttonData_')) {
        const value = localStorage.getItem(key);
        const newKey = key.replace('buttonData_', 'OLD_');
        localStorage.setItem(newKey, value);
        localStorage.removeItem(key);
      }
    }
  }

  localStorage.setItem("storedYear", year);
  localStorage.setItem("storedMonth", month);

  if (localStorage.getItem("namesData") == null || localStorage.getItem("namesData") == "undefined") {
    document.getElementById("column").innerHTML += "<h1>Inga namn hittades</h1><h2>Klicka på redigera</h2>"
  } else {

    if (storedMonth != null && (storedYear != year || storedMonth != month)) {
      localStorage.setItem("namesDataOld", localStorage.getItem("namesData"));
    }

    namesData = JSON.parse(localStorage.getItem("namesData"));
    main(namesData);
    namesData.forEach(displayEditNameArry);
  }

  if (localStorage.getItem("titelData") == null) {
    sessionStorage.setItem("titelData", "Namnlös");
    storageType = sessionStorage;
  } else {
    sessionStorage.removeItem("titelData")
    storageType = localStorage;
  }

  document.getElementById("titelDataTitel").innerHTML += storageType.getItem("titelData");

  document.getElementById("gruppEditContainer").innerHTML =
    '<input type="text" maxlength="90" id="grupp_NameInput" placeholder="Gruppens namn" value="' + storageType.getItem("titelData") + '" class="gruppEditItem"></input>';

  document.getElementById("titleDate").innerHTML = `${setTitelMonth} ${setTitelYear}`;

  document.title = `Närvaro lista - ${document.getElementById("titleDate").innerText} `;
}




function main(namesData) {

  let names = namesData

  if (localStorage.getItem("namesData") == null || localStorage.getItem("namesData") == "undefined") {
    document.getElementById("column").innerHTML += "<h1>Inga namn hittades</h1><h2>Klicka på redigera</h2>"
    return;
  }

  for (let i = 0; i < namesData.length; i++) {

    document.getElementById('column').innerHTML += '<div class="nameContainer"><p class="name">' + names[i] + '</p></div>';

    const output = document.querySelectorAll('.name')[i];
    const outputContainer = document.querySelectorAll('.nameContainer')[i];

    let fontSize = parseFloat(window.getComputedStyle(output).fontSize);

    while (output.clientHeight > outputContainer.clientHeight && fontSize > 1) {
      fontSize--;
      output.style.fontSize = fontSize + 'px';
    }

    console.log(output.clientHeight)


    for (let j = 1; j <= daysInNumbers; j++) {

      const redDay = isRedDay(j);
      const heldagClass = redDay ? 'Row-weekend' : 'Row-Heldag';
      const halvdagClass = redDay ? 'Row-weekend' : 'Row-Halvdag';

      const onclick = redDay ? '' : `onclick="dialog(${j}, '${names[i]}', event)"`;
      let buttonData_Halvdag;
      let buttonData_Heldag;

      if (localStorage.getItem("buttonData_" + names[i] + "_" + j + "_Heldag") == null) {
        buttonData_Heldag = "&nbsp;"
      } else {
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] + "_" + j + "_Heldag");
      }

      if (localStorage.getItem("buttonData_" + names[i] + "_" + j + "_Halvdag") == null) {
        buttonData_Halvdag = "&nbsp;"
      } else {
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] + "_" + j + "_Halvdag");
      }

      document.getElementById("column").innerHTML +=
        '<div class="Row">' +
        '<div class="' + heldagClass + '">' +
        '<a class="full-width-button" id="' + names[i] + '_' + j + '_Heldag"' + onclick + '>' + buttonData_Heldag + '</a>' +
        '</div><br>' +
        '<div class="' + halvdagClass + '">' +
        '<a class="Halvdag full-width-button" id="' + names[i] + '_' + j + '_Halvdag" ' + onclick + '>' + buttonData_Halvdag + '</a>' +
        '</div>' +
        '</div>';
    }

    document.getElementById("column").innerHTML += "<br>";
  }

}

function getAllDaysInMonth(year, month) {
  const days = [];

  const daysInMonth = new Date(year, month + 1, 0).getDate();


  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

function getEaster() {
  const date = new Date();  // dagens datum

  // Beräkna datumet för påskdagen
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);

  return new Date(year, month - 1, day); // Returnera påskdagen som ett Date-objekt
}

function isRedDay(day) {
  const date = new Date(); // dagens datum
  date.setDate(day); // Sätt dagen att kontrollera
  const dayName = date.toLocaleDateString('sv-SE', { weekday: 'long' });
  const dayAndMonth = date.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" });

  // Fasta röda dagar
  const fixedRedDays = [
    "1/1",  // Nyårsdagen
    "6/1",  // Trettondagen
    "1/5",  // Första maj
    "6/6",  // Sveriges nationaldag
    "24/12",  // Julafton
    "25/12",  // Juldagen
    "26/12",  // Annandag jul
    "31/12"   // Nyårsafton
  ];

  if (fixedRedDays.includes(dayAndMonth)) {
    return true;
  }

  // Beräkna påsken för det aktuella året
  const easterSunday = getEaster();

  // Rörliga helgdagar baserade på påsken
  const longFriday = new Date(easterSunday);
  longFriday.setDate(easterSunday.getDate() - 2); // Långfredag

  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterSunday.getDate() + 1); // Annandag påsk

  const ascensionDay = new Date(easterSunday);
  ascensionDay.setDate(easterSunday.getDate() + 39); // Kristi Himmelsfärdsdag

  const pentecostSunday = new Date(easterSunday);
  pentecostSunday.setDate(easterSunday.getDate() + 49); // Pingstdagen

  const movableRedDays = [
    longFriday.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" }),
    easterSunday.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" }),
    easterMonday.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" }),
    ascensionDay.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" }),
    pentecostSunday.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" })
  ];

  if (movableRedDays.includes(dayAndMonth) || dayName === "lördag" || dayName === "söndag") {
    return true;
  }

  return false;
}




//Dialog boxes

function dialog(day, name, event) {
  let dialogElement = document.getElementById("dialog");
  let clickedElement = event.target;
  let id = clickedElement.id;

  document.getElementById("dialogName").innerText = name + " - Dag: " + day
  dialogElement.showModal();
  document.body.style.overflow = "hidden";

  document.getElementById("dialogM").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "M"
    localStorage.setItem("buttonData_" + id, "M");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogX").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "X"
    localStorage.setItem("buttonData_" + id, "X");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialog-").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "-"
    localStorage.setItem("buttonData_" + id, "-");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogL").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "L"
    localStorage.setItem("buttonData_" + id, "L");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogS").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "S"
    localStorage.setItem("buttonData_" + id, "S");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogRensa").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "&nbsp;"
    localStorage.removeItem("buttonData_" + id);
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogclose").addEventListener("click", function () {
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

}

function displayEditNameArry(element, index) {
  document.getElementById("nameEditContainer").innerHTML += `
        <span id="inputContainer_${index}">
          <input type="text" readonly="readonly" value="${element}" class="nameEditItem">
<button class="removeNameInArray" onclick="removeNameInArray(${index}, '${element}')">X</button>

        </span>`;
}

function removeNameInArray(index, element) {

  if (index != "undefined" && index > -1) {
    if (confirm("Vill du verkligen ta bort " + element + "?")) {
      namesData.splice(index, 1);
      document.getElementById("nameEditContainer").innerHTML = "";
      for (var key in localStorage) {
        if (key.startsWith("buttonData_" + element + "_")) {
          if (confirm("vill du ta bort " + element + "'s närvaro?")) {
            localStorage.removeItem(key);
          }
        }
      }
      namesData.forEach(displayEditNameArry);
    }
  }
}

function addNameInArray() {
  newNameInput = document.getElementById("newNameInput").value;
  const exists = namesData.find(item => item === newNameInput) !== undefined;
  if (newNameInput.trim().length !== 0 && exists === false) {

    namesData.push(newNameInput);

    document.getElementById("nameEditContainer").innerHTML = "";
    namesData.forEach(displayEditNameArry);
    document.getElementById("newNameInput").value = "";
  }
}

function dialogEditTopBar() {

  const dialogEditTopBar = document.getElementById("MenuButtonEditDialog");
  dialogEditTopBar.showModal();
  deleteNames = -0;
  document.body.style.overflow = "hidden";


  document.getElementById("MenuButtonEditDialogclose").addEventListener("click", function () {
    let titelData = document.getElementById("grupp_NameInput").value;
    localStorage.setItem("titelData", titelData)
    document.getElementById("titelDataTitel").innerHTML = titelData;
    document.getElementById("column").innerHTML = "";
    if (namesData === undefined || namesData.length == 0) {
      localStorage.removeItem("namesData")
    } else {
      localStorage.setItem("namesData", JSON.stringify(namesData));
    }

    main(namesData);
    dialogEditTopBar.close();
    document.body.style.overflow = "auto";
  });
}