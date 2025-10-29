// Espera o documento HTML ser completamente carregado antes de executar qualquer script
document.addEventListener('DOMContentLoaded', function() {
    
    // Chama a função para carregar os produtos
    carregarProdutos();

    // Inicia a biblioteca de animações
    AOS.init(); 

    // Atualiza o contador do carrinho assim que a página carrega
    atualizarContadorCarrinho();
});

/**
 * Função assíncrona para buscar os dados dos produtos no arquivo JSON
 * e renderizar os 3 PRIMEIROS na página inicial.
 */
async function carregarProdutos() {
    // Encontra o container no HTML onde os produtos serão inseridos
    const listaDeProdutos = document.getElementById('lista-produtos');

    // Se o container não existir na página, interrompe a função para evitar erros
    if (!listaDeProdutos) return;

    try {
        // Busca o arquivo JSON
        const response = await fetch('http://localhost:8080/api/produtos');
        
        // Converte a resposta em formato JSON
        const produtos = await response.json();

        // --- MUDANÇA PRINCIPAL AQUI ---
        // Pega apenas os 3 primeiros produtos da lista completa
        const produtosLimitados = produtos.slice(0, 3);

        // Agora, o loop passa pela lista LIMITADA de 3 produtos
        produtosLimitados.forEach(produto => {
            // Cria o HTML para o card do produto usando template literals (crases ``)
            const cardHTML = `
                <div class="col-lg-4 col-md-6">
                    <div class="card product-card h-100">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text text-muted fw-bold">${produto.preco}</p>
                            <a href="produto.html?id=${produto.id}" class="btn btn-outline-dark">Ver Detalhes</a>
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
        listaDeProdutos.innerHTML = '<p class="text-danger">Não foi possível carregar os produtos no momento.</p>';
    }
}

/**
 * Atualiza o número que aparece no ícone do carrinho na navbar.
 */
function atualizarContadorCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const contadorElemento = document.getElementById('contador-carrinho');

    if (contadorElemento) {
        if (totalItens > 0) {
            contadorElemento.textContent = totalItens;
            contadorElemento.style.display = 'inline';
        } else {
            contadorElemento.style.display = 'none';
        }
    }
}