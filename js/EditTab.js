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
  document.getElementById("menuTitelEditDialog").textContent = "Lägg till deltagare";
//  document.getElementById("menuSubTitelEditDialog").textContent = "Välj arbetsdagar";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i>Gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = createNameCancel;
  document.getElementById("gruppEditContainer").style.display = "none";
  document.getElementById("AddNames").style.display = "none";
  document.getElementById("ladda_deltagare_eller").style.display = "none";
  document.getElementById("createNameForm").onsubmit = addNameInArray;
  const newNameInput = document.getElementById("newNameInput");
//  const Mandag = document.getElementById("Mandag");
//  const Tisdag = document.getElementById("Tisdag");
//  const Onsdag = document.getElementById("Onsdag");
//  const Torsdag = document.getElementById("Torsdag");
//  const Fredag = document.getElementById("Fredag");
  newNameInput.value = "";

//  Mandag.value = "Mandag-heldag";
//  Tisdag.value = "Tisdag-heldag";
//  Onsdag.value = "Onsdag-heldag";
//  Torsdag.value = "Torsdag-heldag";
//  Fredag.value = "Fredag-halvdag";
}

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("MenuButtonEditDialogAddByFile");

function uploadName() {
  realFileBtn.accept = ".json";
  realFileBtn.click();
  realFileBtn.addEventListener("change", function () {
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
  });
}

function createNameEdit(index, name) {
  const newNameInput = document.getElementById("newNameInput");
  newNameInput.value = name;
  document.getElementById("createNameBox").style.display = "block";
  document.getElementById("AddNamesBox").style.display = "none";
  document.getElementById("menuTitelEditDialog").textContent = "Redigera deltagare";
//  document.getElementById("menuSubTitelEditDialog").textContent = "Välj arbetsdagar";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i>Gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = createNameCancel;
  document.getElementById("gruppEditContainer").style.display = "none";
  document.getElementById("AddNames").style.display = "none";
  document.getElementById("ladda_deltagare_eller").style.display = "none";
  document.getElementById("createNameSubmit").value = "Ändra deltagare"
  const form = document.getElementById("createNameForm");
//  const Mandag = document.getElementById("Mandag");
//  const Tisdag = document.getElementById("Tisdag");
//  const Onsdag = document.getElementById("Onsdag");
//  const Torsdag = document.getElementById("Torsdag");
//  const Fredag = document.getElementById("Fredag");
  form.onsubmit = function (event) {
    event.preventDefault();
    const newNameInput = document.getElementById("newNameInput");
    if (newNameInput.value.trim().length === 0) {
      alert("Namnet kan inte vara tomt.");
      return;
    }
    editNameInArray(index, name);
  };



//  if (localStorage.getItem(`buttonData_${name}_Mandag`) === "HE") {
//    Mandag.value = "Mandag-heldag";
//  } else if (localStorage.getItem(`buttonData_${name}_Mandag`) === "HA") {
//    Mandag.value = "Mandag-halvdag";
//  } else if (localStorage.getItem(`buttonData_${name}_Mandag`) === "L") {
//    Mandag.value = "Mandag-ledig";
//  }
//
//  if (localStorage.getItem(`buttonData_${name}_Tisdag`) === "HE") {
//    Tisdag.value = "Tisdag-heldag";
//  } else if (localStorage.getItem(`buttonData_${name}_Tisdag`) === "HA") {
//    Tisdag.value = "Tisdag-halvdag";
//  } else if (localStorage.getItem(`buttonData_${name}_Tisdag`) === "L") {
//    Tisdag.value = "Tisdag-ledig";
//  }
//
//  if (localStorage.getItem(`buttonData_${name}_Onsdag`) === "HE") {
//    Onsdag.value = "Onsdag-heldag";
//  } else if (localStorage.getItem(`buttonData_${name}_Onsdag`) === "HA") {
//    Onsdag.value = "Onsdag-halvdag";
//  } else if (localStorage.getItem(`buttonData_${name}_Onsdag`) === "L") {
//    Onsdag.value = "Onsdag-ledig";
//  }
//
//  if (localStorage.getItem(`buttonData_${name}_Torsdag`) === "HE") {
//    Torsdag.value = "Torsdag-heldag";
//  } else if (localStorage.getItem(`buttonData_${name}_Torsdag`) === "HA") {
//    Torsdag.value = "Torsdag-halvdag";
//  } else if (localStorage.getItem(`buttonData_${name}_Torsdag`) === "L") {
//    Torsdag.value = "Torsdag-ledig";
//  }
//
//  if (localStorage.getItem(`buttonData_${name}_Fredag`) === "HE") {
//    Fredag.value = "Fredag-heldag";
//  } else if (localStorage.getItem(`buttonData_${name}_Fredag`) === "HA") {
//    Fredag.value = "Fredag-halvdag";
//  } else if (localStorage.getItem(`buttonData_${name}_Fredag`) === "L") {
//    Fredag.value = "Fredag-ledig";
//  }

}




function createNameCancel() {
  document.getElementById("createNameBox").style.display = "none";
  document.getElementById("AddNamesBox").style.display = "block";
  document.getElementById("menuTitelEditDialog").textContent = "Grupp namn";
  document.getElementById("menuSubTitelEditDialog").textContent = "Deltagare";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i> Spara och gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = ButtonEditSwishToMain;
  document.getElementById("gruppEditContainer").style.display = "block";
  document.getElementById("AddNames").style.display = "block";
  document.getElementById("ladda_deltagare_eller").style.display = "inline";
}

