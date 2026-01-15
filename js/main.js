const currentDate = new Date();
const year = currentDate.getFullYear();
let month = currentDate.getMonth();
const day = currentDate.getDate();
const setTitelMonth = currentDate.toLocaleString('sv-SE', { month: 'long' });
const setTitelYear = currentDate.toLocaleString('sv-SE', { year: 'numeric' });
const daysInMonth = getAllDaysInMonth(year, month);
const daysInNumbers = new Date(year, month + 1, 0).getDate();
const storedYear = localStorage.getItem("storedYear");
const storedMonth = localStorage.getItem("storedMonth");
const LoadingBarDialog = document.getElementById("LoadingBarDialog");
let namesData = [];
let index;
window.onload = (event) => {

setInterval(checkMonthChange, 20345);

loadDate()

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

function checkMonthChange() {
  const newMonth = new Date().getMonth();
  if (newMonth !== month) {
    window.location = window.location
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
        // localStorage.removeItem(key);
      };
    }
    // let jsonData = JSON.parse(localStorage.getItem("jsonData"));
    // localStorage.removeItem("namesData")
    //   lssave(jsonData); 
  }

  localStorage.setItem("storedYear", year);
  localStorage.setItem("storedMonth", month);

  if (localStorage.getItem("namesData") == null || localStorage.getItem("namesData") == "undefined" || localStorage.getItem("namesData").length === 0) {
    document.getElementById("column").innerHTML += "<h1>Inga namn hittades</h1><h2>Klicka på redigera</h2>"
      LoadingBarDialog.close();
  } else {

    if (storedMonth != null && (storedYear != year || storedMonth != month)) {
      localStorage.setItem("namesDataOld", localStorage.getItem("namesData"));
    }

    namesData = JSON.parse(localStorage.getItem("namesData"));
      setTimeout(() => {
    document.getElementById("column").innerHTML = "";
      main(namesData);
  }, 1000);
    namesData.forEach(displayEditNameArry);
  }

  if (localStorage.getItem("titelData") == null) {
    localStorage.setItem("titelData", "Namnlös");
  }

  document.getElementById("titelDataTitel").innerHTML += localStorage.getItem("titelData");

  document.getElementById("gruppEditContainer").innerHTML =
    '<input type="text" maxlength="50" oninput="checkMaxLength(this)" id="grupp_NameInput" placeholder="Gruppens namn" value="' + localStorage.getItem("titelData") + '" class="gruppEditItem"></input>';

  document.getElementById("titleDate").innerHTML = `${setTitelMonth} ${setTitelYear}`;

  document.title = `Närvaro lista - ${document.getElementById("titleDate").innerText} `;
}




