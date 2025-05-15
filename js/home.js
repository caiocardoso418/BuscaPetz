document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const cadastroLink = document.getElementById("cadastro-link");
    const perfilLink = document.getElementById("perfil-link");
    const logoutLink = document.getElementById("logout-link");

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const usuarioNome = localStorage.getItem("usuarioNome");
    const btnPerdiPet = document.getElementById("btn-perdi-pet");
    if (btnPerdiPet) {
        btnPerdiPet.addEventListener("click", () => {
            window.location.href = "../html/cadastroNome.html";
        });
    }


    if (usuarioLogado) {
        // Oculta login/cadastro e mostra perfil/sair
        loginLink.style.display = "none";
        cadastroLink.style.display = "none";
        perfilLink.style.display = "block";
        logoutLink.style.display = "block";

        // Atualiza o nome no menu
        document.getElementById("usuario-nome").textContent = usuarioLogado;
    } else {
        loginLink.style.display = "block";
        cadastroLink.style.display = "block";
        perfilLink.style.display = "none";
        logoutLink.style.display = "none";
    }

    // Clique no botão "Perfil"
    perfilLink.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarPerfil();
    });

    carregarPets(); // carrega pets
});

async function carregarPets() {
    const petsContainer = document.getElementById("pets-container");
    if (!petsContainer) return;

    try {
        const resposta = await fetch("http://127.0.0.1:5000/publicacoes"); // nova rota que você criará
        const pets = await resposta.json();

        petsContainer.innerHTML = ""; // Limpa conteúdo anterior

        pets.forEach(pet => {
            const petCard = document.createElement("div");
            petCard.classList.add("pet-card");

            // Define a classe do status dinamicamente
            const statusClass = pet.status.toLowerCase().includes("adoção")
                ? "adocao"
                : pet.status.toLowerCase().includes("achado")
                ? "achado"
                : "perdido";

            petCard.innerHTML = `
                <div class="status ${statusClass}">${pet.status}</div>
                <img src="${pet.foto}" alt="${pet.nome}" class="pet-imagem">

                <div class="pet-info">
                    <h3>${pet.nome}</h3>
                    <p>${pet.endereco || 'Local não informado'} – ${formatarTempo(pet.data_desaparecimento)}</p>
                </div>
            `;

            petsContainer.appendChild(petCard);
        });
    } catch (error) {
        console.error("Erro ao carregar pets:", error);
    }
}

function formatarTempo(dataStr) {
    const data = new Date(dataStr);
    const agora = new Date();
    const diff = agora - data;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dias > 0) return `${dias} dia(s) atrás`;

    const horas = Math.floor(diff / (1000 * 60 * 60));
    return `${horas} hora(s) atrás`;
}



function mostrarPerfil() {
    const email = localStorage.getItem("usuarioLogado") || "Desconhecido";
    const nome = localStorage.getItem("usuarioNome") || "Não informado";

    document.getElementById("perfil-email").textContent = email;
    document.getElementById("perfil-nome").textContent = nome;
    document.getElementById("perfil-box").style.display = "block";
}

function fecharPerfil() {
    document.getElementById("perfil-box").style.display = "none";
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioNome");
    window.location.reload();
}



