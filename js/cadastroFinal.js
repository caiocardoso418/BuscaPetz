document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function finalizarCadastro(event) {
    event.preventDefault();

    const status = localStorage.getItem("status")?.toLowerCase();
    const telefone = document.getElementById("telefone").value;
    localStorage.setItem("telefone", telefone);

    let data = null;

    if (status !== "para adoção" && status !== "adotado") {
      data = document.getElementById("data").value;
      if (!data) {
        alert("Por favor, insira a data do desaparecimento.");
        return;
      }
      localStorage.setItem("data_desaparecimento", data);
    } else {
      localStorage.removeItem("data_desaparecimento");
    }

    // Montar objeto com os dados
    const anuncio = {
      nome: localStorage.getItem("nome"),
      descricao: localStorage.getItem("descricao"),
      especie: localStorage.getItem("especie"),
      genero: localStorage.getItem("genero"),
      raca: localStorage.getItem("raca"),
      porte: localStorage.getItem("porte"),
      cor: localStorage.getItem("cor"),
      endereco: localStorage.getItem("endereco"),
      telefone: localStorage.getItem("telefone"),
      id_usuario: localStorage.getItem("id_usuario"),
      foto: localStorage.getItem("foto"),
      status: localStorage.getItem("status")
    };

    // Só inclui o campo data_desaparecimento se necessário
    if (data) {
      anuncio.data_desaparecimento = data;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/anunciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anuncio)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Publicação criada com sucesso!");

        [
          "especie", "genero", "raca", "porte", "cor",
          "nome", "descricao", "endereco", "data_desaparecimento", "telefone"
        ].forEach(item => localStorage.removeItem(item));

        if (status === "para adoção" || status === "adotado") {
          window.location.href = "adocao.html";
        } else {
          window.location.href = "home.html";
        }

      } else {
        alert("Erro ao cadastrar: " + result.erro);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
      console.error(error);
    }
  });
});
