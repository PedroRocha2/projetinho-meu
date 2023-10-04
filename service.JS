const listaLead = () =>  {
    
    return fetch(`http://localhost:3000/scrape`)
    .then(resposta => {
        if(resposta.ok){
            return resposta.json()
        }
        throw new Error('Não foi possível listar os leads')
    })
}

const pegaUrl = (Url) => { 
    return fetch(`http://localhost:3000/scrape`, {
        method: 'PUT',
        headers: { 
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            url: Url
        })
    })
    .then( resposta => {
        if(resposta.ok){
            return resposta.body
        }
        throw new Error('Não foi possível criar um cliente')
    })
}
export const funcoes = {listaLead,
     pegaUrl
    }