let paginaAtual = 0;
const petsPorPagina = 3;
let listaPets = [];

let filtros = {
  especie: "",
  cor: "",
  genero: "",
  porte: "",
  bairro: "",
  texto:""
};

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");
  const cadastroLink = document.getElementById("cadastro-link");
  const perfilLink = document.getElementById("perfil-link");
  const logoutLink = document.getElementById("logout-link");
  const btnPerdiPet = document.getElementById("btn-perdi-pet");
  const inputTexto = document.getElementById("filtro-texto");
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  inputTexto.addEventListener("input", () => {
    filtros.texto = inputTexto.value.trim().toLowerCase();
    paginaAtual = 0;
    aplicarFiltros();
  });

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
      aplicarFiltros();
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if ((paginaAtual + 1) * petsPorPagina < listaPetsFiltrada().length) {
      paginaAtual++;
      aplicarFiltros();
    }
  });

  document.getElementById("btn-comentar").addEventListener("click", enviarComentario);

  // Aplica filtros dinamicamente ao mudar os selects
  ["especie", "cor", "genero", "porte", "bairro"].forEach(filtro => {
    const select = document.getElementById("filtro-" + filtro);
    if (select) {
      select.addEventListener("change", () => {
        filtros[filtro] = select.value;
        paginaAtual = 0;
        aplicarFiltros();
      });
    }
  });

  carregarPets();
});

async function carregarPets() {
    try {
        const resposta = await fetch("http://127.0.0.1:5000/publicacoes");
        const dados = await resposta.json();

        // Filtrar apenas Perdidos e Encontrados
        listaPets = dados.filter(pet => {
            const status = pet.status.toLowerCase();
            return status === "perdido" || status === "encontrado";
        });

        aplicarFiltros(); // aplica os filtros visuais
    } catch (error) {
        console.error("Erro ao carregar pets:", error);
    }
}


function aplicarFiltros() {
  const filtrados = listaPetsFiltrada();
  renderizarPets(filtrados);
}

function listaPetsFiltrada() {
  return listaPets.filter(pet => {
    const matchEspecie = filtros.especie === "" || pet.especie === filtros.especie;
    const matchCor = filtros.cor === "" || pet.cor === filtros.cor;
    const matchGenero = filtros.genero === "" || pet.genero === filtros.genero;
    const matchPorte = filtros.porte === "" || pet.porte === filtros.porte;
    const matchBairro = filtros.bairro === "" || (pet.endereco && pet.endereco.includes(filtros.bairro));
    
    const texto = filtros.texto;
    const matchTexto =
      texto === "" ||
      (pet.nome && pet.nome.toLowerCase().includes(texto)) ||
      (pet.raca && pet.raca.toLowerCase().includes(texto));

    return matchEspecie && matchCor && matchGenero && matchPorte && matchBairro && matchTexto;
  });
}


function renderizarPets(petsFiltrados) {
  const container = document.getElementById("pets-container");
  container.innerHTML = "";

  const inicio = paginaAtual * petsPorPagina;
  const fim = inicio + petsPorPagina;
  const petsPagina = petsFiltrados.slice(inicio, fim);

  if (petsPagina.length === 0) {
    container.innerHTML = "<p>Nenhuma publicação encontrada com os filtros selecionados.</p>";
    return;
  }

  petsPagina.forEach(pet => {
    const card = document.createElement("div");
    card.className = "pet-card";

    let statusClass = "perdido";
    if (pet.status.toLowerCase().includes("adoção")) {
      statusClass = "adocao";
    } else if (pet.status.toLowerCase().includes("tutor")) {
      statusClass = "tutor";
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

    // ⭐ Estrela de favorito
    const estrela = document.createElement("span");
    estrela.className = "favorite-icon";
    estrela.innerHTML = "⭐";
    estrela.style.cursor = "pointer";
    estrela.style.fontSize = "22px";
    estrela.style.marginTop = "5px";
    estrela.style.color = "#ffffff"; // branco por padrão

    // Verifica se está favoritado (via localStorage ou consulta futura)
    const id_usuario = localStorage.getItem("id_usuario");

    estrela.onclick = async (e) => {
      e.stopPropagation(); // Não abrir modal ao clicar na estrela

      const res = await fetch("http://127.0.0.1:5000/favoritar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, id_animal: pet.id_animal })
      });

      const result = await res.json();
      estrela.style.color = result.favoritado ? "gold" : "#ffffff";
    };


    card.appendChild(estrela);
    card.addEventListener("click", () => abrirModal(pet));
    container.appendChild(card);
  });
}

function mostrarPerfil() {
  document.getElementById("perfil-email").textContent = localStorage.getItem("usuarioLogado");
  document.getElementById("perfil-nome").textContent = localStorage.getItem("usuarioNome");
  document.getElementById("perfil-box").style.display = "block";
}

function fecharPerfil() {
  document.getElementById("perfil-box").style.display = "none";
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

function logout() {
  localStorage.clear();
  location.reload(); // ou location.reload()
}
