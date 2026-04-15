const LoadingBarDialog = document.getElementById("LoadingBarDialog");
const Months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
let currentDate;
let storage = localStorage;
let autoUpdate = true;
let namesData = [];
let index;
let year;
let month;
let day;
let ProgressBarInterval;

function EscapeString(string) {
          const escapedElement = string
        .replace(/\\/g, '\\\\')   // Escape backslash first
        .replace(/'/g, "\\'")     // Escape single quotes
        .replace(/"/g, '\\"')     // Escape double quotes
        .replace(/\r/g, '\\r')    // Escape carriage return
        .replace(/\0/g, '\\0');   // Escape null character
        return escapedElement;
}

window.onload = function() {
      if (navigator.serviceWorker) {
      navigator.serviceWorker
          // The register function takes as argument
          // the file path to the worker's file
          .register('../service_worker.js')
          // Gives us registration object
          .then(reg => console.log('Service Worker Registered'))
          .catch(err => console.log(`Service Worker Installation Error: ${err}}`));
};
  let thisDate = new Date();
  let this_Year = thisDate.getFullYear();
  let this_month = thisDate.getMonth();

  if (!autoUpdate) {
    if (sessionStorage.getItem("storedMonth") == null) {
        sessionStorage.setItem("storedMonth", this_month);
    }
    
    if (sessionStorage.getItem("storedYear") == null) {
        sessionStorage.setItem("storedYear", this_Year);
    }
  }else{
    if (localStorage.getItem("storedMonth") == null) {
        localStorage.setItem("storedMonth", this_month);
    }
    
    if (localStorage.getItem("storedYear") == null) {
        localStorage.setItem("storedYear", this_Year);
    } 
  }
    checkMonthChange();
    updateUI(this_Year, this_month);
}

async function updateUI(Year, Month) {
  const daysInMonth = getAllDaysInMonth(Year, Month);
  LoadingBarDialog.showModal();
  currentDate = new Date(Year, Month);
  year = currentDate.getFullYear();
  month = currentDate.getMonth();
  day = currentDate.getDate();

  document.getElementById("numer").innerHTML = "";
  document.getElementById("column").innerHTML = "";

if (localStorage.getItem("storedMonth") == undefined || localStorage.getItem("storedMonth") == null) {
  localStorage.setItem("storedMonth", month);
}
if (localStorage.getItem("storedYear") == undefined || localStorage.getItem("storedYear") == null) {
  localStorage.setItem("storedYear", year);
} 

  PreloadSwichDate().then(() => {
    document.getElementById("MenuButtonSwichDate").style.cursor = "pointer";
    document.getElementById("dialogSwichDateButtons").style.visibility = "visible";
    document.getElementById("dialogSwichDateLoader").style.display = "none";
  });

  if (storage.getItem("titelData") == null || storage.getItem("titelData") == undefined) {
    storage.setItem("titelData", "Namnlös");
  }
  
  document.getElementById("titelDataTitel").innerText = storage.getItem("titelData");

  document.getElementById("gruppEditContainer").innerHTML =
    '<input type="text" maxlength="50" oninput="checkMaxLength(this)" id="grupp_NameInput" placeholder="Gruppens namn" value="' + storage.getItem("titelData") + '" class="gruppEditItem"></input>';

  document.getElementById("titleDate").innerHTML = `${Months[Month]} ${Year}`;
  document.getElementById("dialogNameYear").innerHTML = `${Year}`;
  document.title = `Närvaro lista - ${document.getElementById("titleDate").innerText} `;


    for (let i = 1; i <= daysInMonth.length; i++) {
    document.getElementById("numer").innerHTML +=
      '<span class="numerRow">' +
      '<p class="numer">' + i + '</p>' +
      '</span>';
  }

  if (storage.getItem("namesData") == null || storage.getItem("namesData").length === 0) {
    document.getElementById("column").innerHTML = "<h1>Inga namn hittades</h1><h2>Klicka på <br> redigera deltagare</h2>";
    LoadingBarDialog.close();
    return;
  }

  try {
    namesData = JSON.parse(storage.getItem("namesData"));
  } catch (error) {
    alert("Fel vid parsning av JSON. Se console för mer info.");
    console.error("Fel vid parsning av JSON:", error);
  }
  if (namesData == null || namesData == undefined || namesData.length === 0) {
      document.getElementById("column").innerHTML = "<h1>Inga namn hittades</h1><h2>Klicka på <br> redigera deltagare</h2>";
      LoadingBarDialog.close();
    return;
  }
    clearInterval(ProgressBarInterval);
    main(namesData).then(() => {
        namesData.forEach(displayEditNameArry);
if (autoUpdate) {
      var elem = document.getElementById("checkMonthChangeProgressBar");
      var width = 1;
      ProgressBarInterval = setInterval(frame, 1000);
  function frame() {
    if (width >= 100) {
      checkMonthChange()
      width = 1;
      elem.style.width = width + "%";
    } else {
      width++;
      elem.style.width = width + "%";
    }
  }
  }
});
}

function setAutoUpdate(value){
  if(value){
    autoUpdate = true;
    clearInterval(ProgressBarInterval);
      var elem = document.getElementById("checkMonthChangeProgressBar");
      var width = 1;
      ProgressBarInterval = setInterval(frame, 1000);
  function frame() {
    if (width >= 100) {
      checkMonthChange()
      width = 1;
      elem.style.width = width + "%";
    } else {
      width++;
      elem.style.width = width + "%";
    }
  }
}else{
    autoUpdate = false;
    clearInterval(ProgressBarInterval);
    document.getElementById("checkMonthChangeProgressBar").style.width = 0 + "%"
  }
}

function setTemp(value){
  if(!value){
    storage= localStorage;
    setAutoUpdate(true);
    document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons"
        style="vertical-align:middle; font-size: 15px;">edit</i> Redigera deltagare`;
    document.getElementById("MenuButtonDialogEditTopBar").onclick = function() 
    {
      dialogEditTopBar()
    };
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
}else{
    storage= sessionStorage;
    setAutoUpdate(false);
    document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons"
        style="vertical-align:middle; font-size: 15px;">edit</i> Gå tillbaka`;
    document.getElementById("MenuButtonDialogEditTopBar").onclick = function()
    {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            sessionStorage.removeItem(key);
      }
      setTemp(false);
      let thisDate = new Date();
      let this_Year = thisDate.getFullYear();
      let this_month = thisDate.getMonth();
      updateUI(this_Year, this_month);
};
  }
}

async function checkMonthChange() {
  if (autoUpdate) {
    const currentDateCheck = new Date();
    if (localStorage.getItem("storedYear").toString() !== currentDateCheck.getFullYear().toString()) {
      clearInterval(ProgressBarInterval);
      document.getElementById("checkMonthChangeProgressBar").style.width = 0 + "%";
      document.querySelectorAll("dialog").forEach(dialog => {dialog.close();});

      await removeDB().then(() => {
      namesData = JSON.parse(localStorage.getItem("namesData"));
      const name_Group = localStorage.getItem("titelData");
      const dbVersion = localStorage.getItem("dbVersion");
      
      localStorage.clear();

      localStorage.setItem("namesData", JSON.stringify(namesData));
      localStorage.setItem("titelData", name_Group);
      localStorage.setItem("dbVersion", dbVersion);
      localStorage.setItem("currentDate", currentDateCheck);
      localStorage.setItem("storedMonth", currentDateCheck.getMonth());
      localStorage.setItem("storedYear", currentDateCheck.getFullYear());

      updateUI(currentDateCheck.getFullYear(), currentDateCheck.getMonth());
      });
    }
  if (localStorage.getItem("storedMonth").toString() !== (currentDateCheck.getMonth()).toString()) {
    clearInterval(ProgressBarInterval);
    document.getElementById("checkMonthChangeProgressBar").style.width = 0 + "%"
    document.querySelectorAll("dialog").forEach(dialog => {dialog.close();});
    try {
    namesData = JSON.parse(localStorage.getItem("namesData"));
    } catch (error) {
      alert("Fel vid parsning av JSON. Se console för mer info.");
      console.error("Fel vid parsning av JSON:", error);
    }
    let names = namesData;
    let output = [];
    output.push({ name_Group: localStorage.getItem("titelData") });
    if (names !== null && names !== undefined && names.length > 0) {
    for (let i = 0; i < names.length; i++) {
//      let workDayArr = [];
      let workDayArrOveride = [];
      let escapedName = EscapeString(names[i]);
      const daysInMonth = getAllDaysInMonth(currentDateCheck.getFullYear(), currentDateCheck.getMonth());
        for (let j = 1; j <= daysInMonth.length; j++) {
        if (localStorage.getItem(`buttonData_${escapedName}_${j}_heldag`) != null) {
          workDayArrOveride.push(`buttonData_${escapedName}_${j}_heldag:` + localStorage.getItem(`buttonData_${escapedName}_${j}_heldag`));
        } else if (localStorage.getItem(`buttonData_${escapedName}_${j}_halvdag`) != null) {
          workDayArrOveride.push(`buttonData_${escapedName}_${j}_halvdag:` + localStorage.getItem(`buttonData_${escapedName}_${j}_halvdag`));
        }
      }
//      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Mandag`));
//      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Tisdag`));
//      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Onsdag`));
//      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Torsdag`));
//      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Fredag`));
//        arbetsDagar: workDayArr,
      output.push({
        name: names[i],
        arbetsdagArrOveride: workDayArrOveride,
      });
    }
  }
    await saveData(output).then(() => {
      namesData = JSON.parse(localStorage.getItem("namesData"));
      const name_Group = localStorage.getItem("titelData");
      const dbVersion = localStorage.getItem("dbVersion");
      
      localStorage.clear();

      localStorage.setItem("namesData", JSON.stringify(namesData));
      localStorage.setItem("titelData", name_Group);
      localStorage.setItem("dbVersion", dbVersion);
      localStorage.setItem("currentDate", currentDateCheck);
      localStorage.setItem("storedMonth", currentDateCheck.getMonth());
      localStorage.setItem("storedYear", currentDateCheck.getFullYear());
    
    updateUI(currentDateCheck.getFullYear(), currentDateCheck.getMonth());

    });
  }
}
}

async function main(namesData) {
  let names = namesData;
  window.scrollTo({
    top: 1,
    left: 1,
    behavior: "smooth",
  });
  const checkDate =  new Date(currentDate);
  let columnContainerCount = 0;
  names.sort((a, b) => a.localeCompare(b, 'sv'));
  // Build the entire HTML string at once instead of appending in loops
  let columnHTML = '';
  for (let i = 0; i < names.length; i++) {
    columnContainerCount++;
    columnHTML += '<div class="nameContainer"><p class="name">' + names[i] + '</p></div>';
    const daysInMonth = getAllDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    for (let j = 1; j <= daysInMonth.length; j++) {
      checkDate.setDate(j);
      let escapedElement = EscapeString(names[i]);
      let buttonData_Halvdag = "&nbsp;";
      let buttonData_Heldag = "&nbsp;";
      //let dayName = currentDate.toLocaleDateString('sv-SE', { weekday: 'long' });

      const redDay = isRedDay(j);
      const heldagClass = redDay ? 'Row-weekend' : 'Row-Heldag';
      const halvdagClass = redDay ? 'Row-weekend' : 'Row-Halvdag';
      const onclick = redDay ? '' : `onclick="dialog(${j}, '${escapedElement}', event)"`;

        if (storage.getItem("buttonData_" + escapedElement + "_" + j + "_heldag") != undefined || storage.getItem("buttonData_" + escapedElement + "_" + j + "_heldag") != null) {
          buttonData_Heldag = storage.getItem("buttonData_" + escapedElement + "_" + j + "_heldag");
        } else if (storage.getItem("buttonData_" + escapedElement + "_" + j + "_halvdag") != undefined || storage.getItem("buttonData_" + escapedElement + "_" + j + "_halvdag") != null) {
          buttonData_Halvdag = storage.getItem("buttonData_" + escapedElement + "_" + j + "_halvdag");
        } //else {
  //    if (dayName == "måndag") {
  //      if (storage.getItem("buttonData_" + names[i] + "_Mandag") == null || storage.getItem("buttonData_" + names[i] + "_Mandag") == undefined) {
  //        buttonData_Heldag = "&nbsp;";
  //      } else {
  //        if (storage.getItem("buttonData_" + names[i] + "_Mandag") == "HE") {
  //          buttonData_Heldag = storage.getItem("buttonData_" + names[i] + "_Mandag");
  //        } else {
  //          buttonData_Halvdag = storage.getItem("buttonData_" + names[i] + "_Mandag");
  //        }
  //      }
  //    }
  //    if (dayName == "tisdag") {
  //      if (storage.getItem("buttonData_" + names[i] + "_Tisdag") == null || storage.getItem("buttonData_" + names[i] + "_Tisdag") == undefined) {
  //        buttonData_Heldag = "&nbsp;"
  //      }
  //      else {
  //        if (storage.getItem("buttonData_" + names[i] + "_Tisdag") == "HE") {
  //          buttonData_Heldag = storage.getItem("buttonData_" + names[i] + "_Tisdag");
  //        }
  //        else {
  //          buttonData_Halvdag = storage.getItem("buttonData_" + names[i] + "_Tisdag");
  //        }
  //      }
  //    }
  //    if (dayName == "onsdag") {
  //      if (storage.getItem("buttonData_" + names[i] + "_Onsdag") == null || storage.getItem("buttonData_" + names[i] + "_Onsdag") == undefined) {
  //        buttonData_Heldag = "&nbsp;"
  //      }
  //      else {
  //        if (storage.getItem("buttonData_" + names[i] + "_Onsdag") == "HE") {
  //          buttonData_Heldag = storage.getItem("buttonData_" + names[i] + "_Onsdag");
  //        }
  //        else {
  //          buttonData_Halvdag = storage.getItem("buttonData_" + names[i] + "_Onsdag");
  //        }
  //      }
  //    }
  //    if (dayName == "torsdag") {
  //      if (storage.getItem("buttonData_" + names[i] + "_Torsdag") == null || storage.getItem("buttonData_" + names[i] + "_Torsdag") == undefined) {
  //        buttonData_Heldag = "&nbsp;"
  //      }
  //      else {
  //        if (storage.getItem("buttonData_" + names[i] + "_Torsdag") == "HE") {
  //          buttonData_Heldag = storage.getItem("buttonData_" + names[i] + "_Torsdag");
  //        }
  //        else {
  //          buttonData_Halvdag = storage.getItem("buttonData_" + names[i] + "_Torsdag");
  //        }
  //      }
  //    }
  //    if (dayName == "fredag") {
  //      if (storage.getItem("buttonData_" + names[i] + "_Fredag") == null || storage.getItem("buttonData_" + names[i] + "_Fredag") == undefined) {
  //        buttonData_Heldag = "&nbsp;"
  //      }
  //      else {
  //        if (storage.getItem("buttonData_" + names[i] + "_Fredag") == "HE") {
  //          buttonData_Heldag = storage.getItem("buttonData_" + names[i] + "_Fredag");
  //        }
  //        else {
  //          buttonData_Halvdag = storage.getItem("buttonData_" + names[i] + "_Fredag");
  //        }
  //      }
  //    }
  //    }
      columnHTML +=
        '<div class="Row">' +
        '<div class="' + heldagClass + '">' +
        '<a class="full-width-button" id="' + escapedElement + '_' + j + '_heldag"' + onclick + '>' + buttonData_Heldag + '</a>' +
        '</div><br>' +
        '<div class="' + halvdagClass + '">' +
        '<a class="full-width-button" id="' + escapedElement + '_' + j + '_halvdag" ' + onclick + '>' + buttonData_Halvdag + '</a>' +
        '</div>' +
        '</div>';

    }
    if (columnContainerCount == 16){
          columnHTML += `<div class="brake-page"></div>`;
    }
    columnHTML += "<br>";
  }

  document.getElementById("column").innerHTML = columnHTML;
  LoadingBarDialog.close();
}

function getAllDaysInMonth(year, month) {
const days = [];

const daysInMonth = new Date(year, month + 1, 0).getDate();


  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

function getEaster(year) {
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

  return new Date(year, month - 1, day);
}

function getMidsommar(year) {
    // Start on June 19
    let date = new Date(year, 5, 19); // months are 0-indexed: 5 = June

    // Find the first Friday on or after June 19
    let dayOfWeek = date.getDay(); // 0 = Sunday, 5 = Friday
    let daysUntilFriday = (5 - dayOfWeek + 7) % 7; 
    date.setDate(date.getDate() + daysUntilFriday);

    return date;
}

function isRedDay(day) {
  const checkDate =  new Date(currentDate);
  checkDate.setDate(day); // Sätt dagen att kontrollera
  const dayName = checkDate.toLocaleDateString('sv-SE', { weekday: 'long' });
  const dayAndMonth = checkDate.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" });
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
  const easterSunday = getEaster(year);

  // Beräkna midsommar för det aktuella året
  const midsommar = getMidsommar(year);

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
    pentecostSunday.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" }),
    midsommar.toLocaleDateString('sv-SE', { month: "numeric", day: "numeric" })
  ];

  if (movableRedDays.includes(dayAndMonth) || dayName === "lördag" || dayName === "söndag") {
    return true;
  }

  return false;
}

//Dialog boxes

function closeDialog(dialogName) {
  const dialogElement = document.getElementById(dialogName);
  if (dialogElement) {
    dialogElement.close();
  }
}

function dialog(day, name, event) {
  let dialogElement = document.getElementById("dialog");
  let clickedElement = event.target;
  let id = clickedElement.id;

  document.getElementById("dialogName").innerText = name.toUpperCase() + " - Dag: " + day
  dialogElement.showModal();
  document.body.style.overflow = "hidden";

  document.getElementById("dialogM").onclick = function () {
    document.getElementById(id).innerHTML = "M"
    storage.setItem("buttonData_" + id, "M");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };

  document.getElementById("dialogX").onclick = function () {
    document.getElementById(id).innerHTML = "X"
    storage.setItem("buttonData_" + id, "X");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };

  document.getElementById("dialog-").onclick = function () {
    document.getElementById(id).innerHTML = "-"
    storage.setItem("buttonData_" + id, "-");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };

  document.getElementById("dialogL").onclick = function () {
    document.getElementById(id).innerHTML = "L"
    storage.setItem("buttonData_" + id, "L");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };

  document.getElementById("dialogS").onclick = function () {
    document.getElementById(id).innerHTML = "S"
    storage.setItem("buttonData_" + id, "S");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };

//  document.getElementById("dialogH").onclick = function () {
//    document.getElementById(id).innerHTML = "HE"
//    storage.setItem("buttonData_" + id, "HE");
//    dialogElement.close();
//    id = null
//    clickedElement = null
//    document.body.style.overflow = "auto";
//  };
//
//  document.getElementById("dialogF").onclick = function () {
//    document.getElementById(id).innerHTML = "HA"
//    storage.setItem("buttonData_" + id, "HA");
//    dialogElement.close();
//    id = null
//    clickedElement = null
//    document.body.style.overflow = "auto";
//  };

  document.getElementById("dialogRensa").onclick = function () {
    document.getElementById(id).innerHTML = "&nbsp;"
    storage.setItem("buttonData_" + id, " ");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };

  document.getElementById("dialogclose").onclick = function () {
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  };
}

async function PreloadSwichDate() {
const names = await getAllNarvaroDBNames();

if (names.length > 0){
names.forEach(item => {
const monthName = item.split(" ")[0];
if (monthName && document.getElementById(`dialogSwichDateMonad_${monthName}`)) {
document.getElementById(`dialogSwichDateMonad_${item.split(" ")[0]}`).style.background = "green";
document.getElementById(`dialogSwichDateMonad_${item.split(" ")[0]}`).style.cursor = "pointer";
document.getElementById(`dialogSwichDateMonad_${item.split(" ")[0]}`).onclick = function() {dialogSwichDateLoad(item,item.split(" ")[0])};
}
});
}else{
  document.querySelectorAll(".dialogButtonSwichDate").forEach(item => {
      item.style.background = "gray";
      item.style.cursor = "not-allowed";
      item.onclick = function(){};
  });
}
}

//Dialog boxe Swich Date
async function dialogSwichDate() {
    const dialogElement = document.getElementById("dialogSwichDate");
  dialogElement.showModal();
}

let monthData = [];

function dialogSwichDateLoad(item, monthName) {
  const dialogElement = document.getElementById("dialogSwichDate");

Months.forEach((month, index) => {
  if (month.toLowerCase() === monthName.toLowerCase()) {
    updateUI(item.split(" ")[1], index);
}
});

  dialogElement.close();
   LoadingBarDialog.showModal();
  let name_Group;
  setTemp(true);
  
  if (monthData[monthName] == null) {
getNarvaro(item).then(data => { 
 
monthData[monthName] = data;
      if (item.name) {
        name_Group = item.name_Group || "Namnlös";
      };
lssave(monthData[monthName],monthName,name_Group).then(() => {
  LoadingBarDialog.close();
}).catch(error => {
  return ("Ett fel uppstod vid lssave  data.",error);
});;

}).catch(error => {
  return ("Ett fel uppstod vid hämtning av data.",error);
});
  } else {

      if (item.name) {
        name_Group = item.name_Group || "Namnlös";
      };

lssave(monthData[monthName],monthName,name_Group).then(() => {
  LoadingBarDialog.close();
}).catch(error => {
  return ("Ett fel uppstod vid lssave data.",error);
});;
  }


//    document.getElementById("dialogSwichDateMonad_sparaFil").onclick = function () {
//      monthData[monthName].forEach(item => {
//      if (item.name) {
//        name_Group = item.name_Group || "Namnlös";
//      }});
//        saveDataToAsFile(JSON.stringify(monthData[monthName], null, 2),monthName,name_Group);
//    });
}


async function lssave(jsonData, monthName, name_Group) {
  if(monthName != null && name_Group != null){
    document.getElementById("titelDataTitel").innerHTML = name_Group;
    document.getElementById("titleDate").innerHTML = monthName;
  }


  if (!Array.isArray(jsonData)) {
    LoadingBarDialog.close();
    alert("Felaktigt format: förväntar en lista av objekt.");
    console.error("lssave: invalid jsonData", jsonData);
    return;
  }


  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (key && key.startsWith("buttonData_")) {
      storage.removeItem(key);
    }
    if (key && key === "titelData") {
      storage.removeItem(key);
    }
  }

  namesData = [];

  jsonData.forEach(item => {

    if (item.currentDate) {
    storage.setItem("currentDate",item.currentDate);
}

    if (!item || typeof item.name_Group === "string") {
      storage.setItem("titelData", String(item.name_Group));
      document.getElementById("grupp_NameInput").value = item.name_Group;
      document.getElementById("titelDataTitel").innerHTML = item.name_Group;
    }
    if (!item || typeof item.name !== "string") return;

    if (item.name === "name_Group") {
      storage.setItem("titelData", String(item.name_Group));
      document.getElementById("grupp_NameInput").value = item.name_Group;
      document.getElementById("titelDataTitel").innerHTML = item.name_Group;
    } else {
      const name = item.name;
      namesData.push(name);

//      const arbeteArray = Array.isArray(item.arbetsDagar) ? item.arbetsDagar : [];
//
//      for (let i = 0; i < arbeteArray.length; i++) {
//        let val = arbeteArray[i];
//        let key = "";
//        if (i == 0) {
//          key = `buttonData_${name}_Mandag`;
//        } else if (i == 1) {
//          key = `buttonData_${name}_Tisdag`;
//        } else if (i == 2) {
//          key = `buttonData_${name}_Onsdag`;
//        } else if (i == 3) {
//          key = `buttonData_${name}_Torsdag`;
//        } else if (i == 4) {
//          key = `buttonData_${name}_Fredag`;
//        }
//
//        if (val === null || val === "" || val === "&nbsp;") {
//          storage.removeItem(key);
//        } else {
//          storage.setItem(key, String(val));
//        }
//    }


      const arbeteArrayOveride = Array.isArray(item.arbetsdagArrOveride) ? item.arbetsdagArrOveride : [];
      for (let i = 0; i < arbeteArrayOveride.length; i++) {
        let val = arbeteArrayOveride[i];
        if (val == "null" || val == null || val.length == 0) {
          continue;
        } else {
          const [data, value] = val.split(/:(.+)/).filter(Boolean);
          if (value === null || value === "" || value === "&nbsp;") {
            storage.removeItem(data);
          } else {
            storage.setItem(data, String(value));
          }
        }
      }
    }
  });


  storage.setItem("namesData", JSON.stringify(namesData));
  document.getElementById("nameEditContainer").innerHTML = "";

  if (namesData.length === 0) {
    document.getElementById("column").innerHTML = "<h1>Inga namn hittades</h1><h2>Klicka på <br> redigera deltagare</h2>";
    LoadingBarDialog.close();
  } else {
      document.getElementById("column").innerHTML = " ";
      main(namesData).then(() => {
        namesData.forEach(displayEditNameArry);
      });
  }
}


