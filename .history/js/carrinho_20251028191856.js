document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('itens-carrinho')) {
        carregarCarrinho();
    }
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
    atualizarContadorCarrinho();
});

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
    
    atualizarContadorCarrinho();

    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p class="text-center text-muted">Seu carrinho está vazio.</p>';
        if(subtotalElemento) subtotalElemento.textContent = formatarMoeda(0);
        configurarEventosCarrinho(); 
        return;
    }

    containerItens.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const precoUnitario = parsePrecoParaNumero(item.preco); 
        
        if (!isNaN(precoUnitario)) { 
             const precoItem = precoUnitario * item.quantidade;
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
             // Mantém o erro no console caso a conversão falhe no futuro
             console.error("Erro ao converter preço para o item:", item); 
           }
    });

    if(subtotalElemento) subtotalElemento.textContent = formatarMoeda(subtotal);
    configurarEventosCarrinho();
}

function configurarEventosCarrinho() {
    // --- Lógica antiga mantida ---
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
    
    // --- LÓGICA DO BOTÃO FINALIZAR COMPRA ATUALIZADA (DO CÓDIGO NOVO) ---
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', async (event) => { // Tornamos async
            event.preventDefault(); 

            // 1. Verifica se está logado
            if (!isUserLoggedIn()) {
                alert("Você precisa fazer login para finalizar a compra."); 
                sessionStorage.setItem('redirectAfterLogin', window.location.href); 
                window.location.href = 'login.html'; 
                return; 
            }

            // 2. Pega o carrinho atual
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            // 3. Envia o carrinho para a API Back-End
            try {
                console.log("Enviando carrinho para API:", carrinho); // Log
                const response = await fetch('http://localhost:8080/api/pedidos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Futuramente: Adicionar token de autenticação aqui
                        // 'Authorization': 'Bearer SEU_TOKEN_JWT' 
                    },
                    body: JSON.stringify(carrinho) // Envia a lista de itens
                });
                console.log("Resposta da API de Pedidos:", response.status); // Log

                if (response.ok) { // Status 201 Created
                    // Pedido criado com sucesso no backend!

                    // 4. Salva no sessionStorage para a pág. agradecimento (opcional, mas útil)
                    sessionStorage.setItem('ultimoPedido', JSON.stringify(carrinho)); 

                    // 5. Limpa o carrinho do localStorage
                    localStorage.removeItem('carrinho');

                    // 6. Redireciona para agradecimento
                    window.location.href = 'agradecimento.html'; 

                } else {
                    // Erro retornado pela API
                    const errorData = await response.json().catch(() => ({}));
                    alert(`Erro ao finalizar pedido: ${errorData.message || response.statusText}`);
                }

            } catch (error) {
                // Erro de rede
                console.error('Erro CRÍTICO ao finalizar pedido:', error);
                alert('Erro de conexão ao finalizar o pedido. Tente novamente mais tarde.');
            }
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

/**
 * Formata um número para o formato de moeda brasileira (BRL).
 * @param {number} valor - O número a ser formatado.
 * @returns {string} - O valor formatado como "R$ X.XXX,XX".
 */
function formatarMoeda(valor) {
    const numero = Number(valor); 
    if (isNaN(numero)) { 
        console.error("Tentativa de formatar valor não numérico:", valor);
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

// A função calcularTotalPedido() foi removida, pois o backend fará esse cálculo agora.