function main(namesData) {
  
  let names = namesData
  window.scrollTo({
  top: 1,
  left: 1,
  behavior: "smooth",
});

  names.sort((a, b) => a.localeCompare(b, 'sv'));

  if (localStorage.getItem("namesData") == null || localStorage.getItem("namesData") == "undefined" || localStorage.getItem("namesData").length === 0) {
    document.getElementById("column").innerHTML += "<h1>Inga namn hittades</h1><h2>Klicka på redigera</h2>"
    LoadingBarDialog.close();
    return;
  }
  LoadingBarDialog.showModal();

  for (let i = 0; i < names.length; i++) {

    document.getElementById('column').innerHTML += '<div class="nameContainer"><p class="name">' + names[i] + '</p></div>';
    const date = new Date();
    for (let j = 1; j <= daysInNumbers; j++) {
         date.setDate(j);
     let dayName = date.toLocaleDateString('sv-SE', { weekday: 'long' });

      const redDay = isRedDay(j);
      const heldagClass = redDay ? 'Row-weekend' : 'Row-Heldag';
      const halvdagClass = redDay ? 'Row-weekend' : 'Row-Halvdag';

      const onclick = redDay ? '' : `onclick="dialog(${j}, '${names[i]}', event)"`;
      let buttonData_Halvdag ="&nbsp;";
      let buttonData_Heldag = "&nbsp;";
if (dayName == "måndag"){
    if (localStorage.getItem("buttonData_" + names[i] + "_Mandag") == null || localStorage.getItem("buttonData_" + names[i] + "_Mandag") == undefined) {
        buttonData_Heldag = "&nbsp;"}
      else {
        if (localStorage.getItem("buttonData_" + names[i] + "_Mandag") == "HE"){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] + "_Mandag");}
      else{
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] + "_Mandag");}
      }

      if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != null){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag");
      }else if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != null){
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag");
      }
}
if (dayName == "tisdag") {
    if (localStorage.getItem("buttonData_" + names[i] + "_Tisdag") == null || localStorage.getItem("buttonData_" + names[i] + "_Tisdag") == undefined) {
        buttonData_Heldag = "&nbsp;"}
      else {
        if (localStorage.getItem("buttonData_" + names[i] + "_Tisdag") == "HE"){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] + "_Tisdag");}
      else{
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] + "_Tisdag");}
      }
      if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != null){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag");
      }else if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != null){
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag");
      }
}
if (dayName == "onsdag") {
    if (localStorage.getItem("buttonData_" + names[i] + "_Onsdag") == null || localStorage.getItem("buttonData_" + names[i] + "_Onsdag") == undefined) {
        buttonData_Heldag = "&nbsp;"}
      else {
        if (localStorage.getItem("buttonData_" + names[i] + "_Onsdag") == "HE"){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] + "_Onsdag");}
      else{
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] + "_Onsdag");}
      }
      if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != null){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag");
      }else if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != null){
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag");
      }
}
if (dayName == "torsdag") {
      if (localStorage.getItem("buttonData_" + names[i] + "_Torsdag") == null || localStorage.getItem("buttonData_" + names[i] + "_Torsdag") == undefined) {
        buttonData_Heldag = "&nbsp;"}
      else {
        if (localStorage.getItem("buttonData_" + names[i] + "_Torsdag") == "HE"){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] + "_Torsdag");}
      else{
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] + "_Torsdag");}
      }
      if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != null){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag");
      }else if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != null){
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag");
      }
}
if (dayName == "fredag") {
    if (localStorage.getItem("buttonData_" + names[i] + "_Fredag") == null || localStorage.getItem("buttonData_" + names[i] + "_Fredag") == undefined) {
        buttonData_Heldag = "&nbsp;"}
      else {
        if (localStorage.getItem("buttonData_" + names[i] + "_Fredag") == "HE"){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] + "_Fredag");}
      else{
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] + "_Fredag");}
      }
      if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag") != null){
        buttonData_Heldag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_heldag");
      }else if (localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != undefined || localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag") != null){
        buttonData_Halvdag = localStorage.getItem("buttonData_" + names[i] +"_" +j+ "_halvdag");
      }
}
      document.getElementById("column").innerHTML +=
        '<div class="Row">' +
        '<div class="' + heldagClass + '">' +
        '<a class="full-width-button" id="' + names[i] + '_' + j + '_heldag"' + onclick + '>' + buttonData_Heldag + '</a>' +
        '</div><br>' +
        '<div class="' + halvdagClass + '">' +
        '<a class="full-width-button" id="' + names[i] + '_' + j + '_halvdag" ' + onclick + '>' + buttonData_Halvdag + '</a>' +
        '</div>' +
        '</div>';
    }

    document.getElementById("column").innerHTML += "<br>";
  }
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

  document.getElementById("dialogH").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "HE"
    localStorage.setItem("buttonData_" + id, "HE");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

    document.getElementById("dialogF").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "HA"
    localStorage.setItem("buttonData_" + id, "HA");
    dialogElement.close();
    id = null
    clickedElement = null
    document.body.style.overflow = "auto";
  });

  document.getElementById("dialogRensa").addEventListener("click", function () {
    document.getElementById(id).innerHTML = "&nbsp;"
    localStorage.setItem("buttonData_" + id, " ");
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

//Dialog boxe Swich Date

function dialogSwichDate() {
  let dialogElement = document.getElementById("dialogSwichDate");

for (let i = 0; i < 12; i++) {

  document.getElementById("dialogSwichDateBox").innerHTML += `
            <button class="dialogButtonSwichDate" id="SwichDate">
            <br>
            [X]
          </button>
  `;
  }

  document.getElementById("dialogName").innerText = name + " - Dag: " + day
  dialogElement.showModal();
  document.body.style.overflow = "hidden";

  document.getElementById("dialogM").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialogX").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialog-").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialogL").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialogS").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialogH").addEventListener("click", function () {
    dialogElement.close();
  });

    document.getElementById("dialogF").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialogRensa").addEventListener("click", function () {
    dialogElement.close();
  });

  document.getElementById("dialogclose").addEventListener("click", function () {
    dialogElement.close();
  });

}


