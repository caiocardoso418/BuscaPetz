function validarLogin() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form[action='#']");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            validarLogin();
        });
    }
});