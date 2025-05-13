document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    especie: localStorage.getItem("especie") || "Cachorro", // ou pegue dos inputs anteriores
    genero: localStorage.getItem("genero") || "Macho",
    raca: localStorage.getItem("raca") || "",
    porte: localStorage.getItem("porte") || "",
    cor: localStorage.getItem("cor") || "",
    foto: localStorage.getItem("foto") || "",
    endereco: document.getElementById("endereco").value,
    data_desaparecimento: document.getElementById("data").value,
    telefone: document.getElementById("telefone").value
  };

  try {
    const response = await fetch("http://localhost:5000/anunciar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const result = await response.json();
    alert(result.message);
    window.location.href = "../html/home.html";
  } catch (err) {
    console.error(err);
    alert("Erro ao enviar os dados.");
  }
});
