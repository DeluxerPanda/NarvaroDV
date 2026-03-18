
const elem = document.getElementById("layoutMain");
function fullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        document.getElementById("MenuButtonExitFullScreen").style.display = "none";
        return;
    }
    document.getElementById("MenuButtonExitFullScreen").style.display = "block";
    elem.requestFullscreen();

}

document.addEventListener("fullscreenchange", (event) => {
    event.preventDefault();
    if (!document.fullscreenElement) {
        document.getElementById("MenuButtonExitFullScreen").style.display = "none";
    }
});

window.addEventListener("beforeunload", (event) => { 
if (document.fullscreenElement) {
  event.preventDefault();
  event.returnValue = '';
  event.return;
  }
})

window.onbeforeunload = (event) => {
if (document.fullscreenElement) {
  event.preventDefault();
  event.returnValue = '';
  event.return;
  }
}
