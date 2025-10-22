document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('itens-carrinho')) {
        carregarCarrinho();
    }
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
    atualizarContadorCarrinho();
});

// --- FUNÇÃO AUXILIAR CORRIGIDA/ADICIONADA ---
/**
 * Converte uma string de preço no formato "R$ 1.599,90" para um número (1599.90).
 * @param {string} precoStr - A string do preço.
 * @returns {number} - O valor numérico do preço, ou NaN se a conversão falhar.
 */
function parsePrecoParaNumero(precoStr) {
    if (!precoStr || typeof precoStr !== 'string') {
        return NaN;
    }
    const numeroLimpo = precoStr.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(numeroLimpo);
}

function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const containerItens = document.getElementById('itens-carrinho');
    const subtotalElemento = document.getElementById('subtotal-carrinho');
    
    console.log("Carrinho carregado do localStorage:", carrinho); // Log 1: Ver o que foi lido

    atualizarContadorCarrinho();

    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p class="text-center text-muted">Seu carrinho está vazio.</p>';
        if(subtotalElemento) subtotalElemento.textContent = formatarMoeda(0);
        configurarEventosCarrinho(); 
        return;
    }

    containerItens.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach((item, index) => { // Adicionado index para clareza no log
        console.log(`--- Processando item ${index + 1} ---`); // Log 2: Separador
        console.log("Item original do carrinho:", item); // Log 3: Ver o item completo
        console.log("Preço String Original:", item.preco); // Log 4: Preço como veio

        const precoUnitario = parsePrecoParaNumero(item.preco); 
        console.log("Preço Convertido (Número):", precoUnitario); // Log 5: Resultado da conversão
        
        if (!isNaN(precoUnitario)) { 
             const precoItem = precoUnitario * item.quantidade;
             console.log("Quantidade:", item.quantidade); // Log 6: Quantidade
             console.log("Preço Total do Item (Calculado):", precoItem); // Log 7: Resultado do cálculo
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
         } else {
             console.error("ERRO GRAVE: Falha ao converter preço para o item:", item); // Log 8: Erro na conversão
         }
    });

    console.log("--- Fim do processamento ---"); // Log 9: Fim
    console.log("Subtotal Final Calculado:", subtotal); // Log 10: Subtotal final

    if(subtotalElemento) subtotalElemento.textContent = formatarMoeda(subtotal);
    configurarEventosCarrinho();
}

function configurarEventosCarrinho() {
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

            if (!isUserLoggedIn()) {
                alert("Você precisa fazer login para finalizar a compra."); 
                sessionStorage.setItem('redirectAfterLogin', window.location.href); 
                window.location.href = 'login.html'; 
                return; 
            }

            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            let historico = JSON.parse(localStorage.getItem('historicoPedidos')) || [];
            const novoPedido = {
                id: Date.now(), 
                data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                itens: carrinho,
                total: calcularTotalPedido(carrinho) 
            };
            historico.unshift(novoPedido);
            localStorage.setItem('historicoPedidos', JSON.stringify(historico));

            sessionStorage.setItem('ultimoPedido', JSON.stringify(carrinho));
            localStorage.removeItem('carrinho');
            window.location.href = 'agradecimento.html'; 
        });
    }
}

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

function removerDoCarrinho(variacaoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const novoCarrinho = carrinho.filter(item => item.variacaoId != variacaoId);

    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    carregarCarrinho();
}

function formatarMoeda(valor) {
    const numero = parseFloat(String(valor).replace(/[^0-9,-]/g, '').replace(',', '.'));
    if (isNaN(numero)) {
        return "R$ --,--"; 
    }
    return numero.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
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

function isUserLoggedIn() {
    return sessionStorage.getItem('usuarioLogado') !== null;
}

function calcularTotalPedido(itens) {
    return itens.reduce((total, item) => {
        const precoNumero = parsePrecoParaNumero(item.preco); // Usa a nova função aqui também
        if (!isNaN(precoNumero)) {
            total += precoNumero * item.quantidade;
        }
        return total;
    }, 0);
}