const fillFields = (client) => {
    document.getElementById("name").value = client.nome;
    document.getElementById("email").value = client.email;
    document.getElementById("phone").value = client.telefone;
    let event = new Event('change')
    document.getElementById("uf").dispatchEvent(event)
    document.getElementById("uf").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("city").value = client.cidade;
    document.getElementById("uf").value = client.uf;
    document.getElementById("cpf").value = client.cpf;
    document.getElementById("birthdate").value = client.nascimento;
    let senha = document.getElementById("password");
    senha.value = client.senha;
    senha.disabled = true;
  };
function close(id){
  db.query(`select * from set_logado(${id})`, (err, res) => {
    if (err) {
      console.log(err);
      e.preventDefault()
    } else {
      e.defaultPrevented = false
      app.quit();
    }
  });
}

module.exports = {fillFields}