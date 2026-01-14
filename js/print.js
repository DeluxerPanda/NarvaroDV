function printMain() {
  let printNameContainerNumber = 0
  document.querySelectorAll(".nameContainer").forEach(element => {
    printNameContainerNumber = printNameContainerNumber + 1
    console.log(printNameContainerNumber)
    if (printNameContainerNumber === 18){
      printNameContainerNumber = 0
      element.classList.add("page-brake");
    }
  });
  window.print();
}