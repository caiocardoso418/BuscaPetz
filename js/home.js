document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const cadastroLink = document.getElementById("cadastro-link");
    const perfilLink = document.getElementById("perfil-link");
    const logoutLink = document.getElementById("logout-link");

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const usuarioNome = localStorage.getItem("usuarioNome");

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
        { nome: "Bolinha", tipo: "Cachorro", imagem: "" },
        { nome: "Mimi", tipo: "Gato", imagem: "" },
        { nome: "Pipoca", tipo: "Cachorro", imagem: "" }
    ];

    pets.forEach(pet => {
        const petCard = document.createElement("div");
        petCard.classList.add("pet-card");
        petCard.innerHTML = `
            <img src="${pet.imagem}" alt="${pet.nome}">
            <h3>${pet.nome}</h3>
            <p>${pet.tipo}</p>
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
