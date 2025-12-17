
const elem = document.getElementById("layoutMain");
function fullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
     document.getElementById("MenuButtonExitFullScreen").style.display = "none";  
      return;
    }
     document.getElementById("MenuButtonExitFullScreen").style.display = "block";  
    elem.requestFullscreen().catch((err) => {
      console.error(`Error enabling fullscreen: ${err.message}`);
    });

}

document.addEventListener("keydown", (event) => {
  if (event.key === "F11") {
     event.preventDefault();
}});
