let paginaAtual = 0;
const petsPorPagina = 3;
let listaAdocao = [];

document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const cadastroLink = document.getElementById("cadastro-link");
    const perfilLink = document.getElementById("perfil-link");
    const logoutLink = document.getElementById("logout-link");

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
        loginLink.style.display = "none";
        cadastroLink.style.display = "none";
        perfilLink.style.display = "block";
        logoutLink.style.display = "block";
        document.getElementById("usuario-nome").textContent = usuarioLogado;
    }

    perfilLink.addEventListener("click", e => {
        e.preventDefault();
        alert("Perfil do usuário logado.");
    });

    logoutLink.addEventListener("click", () => {
        localStorage.clear();
        window.location.reload();
    });

    document.getElementById("prev-btn").addEventListener("click", () => {
        if (paginaAtual > 0) {
            paginaAtual--;
            renderizarPets();
        }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        if ((paginaAtual + 1) * petsPorPagina < listaAdocao.length) {
            paginaAtual++;
            renderizarPets();
        }
    });

    carregarPets();
});

async function carregarPets() {
    try {
        const resposta = await fetch("http://127.0.0.1:5000/publicacoes");
        const dados = await resposta.json();

        listaAdocao = dados.filter(p => {
            const status = p.status.toLowerCase();
            return status === "para adoção" || status === "adotado";
        });

        renderizarPets();
    } catch (err) {
        console.error("Erro ao buscar pets para adoção:", err);
    }
}

function renderizarPets() {
    const container = document.getElementById("pets-container");
    container.innerHTML = "";

    const inicio = paginaAtual * petsPorPagina;
    const fim = inicio + petsPorPagina;
    const pagina = listaAdocao.slice(inicio, fim);

    if (pagina.length === 0) {
        container.innerHTML = "<p>Nenhum pet disponível para adoção no momento.</p>";
        return;
    }

    pagina.forEach(pet => {
        const card = document.createElement("div");
        card.className = "pet-card";

        const statusClass = pet.status.toLowerCase().includes("adotado") ? "adocao" : "tutor";
        const linkWhats = `https://wa.me/${pet.telefone.replace(/\D/g, '')}?text=Olá! Tenho interesse no pet ${pet.nome} para adoção.`;

        card.innerHTML = `
            <div class="status ${statusClass}">${pet.status}</div>
            <img src="${pet.foto}" alt="${pet.nome}" class="pet-imagem">
            <div class="pet-info">
                <h3>${pet.nome}</h3>
                <p>${pet.raca}, ${pet.porte}</p>
                <p>${pet.endereco || "Local não informado"}<br>Brasília</p>
                <a href="${linkWhats}" target="_blank" class="btn">Tenho Interesse</a>
            </div>
        `;

        // Clique para abrir modal
        card.addEventListener("click", () => abrirModal(pet));

        container.appendChild(card);
    });
}

function abrirModal(pet) {
    const modal = document.getElementById("modal-publicacao");
    modal.style.display = "flex";

    document.getElementById("modal-foto").src = pet.foto;
    document.getElementById("modal-nome").textContent = pet.nome;
    document.getElementById("modal-status").textContent = pet.status;
    document.getElementById("modal-especie").textContent = pet.especie;
    document.getElementById("modal-genero").textContent = pet.genero;
    document.getElementById("modal-raca").textContent = pet.raca;
    document.getElementById("modal-cor").textContent = pet.cor;
    document.getElementById("modal-porte").textContent = pet.porte;
    document.getElementById("modal-descricao").textContent = pet.descricao;
    document.getElementById("modal-telefone").textContent = pet.telefone;
    document.getElementById("modal-endereco").textContent = pet.endereco;
    document.getElementById("modal-data").textContent = new Date(pet.data_desaparecimento).toLocaleDateString("pt-BR");
}

function fecharModal() {
    document.getElementById("modal-publicacao").style.display = "none";
}
