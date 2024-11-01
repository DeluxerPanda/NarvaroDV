function fullScreen() {
     // document.getElementById("layoutMain").requestFullscreen();
     const elem = document.getElementById("layoutMain");

     if (elem.requestFullscreen) {
          elem.requestFullscreen();
     } else if (elem.mozRequestFullScreen) { // Firefox
          elem.mozRequestFullScreen();
     } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
          elem.webkitRequestFullscreen();
     } else if (elem.msRequestFullscreen) { // IE/Edge
          elem.msRequestFullscreen();
     } else {
          console.log("Fullscreen API is not supported.");
     }
}