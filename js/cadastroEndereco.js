document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const endereco = document.getElementById("endereco").value;

    if (!endereco) {
      alert("Por favor, preencha o endereço.");
      return;
    }

    localStorage.setItem("endereco", endereco);

    window.location.href = "../html/cadastroFinal.html";
  });
});