function getJson() {
  let names = namesData;
  let output = [];
  output.push({ name_Group: storage.getItem("titelData") });
  for (let i = 0; i < names.length; i++) {
//    let workDayArr = [];
//    let workDayArrOveride = [];
//    const daysInMonth = getAllDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
//    for (let j = 1; j <= daysInMonth.length; j++) {
//      if (storage.getItem(`buttonData_${names[i]}_${j}_heldag`) != null) {
//        workDayArrOveride.push(`buttonData_${names[i]}_${j}_heldag:` + storage.getItem(`buttonData_${names[i]}_${j}_heldag`));
//      } else if (storage.getItem(`buttonData_${names[i]}_${j}_halvdag`) != null) {
//        workDayArrOveride.push(`buttonData_${names[i]}_${j}_halvdag:` + storage.getItem(`buttonData_${names[i]}_${j}_halvdag`));
//      }
//    }
//    workDayArr.push(storage.getItem(`buttonData_${names[i]}_Mandag`));
//    workDayArr.push(storage.getItem(`buttonData_${names[i]}_Tisdag`));
//    workDayArr.push(storage.getItem(`buttonData_${names[i]}_Onsdag`));
//    workDayArr.push(storage.getItem(`buttonData_${names[i]}_Torsdag`));
//    workDayArr.push(storage.getItem(`buttonData_${names[i]}_Fredag`));

    output.push({
      name: names[i],
//      arbetsDagar: workDayArr,
//      arbetsdagArrOveride: workDayArrOveride,
    });
  }

   let name_Group = document.getElementById("titelDataTitel").innerText;
   let TitelMonth = document.getElementById("titleDate").innerText;

  saveDataToAsFile(JSON.stringify(output, null, 2),TitelMonth,name_Group);
}

function saveDataToAsFile(jsonString, monthName,name_Group) {
    const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name_Group} (${monthName}).json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


async function clearAllData() {
  try {
  let thisDate = new Date();
  let this_Year = thisDate.getFullYear();
  let this_month = thisDate.getMonth();
  autoUpdate = false;

    localStorage.clear();
    console.log("LocalStorage cleared");

    sessionStorage.clear();
    console.log("SessionStorage cleared");

    await removeDB().then(async () => {
      autoUpdate = true;
    await  updateUI(this_Year, this_month);
    });

    console.log("All data cleared successfully");

    return true;
  
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
}