// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
    AOS.init(); // Inicia as animações, caso queira usá-las aqui também
});

/**
 * Função principal que carrega os itens do localStorage e os exibe na página.
 */
function carregarCarrinho() {
    // Pega o carrinho do localStorage ou cria um array vazio se não existir
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Encontra os elementos do HTML onde vamos inserir o conteúdo
    const containerItens = document.getElementById('itens-carrinho');
    const subtotalElemento = document.getElementById('subtotal-carrinho');

    // Atualiza o contador na navbar
    atualizarContadorCarrinho();

    // Se o carrinho estiver vazio, a mensagem padrão do HTML será exibida.
    // Se tiver itens, limpamos essa mensagem.
    if (carrinho.length > 0) {
        containerItens.innerHTML = ''; // Limpa a mensagem "Seu carrinho está vazio"
    }

    let subtotal = 0;

    // Passa por cada item no carrinho para criar seu HTML
    carrinho.forEach(item => {
        // Calcula o preço do item (preço unitário * quantidade)
        const precoItem = parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) * item.quantidade;
        subtotal += precoItem;

        // Cria o HTML para a linha do item do carrinho
        const itemHTML = `
            <div class="card mb-3 section-card">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-4">
                            <img src="${item.imagem}" alt="${item.nome}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-4 col-8">
                            <h5 class="mb-0">${item.nome}</h5>
                        </div>
                        <div class="col-md-2 col-4 text-center">
                            <span>Qtd: ${item.quantidade}</span>
                        </div>
                        <div class="col-md-2 col-4 text-center">
                            <span class="fw-bold">${formatarMoeda(precoItem)}</span>
                        </div>
                        <div class="col-md-2 col-4 text-end">
                            <button class="btn btn-sm btn-outline-danger">Remover</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adiciona o HTML do item ao container
        containerItens.innerHTML += itemHTML;
    });

    // Atualiza o subtotal no resumo do pedido
    subtotalElemento.textContent = formatarMoeda(subtotal);
}

/**
 * Formata um número para o formato de moeda brasileira (BRL).
 * @param {number} valor - O número a ser formatado.
 * @returns {string} - O valor formatado como "R$ X,XX".
 */
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

/**
 * Atualiza o número que aparece no ícone do carrinho na navbar.
 * (Função reutilizada dos outros scripts)
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