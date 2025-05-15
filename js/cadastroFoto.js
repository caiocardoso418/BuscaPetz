document.getElementById("foto").addEventListener("change", async function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("foto", result.caminho);
            alert("Foto enviada com sucesso!");
        } else {
            alert("Erro ao enviar imagem: " + result.erro);
        }
    } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        alert("Erro ao conectar com o servidor.");
    }
});

document.querySelector(".prosseguir").addEventListener("click", () => {
    if (!localStorage.getItem("foto")) {
        alert("Selecione e envie uma foto antes de prosseguir.");
        return;
    }
    window.location.href = "../html/cadastroDetalhes.html";
});
