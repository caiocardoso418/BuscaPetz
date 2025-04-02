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

document.addEventListener("DOMContentLoaded", carregarPets);