function displayEditNameArry(element, index) {
let escapedElement = EscapeString(element);
  document.getElementById("nameEditContainer").innerHTML += `
    <div id="inputContainer_${index}" style="display: flex; align-items: center; justify-content: center; width: max-content; margin-inline: auto; margin-bottom: 10px; padding: 10px; border-radius: 25px; box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;">
      <p class="nameEditItem">${element}</p>
      <button class="editNameInArray material-icons"
        onclick="createNameEdit(${index}, '${escapedElement}')">
        <i class="material-icons" style="vertical-align:middle; font-size: 2rem;">settings</i>
      </button>
      <button class="removeNameInArray"
        onclick="removeNameInArray(${index}, '${escapedElement}')">
        <i class="material-icons" style="vertical-align:middle; font-size: 2rem;">delete</i>
      </button>
    </div>`;
}

function removeNameInArray(index, element) {
let escapedElement = EscapeString(element);
  if (index != "undefined" && index > -1) {
    if (confirm("Vill du verkligen ta bort " + element + "? \nAll närvaro för " + element + " kommer att försvinna!")) {
      namesData.splice(index, 1);
      document.getElementById("nameEditContainer").innerHTML = "";
      for (var key in localStorage) {
        if (key.startsWith("buttonData_" + escapedElement + "_")) {
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
  document.getElementById("menuTitelEditDialog").textContent = "Lägg till deltagare";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i>Gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = createNameCancel;
  document.getElementById("MenuButtonDialogSaveAsJson").style.display = "none";
  document.getElementById("gruppEditContainer").style.display = "none";
  document.getElementById("AddNames").style.display = "none";
  document.getElementById("ladda_deltagare_eller").style.display = "none";
  document.getElementById("createNameForm").onsubmit = addNameInArray;
  const newNameInput = document.getElementById("newNameInput");
  newNameInput.value = "";
}

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("MenuButtonEditDialogAddByFile");

customBtn.addEventListener("click", uploadName);
realFileBtn.addEventListener("change", uploadHandler);

function uploadName() {
  realFileBtn.accept = ".json";
  realFileBtn.click();
};
function uploadHandler() {
    const file = document.querySelector('.file').files[0];
    if (!file || file.type !== 'application/json') {
      alert('Only JSON files are allowed.');
      LoadingBarDialog.close();
      return;
    }
    LoadingBarDialog.showModal();
    let fileReader = new FileReader();
    fileReader.onload = function () {
      try {
      let parsedJSON = JSON.parse(fileReader.result);
      isTemp = false;
      lssave(parsedJSON,null,null);
    } catch (error) {
      alert("Fel vid parsning av JSON. Se console för mer info.");
      console.error("Fel vid parsning av JSON:", error);
    }
    }
    fileReader.readAsText(file);
  };

function createNameEdit(index, name) {
  const newNameInput = document.getElementById("newNameInput");
  newNameInput.value = name;
  document.getElementById("createNameBox").style.display = "block";
  document.getElementById("AddNamesBox").style.display = "none";
  document.getElementById("menuTitelEditDialog").textContent = "Redigera deltagare";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i>Gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = createNameCancel;
  document.getElementById("MenuButtonDialogSaveAsJson").style.display = "none";
  document.getElementById("gruppEditContainer").style.display = "none";
  document.getElementById("AddNames").style.display = "none";
  document.getElementById("ladda_deltagare_eller").style.display = "none";
  document.getElementById("createNameSubmit").value = "Ändra deltagare"
  const form = document.getElementById("createNameForm");
  form.onsubmit = function (event) {
    event.preventDefault();
    const newNameInput = document.getElementById("newNameInput");
      if (newNameInput.value.trim().length === 0) {
      alert("Namnet kan inte vara tomt.");
      return;
    }else if (newNameInput.value.length > newNameInput.maxLength) {
      alert(`Namnet är för långt, max ${newNameInput.maxLength} tecken.`);
      return;
    }
  
    editNameInArray(index, name);
  };
}




function createNameCancel() {
  document.getElementById("createNameBox").style.display = "none";
  document.getElementById("AddNamesBox").style.display = "block";
  document.getElementById("menuTitelEditDialog").textContent = "Grupp namn";
  document.getElementById("menuSubTitelEditDialog").textContent = "Deltagare";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i> Spara och gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = ButtonEditSwishToMain;
  document.getElementById("MenuButtonDialogSaveAsJson").style.display = "inline";
  document.getElementById("gruppEditContainer").style.display = "block";
  document.getElementById("AddNames").style.display = "block";
  document.getElementById("ladda_deltagare_eller").style.display = "inline";
}

function addNameInArray() {
  const newNameInput = document.getElementById("newNameInput");
const exists = namesData.find(item => item === newNameInput.value) !== undefined;
  if (exists === false) {
      if (newNameInput.value.trim().length === 0) {
      alert("Namnet kan inte vara tomt.");
      return;
    }else if (newNameInput.value.length > newNameInput.maxLength) {
      alert(`Namnet är för långt, max ${newNameInput.maxLength} tecken.`);
      return;
    }
    
    let id_name = newNameInput.value.toUpperCase();
    createNameCancel();
    namesData.push(id_name);

    document.getElementById("createNameBox").style.display = "none";
    document.getElementById("nameEditContainer").innerHTML = "";
    namesData.forEach(displayEditNameArry);
    newNameInput.value = "";
  }else {
    alert("Namnet finns redan.");
    return;
  }
}

function editNameInArray(index, oldName) {
  const newNameInput = document.getElementById("newNameInput");
  let strName = newNameInput.value;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      for (let j = 1; j <= 32; j++) {
        if (key === "buttonData_" + oldName + "_" + j + "_heldag")
        {
          const value = localStorage.getItem(key);
          localStorage.removeItem(key);
          localStorage.setItem("buttonData_" + strName + "_" + j + "_heldag", value);
        }else if (key === "buttonData_" + oldName + "_" + j + "_halvdag")
        {
          const value = localStorage.getItem(key);
          localStorage.removeItem(key);
          localStorage.setItem("buttonData_" + strName + "_" + j + "_halvdag", value);
        }
      }
  }

  namesData.splice(index, 1);
  document.getElementById("nameEditContainer").innerHTML = "";
  for (var key in localStorage) {
    if (key.startsWith("buttonData_" + strName + "_Mandag") || key.startsWith("buttonData_" + strName + "_Tisdag") || key.startsWith("buttonData_" + strName + "_Onsdag") || key.startsWith("buttonData_" + strName + "_Torsdag") || key.startsWith("buttonData_" + strName + "_Fredag")) {
      localStorage.removeItem(key);
    }
  }


  const exists = namesData.find(item => item === newNameInput.value.toUpperCase()) !== undefined;
  if (exists === false) {
    createNameCancel();
    namesData.push(newNameInput.value.toUpperCase());
    
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
  document.getElementById("menuTitelEditDialog").textContent = "Grupp namn";
  document.getElementById("menuSubTitelEditDialog").textContent = "Deltagare";
  document.getElementById("gruppEditContainer").style.display = "block";
  document.getElementById("AddNames").style.display = "block";
  document.getElementById("ladda_deltagare_eller").style.display = "inline";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = '<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i> Spara och gå tillbaka';
  document.getElementById("MenuButtonDialogEditTopBar").onclick = ButtonEditSwishToMain;
  document.getElementById("MenuButtonDialogSaveAsJson").style.display = "inline";
  document.getElementById("MenuButtonDialogPrint").style.display = "none";
  document.getElementById("MenuButtonFullScreen").style.display = "none";
  document.getElementById("MenuButtonSwichDate").style.display = "none";
  document.getElementById("createNameBox").style.display = "none";
  document.getElementById("layoutMain").style.display = "none";
  window.scrollTo({
    top: 1,
    left: 1,
    behavior: "smooth",
  });
  setAutoUpdate(false);
}

function ButtonEditSwishToMain() {
  const titelData = document.getElementById("grupp_NameInput").value
  localStorage.setItem("titelData", titelData);
  document.getElementById("titelDataTitel").innerHTML = titelData;
  localStorage.setItem("namesData", JSON.stringify(namesData));
  document.getElementById("layoutMain").style.display = "block";
  document.getElementById("layoutEdit").style.display = "none";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = '<i class="material-icons" style="vertical-align:middle; font-size: 15px;">edit</i> Redigera deltagare';
  document.getElementById("MenuButtonDialogEditTopBar").onclick = dialogEditTopBar;
  document.getElementById("MenuButtonDialogSaveAsJson").style.display = "none";
  document.getElementById("MenuButtonDialogPrint").style.display = "inline";
  document.getElementById("MenuButtonFullScreen").style.display = "inline";
  document.getElementById("MenuButtonSwichDate").style.display = "inline";
  document.getElementById("nameEditContainer").innerHTML = "";
  setAutoUpdate(true);
  let thisDate = new Date();
  let this_Year = thisDate.getFullYear();
  let this_month = thisDate.getMonth();
  updateUI(this_Year, this_month);
};

function checkMaxLength(input) {
  const maxLength = input.getAttribute("maxlength");
  const currentLength = input.value.length;
  if (currentLength >= maxLength) {
    alert(`Du kan inte ha mer än ${maxLength} tecken.`);
    return;
  }
}