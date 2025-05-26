document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pets-container");
  const loginLink = document.getElementById("login-link");
  const cadastroLink = document.getElementById("cadastro-link");
  const perfilLink = document.getElementById("perfil-link");
  const logoutLink = document.getElementById("logout-link");

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const id_usuario = localStorage.getItem("id_usuario");

  if (usuarioLogado) {
    loginLink.style.display = "none";
    cadastroLink.style.display = "none";
    perfilLink.style.display = "block";
    logoutLink.style.display = "block";
    document.getElementById("usuario-nome").textContent = usuarioLogado;
  }

  logoutLink.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  if (!id_usuario) {
    container.innerHTML = "<p>Você precisa estar logado para ver seus favoritos.</p>";
    return;
  }

  fetch(`http://127.0.0.1:5000/favoritos/${id_usuario}`)
    .then(res => res.json())
    .then(favoritos => {
      if (!Array.isArray(favoritos) || favoritos.length === 0) {
        container.innerHTML = "<p>Nenhum pet favoritado.</p>";
        return;
      }

      container.innerHTML = ""; // limpa antes de renderizar
      favoritos.forEach(pet => {
        const card = document.createElement("div");
        card.className = "pet-card";

        const statusClass = pet.status.toLowerCase().includes("adoção") ? "adocao" : "tutor";

        card.innerHTML = `
          <div class="status ${statusClass}">${pet.status}</div>
          <img src="${pet.foto}" alt="${pet.nome}" class="pet-imagem">
          <div class="pet-info">
            <h3>${pet.nome}</h3>
            <p>${pet.raca}, ${pet.porte}</p>
            <p>${pet.endereco || "Local não informado"}<br>Brasília</p>
          </div>
        `;

        // Estrela de desfavoritar
        const estrela = document.createElement("span");
        estrela.className = "favorite-icon";
        estrela.innerHTML = "⭐";
        estrela.style.cursor = "pointer";
        estrela.style.fontSize = "20px";
        estrela.style.color = "gold";
        estrela.title = "Remover dos favoritos";

        estrela.onclick = async (e) => {
          e.stopPropagation(); // evitar conflito com modal
          const res = await fetch("http://127.0.0.1:5000/favoritar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario, id_animal: pet.id_animal })
          });

          const result = await res.json();
          if (!result.favoritado) {
            card.remove(); // remove da tela
          }
        };

        card.appendChild(estrela);
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar favoritos:", err);
      container.innerHTML = "<p>Erro ao carregar favoritos.</p>";
    });
});
