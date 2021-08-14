var navbar = document.getElementById("navbar");
let buttons = navbar.querySelectorAll("button");

document.addEventListener(
  "scroll",
  function () {
    var scroll = window.scrollY;
    if (scroll > 0) {
      navbar.style.backgroundColor = "#ffa";
      buttons.forEach((element) => {
        element.style.backgroundColor = "#999";
      });
    } else if (scroll === 0) {
      navbar.style.backgroundColor = "transparent";
      buttons.forEach((element) => {
        element.style.backgroundColor = "transparent";
      });
    }
  },
  { passive: true }
);

buttons.forEach((element) => {
  element.addEventListener("mouseenter", function () {
    element.style.backgroundColor = "rgb(255,0,255)";
  });
  element.addEventListener("mouseleave", function () {
    if (window.scrollY > 0) {
      element.style.backgroundColor = "#999";
    } else {
      element.style.backgroundColor = "transparent";
    }
  });
});
