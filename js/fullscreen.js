function fullScreen() {
     const elem = document.getElementById("layoutMain");

     if (elem.requestFullscreen) {
          elem.requestFullscreen();
     } else if (elem.mozRequestFullScreen) { // Firefox
          elem.mozRequestFullScreen();
     } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
          elem.webkitRequestFullscreen();
     } else if (elem.msRequestFullscreen) { // IE/Edge
          elem.msRequestFullscreen();
     }
}

const bodyElement = document.querySelector("html");

bodyElement.addEventListener('keydown', (event) => {
     if (event.key === 'F11') {
          event.preventDefault();
     }
});