function displayEditNameArry(element, index) {
  document.getElementById("nameEditContainer").innerHTML += `
        <div id="inputContainer_${index}" style="display: flex; align-items: center; justify-content: center; width: max-content; margin-inline: auto; margin-bottom: 10px; padding: 10px; border-radius: 25px; box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;">
          <p class="nameEditItem">${element}</p>
          <button class="editNameInArray material-icons" onclick="createNameEdit(${index}, '${element}')"><i class="material-icons" style="vertical-align:middle; font-size: 2rem;">settings</i></button>
          <button class="removeNameInArray" onclick="removeNameInArray(${index}, '${element}')"><i class="material-icons" style="vertical-align:middle; font-size: 2rem;">delete</i></button>
        </div>`;
}

function removeNameInArray(index, element) {

  if (index != "undefined" && index > -1) {
    if (confirm("Vill du verkligen ta bort " + element + "? \nAll närvaro för " + element + " kommer att försvinna!")) {
      namesData.splice(index, 1);
      document.getElementById("nameEditContainer").innerHTML = "";
      for (var key in localStorage) {
        if (key.startsWith("buttonData_" + element + "_")) {
          localStorage.removeItem(key);
        }
      }
      namesData.forEach(displayEditNameArry);
    }
  }
}

function createName() {
document.getElementById("createNameBox").style.display = "block";
document.getElementById("AddNamesBox").style.display = "none";
document.getElementById("menuTitelEditDialog").textContent= "Lägg till deltagare";
document.getElementById("menuSubTitelEditDialog").textContent= "Välj arbetsdagar";
document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i>Gå tillbaka`;
document.getElementById("MenuButtonDialogEditTopBar").onclick = createNameCancel;
document.getElementById("gruppEditContainer").style.display = "none";
document.getElementById("AddNames").style.display = "none";
document.getElementById("ladda_deltagare_eller").style.display = "none";
document.getElementById("createNameForm").onsubmit = addNameInArray;
 const newNameInput = document.getElementById("newNameInput");
 const Mandag = document.getElementById("Mandag");
 const Tisdag = document.getElementById("Tisdag");
 const Onsdag = document.getElementById("Onsdag");
 const Torsdag = document.getElementById("Torsdag");
 const Fredag = document.getElementById("Fredag");
 newNameInput.value = "";

Mandag.value = "Mandag-heldag";
Tisdag.value = "Tisdag-heldag";
Onsdag.value = "Onsdag-heldag";
Torsdag.value = "Torsdag-heldag";
Fredag.value = "Fredag-halvdag";
}

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("MenuButtonEditDialogAddByFile");

function uploadName() {
    realFileBtn.click();
    realFileBtn.addEventListener("change", function() {
                LoadingBarDialog.showModal();
            let fileReader = new FileReader();
            fileReader.onload = function () {
                let parsedJSON = JSON.parse(fileReader.result);
                lssave(parsedJSON);                 
            }
            fileReader.readAsText(document.querySelector('.file').files[0]);
            
    });
}

function createNameEdit(index,name) {
 const newNameInput = document.getElementById("newNameInput");
newNameInput.value = name;
document.getElementById("createNameBox").style.display = "block";
document.getElementById("AddNamesBox").style.display = "none";
document.getElementById("menuTitelEditDialog").textContent= "Redigera deltagare";
document.getElementById("menuSubTitelEditDialog").textContent= "Välj arbetsdagar";
document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i>Gå tillbaka`;
document.getElementById("MenuButtonDialogEditTopBar").onclick = createNameCancel;
document.getElementById("gruppEditContainer").style.display = "none";
document.getElementById("AddNames").style.display = "none";
document.getElementById("ladda_deltagare_eller").style.display = "none";
document.getElementById("createNameSubmit").value = "Ändra deltagare"
const form = document.getElementById("createNameForm");
const Mandag = document.getElementById("Mandag");
const Tisdag = document.getElementById("Tisdag");
const Onsdag = document.getElementById("Onsdag");
const Torsdag = document.getElementById("Torsdag");
const Fredag = document.getElementById("Fredag");
form.onsubmit = function (event) {
event.preventDefault();
const newNameInput = document.getElementById("newNameInput");
if (newNameInput.value.trim().length === 0) {
alert("Namnet kan inte vara tomt.");
return;
}
editNameInArray(index);
};


  
    if (localStorage.getItem(`buttonData_${name}_Mandag`) === "HE"){
        Mandag.value = "Mandag-heldag";
    }else if (localStorage.getItem(`buttonData_${name}_Mandag`) === "HA"){
        Mandag.value = "Mandag-halvdag";
    }else if (localStorage.getItem(`buttonData_${name}_Mandag`) === "L"){
        Mandag.value = "Mandag-ledig";
    }

    if (localStorage.getItem(`buttonData_${name}_Tisdag`) === "HE"){
      Tisdag.value = "Tisdag-heldag";
    }else if (localStorage.getItem(`buttonData_${name}_Tisdag`) === "HA"){
      Tisdag.value = "Tisdag-halvdag";
    }else if (localStorage.getItem(`buttonData_${name}_Tisdag`) === "L"){
      Tisdag.value = "Tisdag-ledig";
    }

    if (localStorage.getItem(`buttonData_${name}_Onsdag`) === "HE"){
      Onsdag.value = "Onsdag-heldag";
    }else if (localStorage.getItem(`buttonData_${name}_Onsdag`) === "HA"){
      Onsdag.value = "Onsdag-halvdag";
    }else if (localStorage.getItem(`buttonData_${name}_Onsdag`) === "L"){
      Onsdag.value = "Onsdag-ledig";
    }

    if (localStorage.getItem(`buttonData_${name}_Torsdag`) === "HE"){
      Torsdag.value = "Torsdag-heldag";
    }else if (localStorage.getItem(`buttonData_${name}_Torsdag`) === "HA"){
      Torsdag.value = "Torsdag-halvdag";
    }else if (localStorage.getItem(`buttonData_${name}_Torsdag`) === "L"){
      Torsdag.value = "Torsdag-ledig";
    }

    if (localStorage.getItem(`buttonData_${name}_Fredag`) === "HE"){
      Fredag.value = "Fredag-heldag";
    }else if (localStorage.getItem(`buttonData_${name}_Fredag`) === "HA"){
      Fredag.value = "Fredag-halvdag";
    }else if (localStorage.getItem(`buttonData_${name}_Fredag`) === "L"){
      Fredag.value = "Fredag-ledig";
    }

  }




