document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const raca = document.getElementById("raca").value;
    const cor = document.getElementById("cor").value;
    const porte = document.querySelector("input[name='porte']:checked");

    if (!raca || !cor || !porte) {
      alert("Preencha todos os campos.");
      return;
    }

    localStorage.setItem("raca", raca);
    localStorage.setItem("porte", porte.value);
    localStorage.setItem("cor", cor);

    window.location.href = "../html/cadastroDesc.html";
  });
});
