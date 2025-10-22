// Espera o documento HTML ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    AOS.init(); // <-- ADICIONE ESTA LINHA PARA INICIAR A BIBLIOTECA
});

// (O resto do seu código de carregarProdutos continua aqui embaixo...)
async function carregarProdutos() {
    // ...
}
// Função principal para carregar e exibir os produtos
async function carregarProdutos() {
    // Encontra o container no HTML onde os produtos serão inseridos
    const listaDeProdutos = document.getElementById('lista-produtos');

    try {
        // Usa a API fetch para buscar o arquivo JSON. 'await' pausa a execução até que o arquivo seja baixado.
        const response = await fetch('produtos.json');
        
        // Converte a resposta em formato JSON. 'await' pausa até que a conversão seja concluída.
        const produtos = await response.json();

        // Passa por cada produto no array de produtos
        produtos.forEach(produto => {
            // Cria o HTML para o card do produto usando template literals (crases ``)
            // Isso permite inserir variáveis diretamente no texto com ${...}
            const cardHTML = `
                <div class="col-lg-4 col-md-6">
                    <div class="card product-card h-100">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text text-muted fw-bold">${produto.preco}</p>
                            <a href="#" class="btn btn-outline-dark">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;

            // Adiciona o HTML do card recém-criado ao container no nosso site
            listaDeProdutos.innerHTML += cardHTML;
        });

    } catch (error) {
        // Se houver algum erro ao buscar o arquivo, exibe uma mensagem no console
        console.error('Erro ao carregar os produtos:', error);
        listaDeProdutos.innerHTML = '<p>Não foi possível carregar os produtos no momento.</p>';
    }
}