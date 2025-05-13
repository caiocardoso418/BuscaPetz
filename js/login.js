function validarLogin() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    alert("Login realizado com sucesso!");
    window.location.href = "home.html";  // Redireciona para a home
}

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();
        alert(dados.mensagem || dados.erro);

        if (resposta.status === 200) {
            localStorage.setItem("usuarioLogado", email);
            localStorage.setItem("usuarioNome", dados.nome);
            localStorage.setItem("id_usuario", dados.id_usuario); // além de nome e email

            window.location.href = "../html/home.html";
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro ao conectar com o servidor.");
    }
});

