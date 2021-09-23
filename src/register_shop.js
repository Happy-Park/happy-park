const db = require("../src/postgres");
const Cleave = require("cleave.js");
const button = document.getElementById("register-btn");
const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

var cpfCleave = new Cleave("#cnpj", {
  delimiters: [".", ".", "/", "-"],
  blocks: [2, 3, 3, 4, 2],
  numericOnly: true,
});

button.addEventListener("click", function () {
  let name = document.getElementById("name").value;
  let cnpj = document.getElementById("cnpj");
  let categoria = document.getElementById("category");

  cnpj = cnpj.value.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "");

  db.query(
    `select lc.id from lojacateg lc where lc.descricao = '${categoria.value}'`,
    (err, res) => {
      if (err) {
        updateErrorLog(query, err);
        notyf.error("Não foi possível realizar seu cadastro. Verifique os dados!");
      } else {
        let query = `insert into loja values(default, '${cnpj}', '${name}', ${res.rows[0].id})`;
        console.log(query);
        db.query(query, (err, res) => {
          if (err) {
            updateErrorLog(query, err);
            notyf.error("Não foi possível realizar seu cadastro. Verifique os dados!");
          } else {
            notyf.success("Cadastro realizado com sucesso!");
          }
        });
      }
    }
  );
});
