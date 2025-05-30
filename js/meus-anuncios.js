document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("meus-anuncios-container");
  const id_usuario = localStorage.getItem("id_usuario");

  if (!id_usuario) {
    container.innerHTML = "<p>Você precisa estar logado para ver seus anúncios.</p>";
    return;
  }

  fetch(`http://127.0.0.1:5000/publicacoes`)
    .then(res => res.json())
    .then(publicacoes => {
      const meusPets = publicacoes.filter(pet => pet.id_usuario == id_usuario);

      if (meusPets.length === 0) {
        container.innerHTML = "<p>Você ainda não publicou nenhum animal.</p>";
        return;
      }

      meusPets.forEach(pet => {
        const card = document.createElement("div");
        card.className = "pet-card";

        const statusClass = pet.status.toLowerCase().includes("adoção") ? "adocao" :
                            pet.status.toLowerCase().includes("perdido") ? "perdido" :
                            "tutor";

        card.innerHTML = `
          <div class="status ${statusClass}">${pet.status}</div>
          <img src="${pet.foto}" alt="${pet.nome}" class="pet-imagem">
          <div class="pet-info">
            <h3>${pet.nome}</h3>
            <p>${pet.raca || ""}, ${pet.porte || ""}</p>
            <p>${pet.endereco || "Local não informado"}<br>Brasília</p>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar publicações do usuário:", err);
      container.innerHTML = "<p>Erro ao carregar seus anúncios.</p>";
    });
});
