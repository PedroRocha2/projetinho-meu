import { listaLead } from "./service.JS";

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

const tabela = document.querySelector("#myTable");
const render = async () => {
  try {
    const listaLead = await listaLead();
    listaLead.forEach((elemento) => {
      tabela.appendChild(
        criaNovaLinha(elemento.titulo, elemento.link, elemento.setor)
      );
    });
  } catch (erro) {
    console.log(erro);
  }
};

render();
