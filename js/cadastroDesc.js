document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;

    if (!nome || !descricao) {
      alert("Preencha todos os campos.");
      return;
    }

    localStorage.setItem("nome", nome);
    localStorage.setItem("descricao", descricao);

    window.location.href = "../html/cadastroEndereco.html";
  });
});
