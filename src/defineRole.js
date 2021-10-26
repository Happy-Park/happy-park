user = JSON.parse(sessionStorage.user);
const ul = menu.querySelector("ul");
const currentPage = location.pathname.split("/").slice(-1)[0];
if (user === "admin") {
  //get current page starting from /pages
  if (currentPage === "home_admin.html") {
    ul.insertAdjacentElement(
      "afterbegin",
      document.createElement("li")
    ).innerHTML =
      '<a href="../pages/login.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
  } else {
    ul.insertAdjacentElement(
      "afterbegin",
      document.createElement("li")
    ).innerHTML =
      '<a href="../pages/home_admin.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
  }
} else {
  if (currentPage === "home.html") {
    ul.insertAdjacentElement(
      "afterbegin",
      document.createElement("li")
    ).innerHTML =
      '<a href="../pages/login.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
  } else {
    ul.insertAdjacentElement(
      "afterbegin",
      document.createElement("li")
    ).innerHTML =
      '<a href="../pages/home_admin.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
  }
}
