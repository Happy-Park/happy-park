const ul = menu.querySelector("ul");
ul.insertAdjacentElement("afterbegin", document.createElement("li")).innerHTML =
  '<button id="back"> <a><img src="../assets/img/back-icon.png" title="Voltar"><p>Voltar</p></a> </button>';

document.getElementById("back").style.cursor = "pointer";
document.getElementById("back").addEventListener("click", () => {
  history.back();
});
