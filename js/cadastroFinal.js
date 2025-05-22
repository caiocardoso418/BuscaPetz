document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function finalizarCadastro(event) {
        event.preventDefault();

        const data = document.getElementById("data").value;
        const telefone = document.getElementById("telefone").value;

        // Salvar em localStorage
        localStorage.setItem("data_desaparecimento", data);
        localStorage.setItem("telefone", telefone);

        // Montar objeto com todos os dados salvos
        const anuncio = {
            nome: localStorage.getItem("nome"),
            descricao: localStorage.getItem("descricao"),
            especie: localStorage.getItem("especie"),
            genero: localStorage.getItem("genero"),
            raca: localStorage.getItem("raca"),
            porte: localStorage.getItem("porte"),
            cor: localStorage.getItem("cor"),
            endereco: localStorage.getItem("endereco"),
            data_desaparecimento: localStorage.getItem("data_desaparecimento"),
            telefone: localStorage.getItem("telefone"),
            id_usuario: localStorage.getItem("id_usuario"),
            foto: localStorage.getItem("foto"),
            status: localStorage.getItem("status")
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/anunciar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(anuncio)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Publicação criada com sucesso!");

                // Limpar os dados do anúncio do localStorage
                [
                    "especie", "genero", "raca", "porte", "cor",
                    "nome", "descricao", "endereco", "data_desaparecimento", "telefone"
                ].forEach(item => localStorage.removeItem(item));

                window.location.href = "home.html";
            } else {
                alert("Erro ao cadastrar: " + result.erro);
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
            console.error(error);
        }
    });
});
