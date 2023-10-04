const formulario = document.querySelector("#urlForm");
const tabela = document.querySelector("#myTable");

const criaNovaLinha = (titulo, link, setor) => {
  const linhaNovoCliente = document.createElement("tr");
  const conteudo = `
        <td>${titulo}</td>
        <td>${link}</td>
        <td>${setor}</td>
                      `;
  linhaNovoCliente.innerHTML = conteudo;
  return linhaNovoCliente;
};

const fazRequisicao = async (Url) => {
  const response = await fetch(`http://localhost:3000/scrape`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      url: Url,
    }),
  });

  return response.json();
};

const render = async (leads) => {
  try {
    leads.forEach((elemento) => {
      tabela.appendChild(
        criaNovaLinha(elemento.titulo, elemento.link, elemento.setor)
      );
    });
  } catch (erro) {
    console.log(erro);
  }
};

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try {
    const linkRecebido = evento.target.querySelector("[data-url]").value;
    const leads = await fazRequisicao(linkRecebido);
    render(leads);
  } catch (erro) {
    console.log(erro);
  }
});
