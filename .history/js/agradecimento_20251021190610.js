document.addEventListener('DOMContentLoaded', function() {
    // Pega o pedido que foi salvo temporariamente no sessionStorage
    const ultimoPedido = JSON.parse(sessionStorage.getItem('ultimoPedido')) || [];
    const containerResumo = document.getElementById('resumo-pedido');

    // Sempre chama a função para garantir que o contador do carrinho no header esteja zerado
    atualizarContadorCarrinho();

    if (ultimoPedido.length > 0 && containerResumo) {
        let subtotal = 0;
        let resumoHTML = '<ul class="list-group list-group-flush">'; // Usando listas do Bootstrap para um visual limpo

        // Para cada item no pedido, cria uma linha no resumo
        ultimoPedido.forEach(item => {
            const precoItem = parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) * item.quantidade;
            subtotal += precoItem;

            resumoHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                    <div>
                        ${item.nome} 
                        <small class="text-muted d-block">Cor: ${item.cor} | Qtd: ${item.quantidade}</small>
                    </div>
                    <span>${formatarMoeda(precoItem)}</span>
                </li>
            `;
        });

        // Adiciona a linha do total
        resumoHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center fw-bold mt-3 border-top pt-3">
                <span>TOTAL</span>
                <span>${formatarMoeda(subtotal)}</span>
            </li>
        `;
        resumoHTML += '</ul>';

        // Insere a lista HTML criada dentro do container de resumo
        containerResumo.innerHTML = resumoHTML;
        
    } else if (containerResumo) {
        // Se não encontrar um pedido, mostra uma mensagem
        containerResumo.innerHTML = '<p class="text-muted">Não foi possível recuperar os detalhes do seu último pedido.</p>';
    }
});

// --- Funções Auxiliares (precisamos delas aqui também) ---

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

function atualizarContadorCarrinho() {
    // Esta função vai garantir que o contador no header mostre '0' ou desapareça
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