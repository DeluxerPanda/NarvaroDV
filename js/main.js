const currentDate = new Date();
const year = currentDate.getFullYear();
let month = currentDate.getMonth();
const day = currentDate.getDate();
const setTitelMonth = currentDate.toLocaleString('sv-SE', { month: 'long' });
const setTitelYear = currentDate.toLocaleString('sv-SE', { year: 'numeric' });
const daysInMonth = getAllDaysInMonth(year, month);
const daysInNumbers = new Date(year, month + 1, 0).getDate();
const LoadingBarDialog = document.getElementById("LoadingBarDialog");
let namesData = [];
let index;
let isTemp = false;
let stroage = localStorage;

window.onload = (event) => {
  if (localStorage.getItem("storedMonth") == undefined) {
  localStorage.setItem("storedMonth", month);
}
if (localStorage.getItem("storedYear") == undefined) {
  localStorage.setItem("storedYear", year);
}

  setTemp(false);

  checkMonthChange();
  setInterval(checkMonthChange, 20345);
 
  loadDate();

  window.scrollTo({
    top: 1,
    left: 1,
    behavior: "smooth",
  });

  window.onbeforeunload = function (e) {
    if (LoadingBarDialog.showModal == true) {
      e.preventDefault();
    }
  };
};

function setTemp(value){
  if(value){
    stroage = sessionStorage;
    isTemp = true;
    document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons"
        style="vertical-align:middle; font-size: 15px;">edit</i> Gå tillbaka`;
    document.getElementById("MenuButtonDialogEditTopBar").onclick = function() 
    {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            sessionStorage.removeItem(key);
      }
      window.location = window.location;
};

}else{
    stroage = localStorage;
    isTemp = false;
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
  }
}

async function checkMonthChange() {
  if (localStorage.getItem("storedMonth") !== month.toString()) {
    namesData = JSON.parse(localStorage.getItem("namesData"));
    let names = namesData;
    let output = [];
    output.push({ name_Group: localStorage.getItem("titelData") });
    if (namesData !== null){
    for (let i = 0; i < names.length; i++) {
      let workDayArr = [];
      let workDayArrOveride = [];
      for (let j = 1; j <= daysInNumbers; j++) {
        if (localStorage.getItem(`buttonData_${names[i]}_${j}_heldag`) != null) {
          workDayArrOveride.push(`buttonData_${names[i]}_${j}_heldag:` + localStorage.getItem(`buttonData_${names[i]}_${j}_heldag`));
        } else if (localStorage.getItem(`buttonData_${names[i]}_${j}_halvdag`) != null) {
          workDayArrOveride.push(`buttonData_${names[i]}_${j}_halvdag:` + localStorage.getItem(`buttonData_${names[i]}_${j}_halvdag`));
        }
      }
      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Mandag`));
      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Tisdag`));
      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Onsdag`));
      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Torsdag`));
      workDayArr.push(localStorage.getItem(`buttonData_${names[i]}_Fredag`));

      output.push({
        name: names[i],
        arbetsDagar: workDayArr,
        arbetsdagArrOveride: workDayArrOveride,
      });
    }
  }
    await saveData(output).then(() => {

      localStorage.setItem("storedMonth", month);
   
    if (localStorage.getItem("storedYear") !== year.toString()) {
      localStorage.setItem("storedYear", year);
  }
    //  window.location = window.location;

    });
  }
}

function loadDate() {
  LoadingBarDialog.showModal();
  for (let i = 1; i <= daysInMonth.length; i++) {
    document.getElementById("numer").innerHTML +=
      '<span class="numerRow">' +
      '<p class="numer">' + i + '</p>' +
      '</span>';
  }

  PreloadSwichDate().then(() => {
    document.getElementById("MenuButtonSwichDate").style.cursor = "pointer";
    document.getElementById("dialogSwichDateButtons").style.visibility = "visible";
    document.getElementById("dialogSwichDateLoader").remove();
  });

  if (stroage.getItem("namesData") == null || stroage.getItem("namesData") == "undefined" || stroage.getItem("namesData").length === 0) {
    document.getElementById("column").innerHTML += "<h1>Inga namn hittades</h1><h2>Klicka på <br> redigera deltagare</h2>"
    LoadingBarDialog.close();
  } else {

    namesData = JSON.parse(stroage.getItem("namesData"));
    document.getElementById("column").innerHTML = "";
    main(namesData);
    namesData.forEach(displayEditNameArry);
  }

  if (stroage.getItem("titelData") == null) {
    stroage.setItem("titelData", "Namnlös");
  }

  document.getElementById("titelDataTitel").innerHTML += stroage.getItem("titelData");

  document.getElementById("gruppEditContainer").innerHTML =
    '<input type="text" maxlength="50" oninput="checkMaxLength(this)" id="grupp_NameInput" placeholder="Gruppens namn" value="' + stroage.getItem("titelData") + '" class="gruppEditItem"></input>';

  document.getElementById("titleDate").innerHTML = `${setTitelMonth} ${setTitelYear}`;
  document.getElementById("dialogNameYear").innerHTML = `${year}`;
  document.title = `Närvaro lista - ${document.getElementById("titleDate").innerText} `;
}




async function main(namesData) {
  let names = namesData;
  window.scrollTo({
    top: 1,
    left: 1,
    behavior: "smooth",
  });

  names.sort((a, b) => a.localeCompare(b, 'sv'));
  // Build the entire HTML string at once instead of appending in loops
  let columnHTML = '';
  for (let i = 0; i < names.length; i++) {
    columnHTML += '<div class="nameContainer"><p class="name">' + names[i] + '</p></div>';
    const date = new Date();
    for (let j = 1; j <= daysInNumbers; j++) {
      date.setDate(j);
      let dayName = date.toLocaleDateString('sv-SE', { weekday: 'long' });

      const redDay = isRedDay(j);
      const heldagClass = redDay ? 'Row-weekend' : 'Row-Heldag';
      const halvdagClass = redDay ? 'Row-weekend' : 'Row-Halvdag';

      const onclick = redDay ? '' : `onclick="dialog(${j}, '${names[i]}', event)"`;
      let buttonData_Halvdag = "&nbsp;";
      let buttonData_Heldag = "&nbsp;";

      // Simplified logic for day-specific data (keeping your original logic intact)
      if (dayName == "måndag") {
        if (stroage.getItem("buttonData_" + names[i] + "_Mandag") == null || stroage.getItem("buttonData_" + names[i] + "_Mandag") == undefined) {
          buttonData_Heldag = "&nbsp;";
        } else {
          if (stroage.getItem("buttonData_" + names[i] + "_Mandag") == "HE") {
            buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_Mandag");
          } else {
            buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_Mandag");
          }
        }
        // Override checks (unchanged)
        if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != null) {
          buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag");
        } else if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != null) {
          buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag");
        }
      }
      if (dayName == "tisdag") {
        if (stroage.getItem("buttonData_" + names[i] + "_Tisdag") == null || stroage.getItem("buttonData_" + names[i] + "_Tisdag") == undefined) {
          buttonData_Heldag = "&nbsp;"
        }
        else {
          if (stroage.getItem("buttonData_" + names[i] + "_Tisdag") == "HE") {
            buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_Tisdag");
          }
          else {
            buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_Tisdag");
          }
        }
        if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != null) {
          buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag");
        } else if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != null) {
          buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag");
        }
      }
      if (dayName == "onsdag") {
        if (stroage.getItem("buttonData_" + names[i] + "_Onsdag") == null || stroage.getItem("buttonData_" + names[i] + "_Onsdag") == undefined) {
          buttonData_Heldag = "&nbsp;"
        }
        else {
          if (stroage.getItem("buttonData_" + names[i] + "_Onsdag") == "HE") {
            buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_Onsdag");
          }
          else {
            buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_Onsdag");
          }
        }
        if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != null) {
          buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag");
        } else if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != null) {
          buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag");
        }
      }
      if (dayName == "torsdag") {
        if (stroage.getItem("buttonData_" + names[i] + "_Torsdag") == null || stroage.getItem("buttonData_" + names[i] + "_Torsdag") == undefined) {
          buttonData_Heldag = "&nbsp;"
        }
        else {
          if (stroage.getItem("buttonData_" + names[i] + "_Torsdag") == "HE") {
            buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_Torsdag");
          }
          else {
            buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_Torsdag");
          }
        }
        if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != null) {
          buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag");
        } else if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != null) {
          buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag");
        }
      }
      if (dayName == "fredag") {
        if (stroage.getItem("buttonData_" + names[i] + "_Fredag") == null || stroage.getItem("buttonData_" + names[i] + "_Fredag") == undefined) {
          buttonData_Heldag = "&nbsp;"
        }
        else {
          if (stroage.getItem("buttonData_" + names[i] + "_Fredag") == "HE") {
            buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_Fredag");
          }
          else {
            buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_Fredag");
          }
        }
        if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag") != null) {
          buttonData_Heldag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_heldag");
        } else if (stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != undefined || stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag") != null) {
          buttonData_Halvdag = stroage.getItem("buttonData_" + names[i] + "_" + j + "_halvdag");
        }
      }
      columnHTML +=
        '<div class="Row">' +
        '<div class="' + heldagClass + '">' +
        '<a class="full-width-button" id="' + names[i] + '_' + j + '_heldag"' + onclick + '>' + buttonData_Heldag + '</a>' +
        '</div><br>' +
        '<div class="' + halvdagClass + '">' +
        '<a class="full-width-button" id="' + names[i] + '_' + j + '_halvdag" ' + onclick + '>' + buttonData_Halvdag + '</a>' +
        '</div>' +
        '</div>';
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

  document.getElementById("dialogName").innerText = name + " - Dag: " + day
  dialogElement.showModal();
  document.body.style.overflow = "hidden";

  document.getElementById("dialogM").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "M"
    stroage.setItem("buttonData_" + id, "M");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogX").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "X"
    stroage.setItem("buttonData_" + id, "X");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialog-").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "-"
    stroage.setItem("buttonData_" + id, "-");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogL").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "L"
    stroage.setItem("buttonData_" + id, "L");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogS").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "S"
    stroage.setItem("buttonData_" + id, "S");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogH").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "HE"
    stroage.setItem("buttonData_" + id, "HE");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogF").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "HA"
    stroage.setItem("buttonData_" + id, "HA");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogRensa").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "&nbsp;"
    stroage.setItem("buttonData_" + id, " ");
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

async function PreloadSwichDate() {
const names = await getAllNarvaroDBNames();
names.forEach(item => {
document.getElementById(`dialogSwichDateMonad_${item.split(" ")[0]}`).style.background = "green";
document.getElementById(`dialogSwichDateMonad_${item.split(" ")[0]}`).style.cursor = "pointer";
document.getElementById(`dialogSwichDateMonad_${item.split(" ")[0]}`).onclick = function() {dialogSwichDateLoad(item,item.split(" ")[0]);};
});
}

//Dialog boxe Swich Date
async function dialogSwichDate() {
    const dialogElement = document.getElementById("dialogSwichDate");
  dialogElement.showModal();
}

let monthData = [];

function dialogSwichDateLoad(item, monthName) {
  const dialogElement = document.getElementById("dialogSwichDate");
  document.getElementById("titleDate").innerText = `${monthName} ${setTitelYear}`;
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

    console.log(monthData);
  }


//    document.getElementById("dialogSwichDateMonad_sparaFil").addEventListener("click", function () {
//      monthData[monthName].forEach(item => {
//      if (item.name) {
//        name_Group = item.name_Group || "Namnlös";
//      }});
//        saveDataToAsFile(JSON.stringify(monthData[monthName], null, 2),monthName,name_Group);
//    });
}


function lssave(jsonData, monthName, name_Group) {
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


  for (let i = stroage.length - 1; i >= 0; i--) {
    const key = stroage.key(i);
    if (key && key.startsWith("buttonData_")) {
      stroage.removeItem(key);
    }
    if (key && key === "titelData") {
      stroage.removeItem(key);
    }
  }

  namesData = [];

  jsonData.forEach(item => {

    if (!item || typeof item.name_Group === "string") {
      stroage.setItem("titelData", String(item.name_Group));
      document.getElementById("grupp_NameInput").value = item.name_Group;
      document.getElementById("titelDataTitel").innerHTML = item.name_Group;
    }
    if (!item || typeof item.name !== "string") return;

    if (item.name === "name_Group") {
      stroage.setItem("titelData", String(item.name_Group));
      document.getElementById("grupp_NameInput").value = item.name_Group;
      document.getElementById("titelDataTitel").innerHTML = item.name_Group;
    } else {
      const name = item.name;
      namesData.push(name);

      const arbeteArray = Array.isArray(item.arbetsDagar) ? item.arbetsDagar : [];

      for (let i = 0; i < arbeteArray.length; i++) {
        let val = arbeteArray[i];
        let key = "";
        if (i == 0) {
          key = `buttonData_${name}_Mandag`;
        } else if (i == 1) {
          key = `buttonData_${name}_Tisdag`;
        } else if (i == 2) {
          key = `buttonData_${name}_Onsdag`;
        } else if (i == 3) {
          key = `buttonData_${name}_Torsdag`;
        } else if (i == 4) {
          key = `buttonData_${name}_Fredag`;
        }

        if (val === null || val === "" || val === "&nbsp;") {
          stroage.removeItem(key);
        } else {
          stroage.setItem(key, String(val));
        }
    }


      const arbeteArrayOveride = Array.isArray(item.arbetsdagArrOveride) ? item.arbetsdagArrOveride : [];
      for (let i = 0; i < arbeteArrayOveride.length; i++) {
        let val = arbeteArrayOveride[i];
        if (val == "null" || val == null || val.length == 0) {
          continue;
        } else {
          const [data, value] = val.split(/:(.+)/).filter(Boolean);
          if (value === null || value === "" || value === "&nbsp;") {
            stroage.removeItem(data);
          } else {
            stroage.setItem(data, String(value));
          }
        }
      }
    }
  });


  stroage.setItem("namesData", JSON.stringify(namesData));
  document.getElementById("nameEditContainer").innerHTML = "";
  document.getElementById("column").innerHTML = "";

  if (namesData.length === 0) {
    document.getElementById("column").innerHTML = "<h1>Inga namn hittades</h1><h2>Klicka på <br> redigera deltagare</h2>";
    LoadingBarDialog.close();
  } else {
    setTimeout(() => {
      document.getElementById("column").innerHTML = "";
      main(namesData);
    }, 1000);
    namesData.forEach(displayEditNameArry);
  }
}


function getjsoin() {
  let names = namesData;
  let output = [];
  output.push({ name_Group: stroage.getItem("titelData") });
  for (let i = 0; i < names.length; i++) {
    let workDayArr = [];
    let workDayArrOveride = [];
    for (let j = 1; j <= daysInNumbers; j++) {
      if (stroage.getItem(`buttonData_${names[i]}_${j}_heldag`) != null) {
        workDayArrOveride.push(`buttonData_${names[i]}_${j}_heldag:` + stroage.getItem(`buttonData_${names[i]}_${j}_heldag`));
      } else if (stroage.getItem(`buttonData_${names[i]}_${j}_halvdag`) != null) {
        workDayArrOveride.push(`buttonData_${names[i]}_${j}_halvdag:` + stroage.getItem(`buttonData_${names[i]}_${j}_halvdag`));
      }
    }
    workDayArr.push(stroage.getItem(`buttonData_${names[i]}_Mandag`));
    workDayArr.push(stroage.getItem(`buttonData_${names[i]}_Tisdag`));
    workDayArr.push(stroage.getItem(`buttonData_${names[i]}_Onsdag`));
    workDayArr.push(stroage.getItem(`buttonData_${names[i]}_Torsdag`));
    workDayArr.push(stroage.getItem(`buttonData_${names[i]}_Fredag`));

    output.push({
      name: names[i],
      arbetsDagar: workDayArr,
      arbetsdagArrOveride: workDayArrOveride,
    });
  }

  saveData(output)
    .then(() => console.log("Data saved to IndexedDB"))
    .catch(err => console.error("IndexedDB error:", err));

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
