document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const descricao = document.getElementById("descricao");
  const status = localStorage.getItem("status");

  // Atualiza o placeholder dependendo do tipo de publicação
  if (status && status.toLowerCase().includes("adoção")) {
    descricao.placeholder = "Insira a história do pet e por que ele está para adoção.";
  } else {
    descricao.placeholder = "Insira informações relevantes para ajudar a encontrar o pet.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricaoTexto = descricao.value;

    if (!nome || !descricaoTexto) {
      alert("Preencha todos os campos.");
      return;
    }

    localStorage.setItem("nome", nome);
    localStorage.setItem("descricao", descricaoTexto);

    window.location.href = "../html/cadastroEndereco.html";
  });
});
