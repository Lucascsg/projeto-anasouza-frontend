document.addEventListener('DOMContentLoaded', function() {
    // Pega o pedido que foi salvo temporariamente no sessionStorage
    const ultimoPedido = JSON.parse(sessionStorage.getItem('ultimoPedido')) || [];
    const containerResumo = document.getElementById('resumo-pedido');

    if (ultimoPedido.length > 0 && containerResumo) {
        let subtotal = 0;
        let resumoHTML = '<ul class="list-group list-group-flush">';

        ultimoPedido.forEach(item => {
            const precoItem = parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) * item.quantidade;
            subtotal += precoItem;

            resumoHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        ${item.nome} 
                        <small class="text-muted d-block">Cor: ${item.cor} | Qtd: ${item.quantidade}</small>
                    </div>
                    <span>${formatarMoeda(precoItem)}</span>
                </li>
            `;
        });

        resumoHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center fw-bold mt-2">
                <span>Total</span>
                <span>${formatarMoeda(subtotal)}</span>
            </li>
        `;
        resumoHTML += '</ul>';

        containerResumo.innerHTML += resumoHTML;
        
        // Opcional: limpa o sessionStorage para que o resumo não apareça se a página for recarregada
        // sessionStorage.removeItem('ultimoPedido');

    }

    // Chama a função para garantir que o contador do carrinho no header esteja zerado
    atualizarContadorCarrinho();
});

// Funções auxiliares que também precisamos aqui
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

function atualizarContadorCarrinho() {
    // ... (código completo da função, igual ao dos outros arquivos)
}