function addNameInArray() {
  const newNameInput = document.getElementById("newNameInput");
//  const Mandag = document.getElementById("Mandag");
//  const Tisdag = document.getElementById("Tisdag");
//  const Onsdag = document.getElementById("Onsdag");
//  const Torsdag = document.getElementById("Torsdag");
//  const Fredag = document.getElementById("Fredag");
const exists = namesData.find(item => item === newNameInput.value.toUpperCase()) !== undefined;
  if (exists === false) {
    if (newNameInput.value.length === 0) {
      alert("Namnet kan inte vara tomt.");
      return;
    }
    if (newNameInput.value.length > newNameInput.maxLength) {
      alert(`Namnet är för långt, max ${newNameInput.maxLength} tecken.`);
      return;
    }
    let id_name = newNameInput.value.toUpperCase();
    createNameCancel();
    namesData.push(id_name);

//    if (Mandag.value === "Mandag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Mandag", "HE");
//    }
//    else if (Mandag.value === "Mandag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Mandag", "HA");
//    }
//    else if (Mandag.value === "Mandag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Mandag", "L");
//    }
//
//    if (Tisdag.value === "Tisdag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HE");
//    }
//    else if (Tisdag.value === "Tisdag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HA");
//    }
//    else if (Tisdag.value === "Tisdag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Tisdag", "L");
//    }
//
//    if (Onsdag.value === "Onsdag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HE");
//    }
//    else if (Onsdag.value === "Onsdag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HA");
//    }
//    else if (Onsdag.value === "Onsdag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Onsdag", "L");
//    }
//
//
//    if (Torsdag.value === "Torsdag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HE");
//    }
//    else if (Torsdag.value === "Torsdag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HA");
//    }
//    else if (Torsdag.value === "Torsdag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Torsdag", "L");
//    }
//
//
//    if (Fredag.value === "Fredag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Fredag", "HE");
//    }
//    else if (Fredag.value === "Fredag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Fredag", "HA");
//    }
//    else if (Fredag.value === "Fredag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Fredag", "L");
//    }

    document.getElementById("createNameBox").style.display = "none";
    document.getElementById("nameEditContainer").innerHTML = "";
    namesData.forEach(displayEditNameArry);
    newNameInput.value = "";
  }
}

function editNameInArray(index, oldName) {
  const newNameInput = document.getElementById("newNameInput");
//  const Mandag = document.getElementById("Mandag");
//  const Tisdag = document.getElementById("Tisdag");
//  const Onsdag = document.getElementById("Onsdag");
//  const Torsdag = document.getElementById("Torsdag");
//  const Fredag = document.getElementById("Fredag");
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

//    if (Mandag.value === "Mandag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Mandag", "HE");
//    }
//    else if (Mandag.value === "Mandag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Mandag", "HA");
//    }
//    else if (Mandag.value === "Mandag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Mandag", "L");
//    }
//
//    if (Tisdag.value === "Tisdag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HE");
//    }
//    else if (Tisdag.value === "Tisdag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Tisdag", "HA");
//    }
//    else if (Tisdag.value === "Tisdag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Tisdag", "L");
//    }
//
//    if (Onsdag.value === "Onsdag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HE");
//    }
//    else if (Onsdag.value === "Onsdag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Onsdag", "HA");
//    }
//    else if (Onsdag.value === "Onsdag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Onsdag", "L");
//    }
//
//
//    if (Torsdag.value === "Torsdag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HE");
//    }
//    else if (Torsdag.value === "Torsdag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Torsdag", "HA");
//    }
//    else if (Torsdag.value === "Torsdag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Torsdag", "L");
//    }
//
//
//    if (Fredag.value === "Fredag-heldag") {
//      localStorage.setItem("buttonData_" + id_name + "_Fredag", "HE");
//    }
//    else if (Fredag.value === "Fredag-halvdag") {
//      localStorage.setItem("buttonData_" + id_name + "_Fredag", "HA");
//    }
//    else if (Fredag.value === "Fredag-ledig") {
//      localStorage.setItem("buttonData_" + id_name + "_Fredag", "L");
//    }

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
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">arrow_back</i> Spara och gå tillbaka`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = ButtonEditSwishToMain;
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
}

function ButtonEditSwishToMain() {
  const titelData = document.getElementById("grupp_NameInput").value
  localStorage.setItem("titelData", titelData);
  document.getElementById("titelDataTitel").innerHTML = titelData;
  localStorage.setItem("namesData", JSON.stringify(namesData));
  document.getElementById("layoutMain").style.display = "block";
  document.getElementById("layoutEdit").style.display = "none";
  document.getElementById("MenuButtonDialogEditTopBar").innerHTML = `<i class="material-icons" style="vertical-align:middle; font-size: 15px;">edit</i> Redigera deltagare`;
  document.getElementById("MenuButtonDialogEditTopBar").onclick = dialogEditTopBar;
  document.getElementById("MenuButtonDialogPrint").style.display = "inline";
  document.getElementById("MenuButtonFullScreen").style.display = "inline";
  document.getElementById("MenuButtonSwichDate").style.display = "inline";
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