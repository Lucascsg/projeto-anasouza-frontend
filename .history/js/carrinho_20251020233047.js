// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
    AOS.init();
});

/**
 * Função principal que carrega os itens do localStorage e os exibe na página.
 */
function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const containerItens = document.getElementById('itens-carrinho');
    const subtotalElemento = document.getElementById('subtotal-carrinho');
    
    atualizarContadorCarrinho();

    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p class="text-center text-muted">Seu carrinho está vazio.</p>';
        subtotalElemento.textContent = formatarMoeda(0);
        // Garante que o botão de finalizar compra também seja "ouvido" mesmo com carrinho vazio
        configurarEventosCarrinho(); 
        return;
    }

    containerItens.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const precoItem = parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) * item.quantidade;
        subtotal += precoItem;

        const itemHTML = `
            <div class="card mb-3 section-card" data-aos="fade-up">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-3">
                            <img src="${item.imagem}" alt="${item.nome}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-3 col-9">
                            <h5 class="mb-0">${item.nome}</h5>
                        </div>
                        <div class="col-md-3 col-6 mt-3 mt-md-0">
                            <div class="input-group">
                                <button class="btn btn-outline-secondary btn-diminuir" type="button" data-id="${item.id}">-</button>
                                <input type="text" class="form-control text-center" value="${item.quantidade}" readonly>
                                <button class="btn btn-outline-secondary btn-aumentar" type="button" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 col-3 mt-3 mt-md-0 text-center">
                            <span class="fw-bold">${formatarMoeda(precoItem)}</span>
                        </div>
                        <div class="col-md-2 col-3 mt-3 mt-md-0 text-end">
                            <button class="btn btn-sm btn-outline-danger btn-remover" data-id="${item.id}">Remover</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        containerItens.innerHTML += itemHTML;
    });

    subtotalElemento.textContent = formatarMoeda(subtotal);
    
    configurarEventosCarrinho();
}

/**
 * Adiciona os eventos de clique para todos os botões da página do carrinho.
 */
function configurarEventosCarrinho() {
    // Botões de Aumentar Quantidade
    document.querySelectorAll('.btn-aumentar').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoId = event.target.dataset.id;
            atualizarQuantidade(produtoId, 'aumentar');
        });
    });

    // Botões de Diminuir Quantidade
    document.querySelectorAll('.btn-diminuir').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoId = event.target.dataset.id;
            atualizarQuantidade(produtoId, 'diminuir');
        });
    });

    // Botões de Remover Item
    document.querySelectorAll('.btn-remover').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoId = event.target.dataset.id;
            removerDoCarrinho(produtoId);
        });
    });

    // --- CÓDIGO ADICIONADO AQUI ---
    // Botão de Finalizar Compra
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Verifica se o carrinho não está vazio antes de finalizar
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            // Limpa o carrinho
            localStorage.removeItem('carrinho');
            
            // Redireciona para a página de agradecimento
            window.location.href = 'agradecimento.html';
        });
    }
}

/**
 * Atualiza a quantidade de um item no carrinho ou o remove.
 */
function atualizarQuantidade(id, acao) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemIndex = carrinho.findIndex(item => item.id == id);

    if (itemIndex > -1) {
        if (acao === 'aumentar') {
            carrinho[itemIndex].quantidade++;
        } else if (acao === 'diminuir') {
            carrinho[itemIndex].quantidade--;
            if (carrinho[itemIndex].quantidade <= 0) {
                carrinho.splice(itemIndex, 1);
            }
        }
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

/**
 * Remove um item completamente do carrinho.
 */
function removerDoCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const novoCarrinho = carrinho.filter(item => item.id != id);

    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    carregarCarrinho();
}

// Funções que já tínhamos
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

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