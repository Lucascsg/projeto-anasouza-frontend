document.addEventListener('DOMContentLoaded', function() {
    carregarHistorico();
    atualizarContadorCarrinho(); 
    // Inicializa AOS se for usar animações aqui
    // if (typeof AOS !== 'undefined') AOS.init(); 
});

async function carregarHistorico() {
    const containerHistorico = document.getElementById('lista-historico');
    if (!containerHistorico) return;

    // --- CONEXÃO COM O BACK-END ---
    try {
        console.log("Buscando histórico de pedidos na API..."); // Log
        const response = await fetch('http://localhost:8080/api/pedidos/meus-pedidos', {
            method: 'GET',
            headers: {
                // Futuramente: Adicionar token de autenticação aqui
                // 'Authorization': 'Bearer SEU_TOKEN_JWT'
            }
        });
        console.log("Resposta da API de Histórico:", response.status); // Log

        if (!response.ok) {
            // Trata erros da API (ex: 401 Unauthorized se não estiver logado no futuro)
             const errorData = await response.json().catch(() => ({}));
             throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }

        const historico = await response.json(); // Pega a lista de pedidos da API
        console.log("Histórico recebido:", historico); // Log

        if (historico.length === 0) {
            containerHistorico.innerHTML = '<p class="text-center text-muted">Você ainda não realizou nenhum pedido.</p>';
            return;
        }

        containerHistorico.innerHTML = ''; // Limpa a mensagem padrão

        // Itera sobre os pedidos recebidos da API
        historico.forEach(pedido => {
            let itensHTML = '<ul class="list-group list-group-flush">';
            // Itera sobre os itens DENTRO de cada pedido
            pedido.itens.forEach(item => { 
                // Calcula o preço do item individual (precisa converter o preço unitário)
                let precoItemCalculado = 0;
                const precoUnit = parsePrecoParaNumero(item.precoUnitario);
                 if (!isNaN(precoUnit)) {
                    precoItemCalculado = precoUnit * item.quantidade;
                 }

                itensHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light border-0 px-0">
                        <div>
                            ${item.nomeProduto} 
                            <small class="text-muted d-block">Cor: ${item.corProduto} | Qtd: ${item.quantidade}</small>
                        </div>
                        <span>${formatarMoeda(precoItemCalculado)}</span> 
                    </li>
                `;
            });
            itensHTML += '</ul>';

            // Monta o card do pedido
            const pedidoHTML = `
                <div class="card section-card mb-4" data-aos="fade-up">
                    <div class="card-header bg-transparent border-bottom-0 pt-3">
                        <h5 class="mb-0">Pedido realizado em: ${formatarData(pedido.dataPedido)}</h5> 
                    </div>
                    <div class="card-body">
                        ${itensHTML}
                    </div>
                    <div class="card-footer bg-transparent border-top-0 pb-3 text-end">
                        <strong>Total: ${formatarMoeda(pedido.valorTotal)}</strong>
                    </div>
                </div>
            `;
            containerHistorico.innerHTML += pedidoHTML;
        });

        // Inicializa AOS depois de adicionar os cards
        if (typeof AOS !== 'undefined') {
            AOS.init({ once: true }); 
        }

    } catch (error) {
        console.error('Erro ao carregar histórico de pedidos:', error);
        containerHistorico.innerHTML = `<p class="text-danger text-center">Erro ao carregar seu histórico de pedidos. ${error.message || ''}</p>`;
    }
    // --- FIM DA CONEXÃO ---
}

// --- FUNÇÕES AUXILIARES --- 
// (parsePrecoParaNumero, formatarMoeda, atualizarContadorCarrinho precisam estar aqui também)

function parsePrecoParaNumero(precoStr) {
    if (!precoStr || typeof precoStr !== 'string') return NaN;
    const numeroLimpo = precoStr.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(numeroLimpo);
}

function formatarMoeda(valor) {
    const numero = Number(valor); 
    if (isNaN(numero)) { 
        console.error("Tentativa de formatar valor não numérico:", valor);
        return "R$ --,--"; 
    }
    return numero.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

// Formata a data vinda do backend (LocalDateTime)
function formatarData(dataString) {
    try {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dataString; // Retorna a string original se houver erro
    }
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