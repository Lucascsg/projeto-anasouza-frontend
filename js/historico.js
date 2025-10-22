document.addEventListener('DOMContentLoaded', function() {
    carregarHistorico();
    atualizarContadorCarrinho(); // Garante que o contador do carrinho esteja correto
});

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoPedidos')) || [];
    const containerHistorico = document.getElementById('lista-historico');

    if (historico.length === 0) {
        // A mensagem padrão do HTML será exibida
        return;
    }

    containerHistorico.innerHTML = ''; // Limpa a mensagem padrão

    historico.forEach(pedido => {
        let itensHTML = '<ul class="list-group list-group-flush">';
        pedido.itens.forEach(item => {
            itensHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center bg-light border-0 px-0">
                    <div>
                        ${item.nome} 
                        <small class="text-muted d-block">Cor: ${item.cor} | Qtd: ${item.quantidade}</small>
                    </div>
                    <span>${item.preco}</span>
                </li>
            `;
        });
        itensHTML += '</ul>';

        const pedidoHTML = `
            <div class="card section-card mb-4" data-aos="fade-up">
                <div class="card-header bg-transparent border-bottom-0 pt-3">
                    <h5 class="mb-0">Pedido realizado em: ${pedido.data}</h5>
                </div>
                <div class="card-body">
                    ${itensHTML}
                </div>
                <div class="card-footer bg-transparent border-top-0 pb-3 text-end">
                    <strong>Total: ${formatarMoeda(pedido.total)}</strong>
                </div>
            </div>
        `;
        containerHistorico.innerHTML += pedidoHTML;
    });

    // Inicializa AOS depois de adicionar os cards
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true }); // 'once: true' faz a animação rodar só uma vez
    }
}


// --- Funções Auxiliares ---
function formatarMoeda(valor) {
    // Verifica se o valor já não é um número antes de tentar formatar
    if (typeof valor !== 'number') {
        console.warn("Valor inválido para formatarMoeda:", valor);
        return "R$ --,--"; // Retorna um placeholder ou trata o erro
    }
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