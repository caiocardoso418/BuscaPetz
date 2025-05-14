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

function carregarPets() {
    const petsContainer = document.getElementById("pets-container");
    if (!petsContainer) return;

    const pets = [
        {
            nome: "Angu",
            status: "Perdida",
            imagem: "caminho/para/angu.jpg",
            local: "Pinheiros, São Paulo",
            tempo: "17 horas atrás",
            favorito: true
        },
        {
            nome: "Tiquinho",
            status: "Perdido",
            imagem: "caminho/para/tiquinho.jpg",
            local: "Próximo Hosp. Exército",
            tempo: "2 dias atrás",
            favorito: true
        },
        {
            nome: "Sheise",
            status: "Procurando Tutor",
            imagem: "caminho/para/sheise.jpg",
            local: "Casa, Cidade Ademar",
            tempo: "6 horas atrás",
            favorito: false
        },
        {
            nome: "Spaker",
            status: "Perdido",
            imagem: "caminho/para/spaker.jpg",
            local: "Vila Medeiros, São Paulo",
            tempo: "9 horas atrás",
            favorito: false
        }
    ];

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
            <img src="${pet.imagem}" alt="${pet.nome}">
            <div class="pet-info">
                <h3>${pet.nome} ${pet.favorito ? '<span class="favorite-icon">★</span>' : ''}</h3>
                <p>${pet.local} – ${pet.tempo}</p>
            </div>
        `;

        petsContainer.appendChild(petCard);
    });
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



