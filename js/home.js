let paginaAtual = 0;
const petsPorPagina = 3;
let listaPets = [];

document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const cadastroLink = document.getElementById("cadastro-link");
    const perfilLink = document.getElementById("perfil-link");
    const logoutLink = document.getElementById("logout-link");
    const btnPerdiPet = document.getElementById("btn-perdi-pet");

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
        loginLink.style.display = "none";
        cadastroLink.style.display = "none";
        perfilLink.style.display = "block";
        logoutLink.style.display = "block";
        document.getElementById("usuario-nome").textContent = usuarioLogado;
    }

    perfilLink.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarPerfil();
    });

    logoutLink.addEventListener("click", logout);

    if (btnPerdiPet) {
        btnPerdiPet.addEventListener("click", () => {
            window.location.href = "../html/cadastroNome.html";
        });
    }

    document.getElementById("prev-btn").addEventListener("click", () => {
        if (paginaAtual > 0) {
            paginaAtual--;
            renderizarPets();
        }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        if ((paginaAtual + 1) * petsPorPagina < listaPets.length) {
            paginaAtual++;
            renderizarPets();
        }
    });

    carregarPets();
});

async function carregarPets() {
    try {
        const resposta = await fetch("http://127.0.0.1:5000/publicacoes");
        listaPets = await resposta.json();
        renderizarPets();
    } catch (error) {
        console.error("Erro ao carregar pets:", error);
    }
}

function renderizarPets() {
    const container = document.getElementById("pets-container");
    container.innerHTML = "";

    const inicio = paginaAtual * petsPorPagina;
    const fim = inicio + petsPorPagina;
    const petsPagina = listaPets.slice(inicio, fim);

    petsPagina.forEach(pet => {
        const card = document.createElement("div");
        card.className = "pet-card";

        const statusClass = pet.status.toLowerCase().includes("adoção")
            ? "adocao"
            : pet.status.toLowerCase().includes("achado")
            ? "achado"
            : "perdido";

        card.innerHTML = `
            <div class="status ${statusClass}">${pet.status}</div>
  <img src="${pet.foto}" alt="${pet.nome}" class="pet-imagem">
  <div class="pet-info">
    <h3>${pet.nome}</h3>
    <p>${pet.telefone || "Telefone não informado"}</p>
    <p>${pet.endereco || "Local não informado"}<br>Brasília</p>
  </div>
`;

        container.appendChild(card);
    });
}

function formatarTempo(dataStr) {
    const data = new Date(dataStr);
    const agora = new Date();
    const diff = agora - data;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dias > 0 ? `${dias} dia(s) atrás` : `${Math.floor(diff / (1000 * 60 * 60))} hora(s) atrás`;
}

function mostrarPerfil() {
    document.getElementById("perfil-email").textContent = localStorage.getItem("usuarioLogado");
    document.getElementById("perfil-nome").textContent = localStorage.getItem("usuarioNome");
    document.getElementById("perfil-box").style.display = "block";
}

function logout() {
    localStorage.clear();
    window.location.reload();
}
