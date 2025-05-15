// js/cadastroNome.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede envio do formulário

    const especie = document.getElementById("especie").value;
    const genero = document.getElementById("genero").value;

    if (!especie || !genero) {
      alert("Por favor, selecione todas as opções.");
      return;
    }

    // Armazena no localStorage
    localStorage.setItem("situacao", "Perdido");
    localStorage.setItem("especie", especie);
    localStorage.setItem("genero", genero);

    // Redireciona para a próxima etapa
    window.location.href = "../html/cadastroFoto.html";
  });
});
