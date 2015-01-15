function getTime() {
   document.getElementById("clock").innerHTML = new Date();
   setTimeout(getTime, 1000);
}

window.onload = getTime;