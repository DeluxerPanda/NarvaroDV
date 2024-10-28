let ButtonPrintOldExist = false;
function dialogPrint() {

  const dialogPrintTopBar = document.getElementById("MenuButtonPrintDialog");

  for (var key in localStorage) {
    if (key.startsWith('OLD_')) {
      ButtonPrintOldExist = true;
      break;
    }
  }

  if (ButtonPrintOldExist) {
    document.getElementById("MenuButtonPrintOld").style.display = "block";
  } else {
    document.getElementById("MenuButtonPrintOld").style.display = "none";
  }

  dialogPrintTopBar.showModal();



  document.getElementById("MenuButtonPrintOld").addEventListener("click", function () {
    dialogPrintTopBar.close();
    printOld();
  });

  document.getElementById("MenuButtonPrintCurrent").addEventListener("click", function () {
    dialogPrintTopBar.close();
    printMain();
  });

  document.getElementById("MenuButtonPrintDialogclose").addEventListener("click", function () {
    dialogPrintTopBar.close();
  });
}


function printMain() {
  var printContents = document.getElementById("layoutMain").innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}
const oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() - 1);

const previousMonthDate = new Date(oldDate.getFullYear(), oldDate.getMonth(), 1);

const setTitelMonthOld = previousMonthDate.toLocaleString('sv-SE', { month: 'long' });
const setTitelYearOld = previousMonthDate.toLocaleString('sv-SE', { year: 'numeric' });


function printOld() {
  let originalContents = document.body.innerHTML;

  document.body.innerHTML = `
<head>
    <main id="layoutOld">
        <div class="title-container">
            <div class="title title-child">
                <a id="titelDataTitel_OLD"></a>
                <br>
                <a id="titleDate_OLD"></a>
            </div>
            <div class="info-Box title-child">
                <div class="info-Heldag-Box">
                    <a class="info-Text">Heldag</a>
                </div>
                <div class="info-Halvdag-Box">
                    <a class="info-Text">Halvdag</a>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="numerCenter" id="numer_OLD"></div>
            <div id="column_OLD"></div>
        </div>
    </main>
</head>
`;

  if (localStorage.getItem("titelData") == null) {
    sessionStorage.setItem("titelData", "Namnlös");
    storageType = sessionStorage;
  } else {
    sessionStorage.removeItem("titelData")
    storageType = localStorage;
  }

  document.getElementById("titelDataTitel_OLD").innerHTML += storageType.getItem("titelData");

  document.getElementById("titleDate_OLD").innerHTML = `${setTitelMonthOld} ${setTitelYearOld}`;

  document.title = `Närvaro lista - ${document.getElementById("titleDate_OLD").innerText} `;

  // 
  namesData = JSON.parse(localStorage.getItem("namesDataOld"));
  let names = namesData

  for (let i = 1; i <= daysInMonth.length; i++) {

    document.getElementById("numer_OLD").innerHTML +=
      '<span class="numerRow">' +
      '<p class="numer">' + i + '</p>' +
      '</span>';
  }

  for (let i = 0; i < namesData.length; i++) {

    document.getElementById('column_OLD').innerHTML += '<div class="nameContainer"><p class="name">' + names[i] + '</p></div>';

    const output = document.querySelectorAll('.name')[i];
    const outputContainer = document.querySelectorAll('.nameContainer')[i];

    let fontSize = parseFloat(window.getComputedStyle(output).fontSize);

    while (output.clientHeight > outputContainer.clientHeight && fontSize > 1) {
      fontSize--;
      output.style.fontSize = fontSize + 'px';
    }

    output.style.fontSize = '15px';

    for (let j = 1; j <= daysInNumbers; j++) {

      const redDay = isRedDay(j);
      const heldagClass = redDay ? 'Row-weekend' : 'Row-Heldag';
      const halvdagClass = redDay ? 'Row-weekend' : 'Row-Halvdag';
      let buttonData_Halvdag;
      let buttonData_Heldag;

      if (localStorage.getItem("OLD_" + names[i] + "_" + j + "_Heldag") == null) {
        buttonData_Heldag = "&nbsp;"
      } else {
        buttonData_Heldag = localStorage.getItem("OLD_" + names[i] + "_" + j + "_Heldag");
      }

      if (localStorage.getItem("OLD_" + names[i] + "_" + j + "_Halvdag") == null) {
        buttonData_Halvdag = "&nbsp;"
      } else {
        buttonData_Halvdag = localStorage.getItem("OLD_" + names[i] + "_" + j + "_Halvdag");
      }

      document.getElementById("column_OLD").innerHTML +=
        '<div class="Row">' +
        '<div class="' + heldagClass + '">' +
        '<a class="full-width-button" id="' + names[i] + '_' + j + '_Heldag">' + buttonData_Heldag + '</a>' +
        '</div><br>' +
        '<div class="' + halvdagClass + '">' +
        '<a class="Halvdag full-width-button" id="' + names[i] + '_' + j + '_Halvdag">' + buttonData_Halvdag + '</a>' +
        '</div>' +
        '</div>';
    }

    document.getElementById("column_OLD").innerHTML += "<br>";
  }

  window.print();


  document.body.innerHTML = originalContents;
  document.title = `Närvaro lista - ${document.getElementById("titleDate").innerText} `;
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