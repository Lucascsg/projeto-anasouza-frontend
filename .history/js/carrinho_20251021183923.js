document.addEventListener('DOMContentLoaded', function() {
    // Só carrega o carrinho se o container de itens existir nesta página
    if (document.getElementById('itens-carrinho')) {
        carregarCarrinho();
    }
    // Inicializa o AOS de qualquer forma, se estiver presente
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
    // E também o contador do carrinho no header (se existir)
    atualizarContadorCarrinho();
});

function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const containerItens = document.getElementById('itens-carrinho');
    const subtotalElemento = document.getElementById('subtotal-carrinho');
    
    atualizarContadorCarrinho();

    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p class="text-center text-muted">Seu carrinho está vazio.</p>';
        subtotalElemento.textContent = formatarMoeda(0);
        configurarEventosCarrinho();
        return;
    }

    containerItens.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const precoItem = parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) * item.quantidade;
        subtotal += precoItem;

        // HTML ATUALIZADO para mostrar a cor e usar o 'variacaoId'
        const itemHTML = `
            <div class="card mb-3 section-card" data-aos="fade-up">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-3">
                            <img src="${item.imagem}" alt="${item.nome}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-3 col-9">
                            <h5 class="mb-0">${item.nome}</h5>
                            <small class="text-muted">Cor: ${item.cor}</small>
                        </div>
                        <div class="col-md-3 col-6 mt-3 mt-md-0">
                            <div class="input-group">
                                <button class="btn btn-outline-secondary btn-diminuir" type="button" data-id="${item.variacaoId}">-</button>
                                <input type="text" class="form-control text-center" value="${item.quantidade}" readonly>
                                <button class="btn btn-outline-secondary btn-aumentar" type="button" data-id="${item.variacaoId}">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 col-3 mt-3 mt-md-0 text-center">
                            <span class="fw-bold">${formatarMoeda(precoItem)}</span>
                        </div>
                        <div class="col-md-2 col-3 mt-3 mt-md-0 text-end">
                            <button class="btn btn-sm btn-outline-danger btn-remover" data-id="${item.variacaoId}">Remover</button>
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

function configurarEventosCarrinho() {
    // A lógica agora usa 'variacaoId' em vez de 'produtoId'
    document.querySelectorAll('.btn-aumentar').forEach(button => {
        button.addEventListener('click', (event) => {
            const variacaoId = event.target.dataset.id;
            atualizarQuantidade(variacaoId, 'aumentar');
        });
    });

    document.querySelectorAll('.btn-diminuir').forEach(button => {
        button.addEventListener('click', (event) => {
            const variacaoId = event.target.dataset.id;
            atualizarQuantidade(variacaoId, 'diminuir');
        });
    });

    document.querySelectorAll('.btn-remover').forEach(button => {
        button.addEventListener('click', (event) => {
            const variacaoId = event.target.dataset.id;
            removerDoCarrinho(variacaoId);
        });
    });
    
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', (event) => {
            event.preventDefault();
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }
            localStorage.removeItem('carrinho');
            window.location.href = 'obrigado.html'; // Corrigido para 'obrigado.html'
        });
    }
}

// ATUALIZADO para usar 'variacaoId'
function atualizarQuantidade(variacaoId, acao) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemIndex = carrinho.findIndex(item => item.variacaoId == variacaoId);

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

// ATUALIZADO para usar 'variacaoId'
function removerDoCarrinho(variacaoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const novoCarrinho = carrinho.filter(item => item.variacaoId != variacaoId);

    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    carregarCarrinho();
}

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