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

    document.getElementById("btn-comentar").addEventListener("click", enviarComentario);

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

        let statusClass = "perdido";
        if (pet.status.toLowerCase().includes("adoção")) {
            statusClass = "adocao";
        } else if (pet.status.toLowerCase().includes("achado")) {
            statusClass = "achado";
        } else if (pet.status.toLowerCase().includes("procurando tutor")) {
            statusClass = "procurando";
        }

        card.innerHTML = `
            <div class="status ${statusClass}">${pet.status}</div>
            <img src="${pet.foto}" alt="${pet.nome}" class="pet-imagem">
            <div class="pet-info">
                <h3>${pet.nome}</h3>
                <p>${pet.telefone || "Telefone não informado"}</p>
                <p>${pet.endereco || "Local não informado"}<br>Brasília</p>
            </div>
        `;

        card.addEventListener("click", () => abrirModal(pet));
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

function abrirModal(pet) {
    document.getElementById("modal-publicacao").style.display = "flex";
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
    localStorage.setItem("animal_modal_id", pet.id_animal);
    carregarComentarios(pet.id_animal);
}

function fecharModal() {
    document.getElementById("modal-publicacao").style.display = "none";
}

async function carregarComentarios(id_animal) {
    const res = await fetch(`http://127.0.0.1:5000/comentarios/${id_animal}`);
    const comentarios = await res.json();
    const lista = document.getElementById("lista-comentarios");
    lista.innerHTML = "";

    comentarios.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comentario");
        div.innerHTML = `<strong>${c.nome}</strong><br>${c.texto}<hr>`;
        lista.appendChild(div);
    });
}

async function enviarComentario() {
    const texto = document.getElementById("input-comentario").value;
    const id_usuario = localStorage.getItem("id_usuario");
    const id_animal = localStorage.getItem("animal_modal_id");

    if (!texto.trim()) return;

    const res = await fetch("http://127.0.0.1:5000/comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, id_animal, texto })
    });

    if (res.ok) {
        document.getElementById("input-comentario").value = "";
        carregarComentarios(id_animal);
    }
}