function createNameCancel() {
document.getElementById("createNameBox").style.display = "none";
document.getElementById("AddNamesBox").style.display = "block";
document.getElementById("menuTitelEditDialog").textContent= "Grupp namn";
document.getElementById("menuSubTitelEditDialog").textContent= "Deltagare";
document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i> Spara och gå tillbaka`;
document.getElementById("MenuButtonDialogEditTopBar").onclick = ButtonEditSwishToMain;
document.getElementById("gruppEditContainer").style.display = "block";
document.getElementById("AddNames").style.display = "block";
document.getElementById("ladda_deltagare_eller").style.display = "inline";
}

function addNameInArray() {
   const newNameInput = document.getElementById("newNameInput");
   const Mandag = document.getElementById("Mandag");
   const Tisdag = document.getElementById("Tisdag");
   const Onsdag = document.getElementById("Onsdag");
   const Torsdag = document.getElementById("Torsdag");
   const Fredag = document.getElementById("Fredag");
  const exists = namesData.find(item => item === newNameInput.value) !== undefined;
  if (exists === false) {
    if (newNameInput.value.length === 0) {
      alert("Namnet kan inte vara tomt.");
      return;
    }
    if (newNameInput.value.length > newNameInput.maxLength) {
      alert(`Namnet är för långt, max ${newNameInput.maxLength} tecken.`);
      return;
    }
    let id_name = newNameInput.value;
    createNameCancel();
    namesData.push(newNameInput.value);

    if (Mandag.value === "Mandag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Mandag", "HE");}
      else if (Mandag.value === "Mandag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Mandag", "HA");}
      else if (Mandag.value === "Mandag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Mandag", "L");}

    if (Tisdag.value === "Tisdag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HE");}
      else if (Tisdag.value === "Tisdag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HA");}
      else if (Tisdag.value === "Tisdag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Tisdag", "L");}

      if (Onsdag.value === "Onsdag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HE");}
      else if (Onsdag.value === "Onsdag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HA");}
      else if (Onsdag.value === "Onsdag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Onsdag", "L");}


    if (Torsdag.value === "Torsdag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HE");}
      else if (Torsdag.value === "Torsdag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HA");}
      else if (Torsdag.value === "Torsdag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Torsdag", "L");}


    if (Fredag.value === "Fredag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Fredag", "HE");}
      else if (Fredag.value === "Fredag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Fredag", "HA");}
      else if (Fredag.value === "Fredag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Fredag", "L");}

    document.getElementById("createNameBox").style.display = "none";
    document.getElementById("nameEditContainer").innerHTML = "";
    namesData.forEach(displayEditNameArry);
    newNameInput.value = "";
  }
}

function editNameInArray(index){
const newNameInput = document.getElementById("newNameInput");
const Mandag = document.getElementById("Mandag");
const Tisdag = document.getElementById("Tisdag");
const Onsdag = document.getElementById("Onsdag");
const Torsdag = document.getElementById("Torsdag");
const Fredag = document.getElementById("Fredag");
let strName = newNameInput.value
   for (let i = 1; i <= daysInMonth.length; i++) {

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
 for (let j = 1; j <= daysInNumbers; j++) {
        if (key === "buttonData_" + strName + "_"+j+"_heldag" || key === "buttonData_" + strName + "_"+j+"_halvdag"){
            const value = localStorage.getItem(key);
            localStorage.removeItem(key);
            localStorage.setItem(key, value);
        }
        }
    }
  }

      namesData.splice(index, 1);
      document.getElementById("nameEditContainer").innerHTML = "";
      for (var key in localStorage) {
        if (key.startsWith("buttonData_" + strName + "_Mandag") || key.startsWith("buttonData_" + strName + "_Tisdag") || key.startsWith("buttonData_" + strName + "_Onsdag") || key.startsWith("buttonData_" + strName + "_Torsdag") || key.startsWith("buttonData_" + strName + "_Fredag" )) {
          localStorage.removeItem(key);
        }
      }


const exists = namesData.find(item => item === newNameInput.value) !== undefined;
  if (exists === false) {

    let id_name = newNameInput.value;
    createNameCancel();
    namesData.push(newNameInput.value);

    if (Mandag.value === "Mandag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Mandag", "HE");}
      else if (Mandag.value === "Mandag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Mandag", "HA");}
      else if (Mandag.value === "Mandag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Mandag", "L");}

    if (Tisdag.value === "Tisdag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HE");}
      else if (Tisdag.value === "Tisdag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HA");}
      else if (Tisdag.value === "Tisdag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Tisdag", "L");}

      if (Onsdag.value === "Onsdag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HE");}
      else if (Onsdag.value === "Onsdag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HA");}
      else if (Onsdag.value === "Onsdag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Onsdag", "L");}


    if (Torsdag.value === "Torsdag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HE");}
      else if (Torsdag.value === "Torsdag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HA");}
      else if (Torsdag.value === "Torsdag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Torsdag", "L");}


    if (Fredag.value === "Fredag-heldag"){
            localStorage.setItem("buttonData_" + id_name + "_Fredag", "HE");}
      else if (Fredag.value === "Fredag-halvdag"){
            localStorage.setItem("buttonData_" + id_name + "_Fredag", "HA");}
      else if (Fredag.value === "Fredag-ledig"){
            localStorage.setItem("buttonData_" + id_name + "_Fredag", "L");}

    document.getElementById("createNameBox").style.display = "none";
    document.getElementById("nameEditContainer").innerHTML = "";
    namesData.sort((a, b) => a.localeCompare(b, 'sv'));
    namesData.forEach(displayEditNameArry);
    newNameInput.value = "";


}
}

function dialogEditTopBar() {
document.getElementById("layoutEdit").style.display = "block";
document.getElementById("AddNamesBox").style.display = "block";
document.getElementById("menuTitelEditDialog").textContent= "Grupp namn";
document.getElementById("menuSubTitelEditDialog").textContent= "Deltagare";
document.getElementById("gruppEditContainer").style.display = "block";
document.getElementById("AddNames").style.display = "block";
document.getElementById("ladda_deltagare_eller").style.display = "inline";
document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i> Spara och gå tillbaka`;
document.getElementById("MenuButtonDialogEditTopBar").onclick = ButtonEditSwishToMain;
document.getElementById("MenuButtonDialogPrint").style.display = "none";
document.getElementById("MenuButtonFullScreen").style.display = "none";
document.getElementById("createNameBox").style.display = "none";
document.getElementById("layoutMain").style.display = "none";
window.scrollTo({
  top: 1,
  left: 1,
  behavior: "smooth",
});
}

