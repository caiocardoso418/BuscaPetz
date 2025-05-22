document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const situacao = document.getElementById("situacao").value;
    const especie = document.getElementById("especie").value;
    const genero = document.getElementById("genero").value;

    if (!situacao || !especie || !genero) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Armazena os dados
    localStorage.setItem("status", situacao);
    localStorage.setItem("especie", especie);
    localStorage.setItem("genero", genero);

    window.location.href = "../html/cadastroFoto.html";
  });
});
