function printMain() {
  let printNameContainerNumber = 0
  document.querySelectorAll(".nameContainer").forEach(element => {
    printNameContainerNumber = printNameContainerNumber + 1
    if (printNameContainerNumber === 18) {
      printNameContainerNumber = 0
      element.classList.add("page-brake");
    }
  });
  window.print();
}


function printSelected() {
  let printNameContainerNumber = 0
  document.querySelectorAll(".nameContainer").forEach(element => {
      element.style.display = "none";
  });
  document.querySelectorAll(".nameContainerTemp").forEach(element => {
      printNameContainerNumber = printNameContainerNumber + 1
    if (printNameContainerNumber === 18) {
      printNameContainerNumber = 0
      element.classList.add("page-brake");
    }
  });
  window.print();
  document.querySelectorAll(".nameContainerTemp").forEach(element => {
      element.remove();
  });
}