function ButtonEditSwishToMain() {
    const titelData = document.getElementById("grupp_NameInput").value
      localStorage.setItem("titelData", titelData)
      document.getElementById("titelDataTitel").innerHTML = titelData;
      localStorage.setItem("namesData", JSON.stringify(namesData));
      document.getElementById("layoutMain").style.display = "block";
      document.getElementById("layoutEdit").style.display = "none";
      document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">edit</i> Redigera deltagare`;
      document.getElementById("MenuButtonDialogEditTopBar").onclick = dialogEditTopBar;
      document.getElementById("MenuButtonDialogPrint").style.display = "inline";
      document.getElementById("MenuButtonFullScreen").style.display = "inline";
      window.location = window.location;
  };

function checkMaxLength(input) {
  const maxLength = input.getAttribute("maxlength");
  const currentLength = input.value.length;
  if (currentLength >= maxLength) {
      alert(`Du kan inte ha mer än ${maxLength} tecken.`);
      return;
  }
}


function lssave(jsonData) {

  if (!Array.isArray(jsonData)) {
      LoadingBarDialog.close();
    alert("Felaktigt format: förväntar en lista av objekt.");
    console.error("lssave: invalid jsonData", jsonData);
    return;
  }

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith("buttonData_")) {
      localStorage.removeItem(key);
    }
    if (key && key === "titelData") {
      localStorage.removeItem(key);
    }
  }

  namesData = [];

 jsonData.forEach(item => {

if (!item || typeof item.name_Group === "string") {
      localStorage.setItem("titelData", String(item.name_Group));
      document.getElementById("grupp_NameInput").value = item.name_Group;
      document.getElementById("titelDataTitel").innerHTML = item.name_Group;
}
    if (!item || typeof item.name !== "string") return;

    if (item.name === "name_Group"){
      localStorage.setItem("titelData", String(item.name_Group));
      document.getElementById("grupp_NameInput").value = item.name_Group;
      document.getElementById("titelDataTitel").innerHTML = item.name_Group;
    }else{
    const name = item.name;
    namesData.push(name);

    const arbeteArray = Array.isArray(item.arbetsDagar) ? item.arbetsDagar : [];

    for (let i = 0; i < arbeteArray.length; i++) {
      let val = arbeteArray[i];
      let key = "";
      if (i == 0) {
          key = `buttonData_${name}_Mandag`;
      }else if(i == 1){
          key = `buttonData_${name}_Tisdag`;
      }else if(i == 2){
          key = `buttonData_${name}_Onsdag`;
      }else if(i == 3){
          key = `buttonData_${name}_Torsdag`;
      }else if(i == 4){
          key = `buttonData_${name}_Fredag`;
      }


      if (val === null || val === "" || val === "&nbsp;") {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, String(val));
      }
    }


        const arbeteArrayOveride = Array.isArray(item.arbetsdagArrOveride) ? item.arbetsdagArrOveride : [];
    for (let i = 0; i < arbeteArrayOveride.length; i++) {
      let val = arbeteArrayOveride[i];
      if (val == "null" || val == null || val.length == 0){
        continue;
      }else{
      const [data, value] = val.split(/:(.+)/).filter(Boolean);

      if (value === null || value === "" || value === "&nbsp;") {
        localStorage.removeItem(data);
      } else {
        localStorage.setItem(data, String(value));
      }
      }
    }
    }
  });

  // Persistenta namn och uppdatera UI
  localStorage.setItem("namesData", JSON.stringify(namesData));
   document.getElementById("nameEditContainer").innerHTML = "";
   document.getElementById("column").innerHTML = "";

  if (namesData.length === 0) {
    document.getElementById("column").innerHTML = "<h1>Inga namn hittades</h1><h2>Klicka på redigera</h2>";
    LoadingBarDialog.close();
  } else {
  setTimeout(() => {
    document.getElementById("column").innerHTML = "";
      main(namesData);
  }, 1000);
    namesData.forEach(displayEditNameArry);
  }
}




function getjsoin(){
let names = namesData;
let output = [];
output.push({ name_Group: localStorage.getItem("titelData")});

for (let i = 0; i < names.length; i++) {
    let workDayArr = [];
       let workDayArrOveride = [];
        for (let j = 1; j <= daysInNumbers; j++) {
        if (localStorage.getItem(`buttonData_${names[i]}_${j}_heldag`) != null){
        workDayArrOveride.push(`buttonData_${names[i]}_${j}_heldag:`+localStorage.getItem(`buttonData_${names[i]}_${j}_heldag`));
        }else if (localStorage.getItem(`buttonData_${names[i]}_${j}_halvdag`) != null){
        workDayArrOveride.push(`buttonData_${names[i]}_${j}_halvdag:`+localStorage.getItem(`buttonData_${names[i]}_${j}_halvdag`));
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

saveData(output)
  .then(() => console.log("Data saved to IndexedDB"))
  .catch(err => console.error("IndexedDB error:", err));

// localStorage.setItem("jsonData", JSON.stringify(output));

  const jsonString = JSON.stringify(output, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  let name_Group = document.getElementById("titelDataTitel").innerText || "Namnlös";
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name_Group} (${setTitelMonth} ${setTitelYear}).json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
