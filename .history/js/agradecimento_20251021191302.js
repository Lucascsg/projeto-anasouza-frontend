document.addEventListener('DOMContentLoaded', function() {
    const ultimoPedido = JSON.parse(sessionStorage.getItem('ultimoPedido')) || [];
    const containerResumo = document.getElementById('resumo-pedido');

    atualizarContadorCarrinho();

    if (ultimoPedido.length > 0 && containerResumo) {
        let subtotal = 0;
        let resumoHTML = '';

        // Adiciona um título ao resumo do pedido
        resumoHTML += '<h5 class="fw-bold mb-3">Resumo do Pedido:</h5>';

        ultimoPedido.forEach(item => {
            const precoItem = parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) * item.quantidade;
            subtotal += precoItem;

            // --- HTML para cada item do pedido, similar ao layout do carrinho ---
            resumoHTML += `
                <div class="card mb-2 bg-light shadow-sm">
                    <div class="card-body py-2">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h6 class="mb-0">${item.nome}</h6>
                                <small class="text-muted">Cor: ${item.cor} | Qtd: ${item.quantidade}</small>
                            </div>
                            <div class="col-4 text-end">
                                <span class="fw-bold">${formatarMoeda(precoItem)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Adiciona a linha do total no final
        resumoHTML += `
            <div class="card mt-3 section-card">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <span class="fs-5 fw-bold">TOTAL</span>
                    <span class="fs-5 fw-bold">${formatarMoeda(subtotal)}</span>
                </div>
            </div>
        `;

        containerResumo.innerHTML = resumoHTML;
        
        // Opcional: limpa o sessionStorage para que o resumo não apareça se a página for recarregada
        // sessionStorage.removeItem('ultimoPedido');

    } else if (containerResumo) {
        containerResumo.innerHTML = '<p class="text-muted">Não foi possível recuperar os detalhes do seu último pedido.</p>';
    }
});

// --- Funções Auxiliares (completas) ---

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