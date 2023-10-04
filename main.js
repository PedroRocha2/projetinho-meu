import { funcoes } from "./service.JS"
const formulario = document.querySelector('#urlForm')


formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault()
  try {
    const linkRecebido = evento.target.querySelector('[data-url]').value
    await funcoes.pegaURL(linkRecebido)
    
  }
  catch (erro) {
    console.log(erro)
  }
})