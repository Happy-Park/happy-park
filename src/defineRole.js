const user = sessionStorage.getItem("user");
const ul = menu.querySelector("ul");
        
if (user === "admin") {    
  ul.insertAdjacentElement('afterbegin' ,document.createElement("li")).innerHTML =
    '<a href="../pages/home_admin.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
} else if (user === "worker") {
  ul.insertAdjacentElement('afterbegin',document.createElement("li")).innerHTML =
  '<a href="../pages/home_admin.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
} else {
  ul.insertAdjacentElement('afterbegin',document.createElement("li")).innerHTML =
  '<a href="../pages/home_admin.html"><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a>';
}
