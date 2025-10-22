// Espera o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    // Atualiza o contador assim que a página carrega
    atualizarContadorCarrinho(); // <-- ADICIONEI ESTA LINHA

    if (produtoId) {
        carregarDetalhesDoProduto(produtoId);
    } else {
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não especificado.</p>';
    }
});

async function carregarDetalhesDoProduto(id) {
    try {
        const response = await fetch('produtos.json');
        const produtos = await response.json();
        const produto = produtos.find(p => p.id == id);

        if (produto) {
            exibirDetalhes(produto);
        } else {
            document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Erro ao carregar informações.</p>';
    }
}

function exibirDetalhes(produto) {
    document.title = produto.nome + " - Ana Souza";
    document.getElementById('produto-imagem').src = produto.imagem;
    document.getElementById('produto-imagem').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = produto.preco;
    const descricao = produto.descricao || "Descrição detalhada deste produto incrível não disponível no momento.";
    document.getElementById('produto-descricao').textContent = descricao;

    configurarBotaoCompra(produto);
}

function configurarBotaoCompra(produto) {
    const btnComprar = document.getElementById('btn-comprar');
    if (!btnComprar) return;

    btnComprar.addEventListener('click', function(event) {
        event.preventDefault(); 
        console.log('Adicionando ao carrinho:', produto);
        adicionarAoCarrinho(produto);
    });
}

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(produto.nome + " foi adicionado ao carrinho!");
    
    atualizarContadorCarrinho();
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