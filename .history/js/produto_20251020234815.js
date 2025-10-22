// Espera o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    atualizarContadorCarrinho();

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
    criarSeletoresDeCor(produto); 
}

/**
 * Cria os seletores de cor baseados nas variações do produto.
 * @param {object} produto - O objeto completo do produto.
 */
function criarSeletoresDeCor(produto) {
    const secaoPersonalizacao = document.getElementById('secao-personalizacao');
    const opcoesCoresContainer = document.getElementById('opcoes-cores');

    // Mapa para traduzir nomes de cores em códigos hexadecimais
    const mapaDeCores = {
        'Bege': '#F5F5DC',
        'Preto': '#000000',
        'Verde Musgo': '#556B2F',
        'Azul Marinho': '#000080',
        'Terracota': '#E2725B',
        'Palha Natural': '#E3C594',
        'Marrom': '#8B4513'
    };

    if (!produto.variacoes || produto.variacoes.length <= 1) {
        return;
    }

    secaoPersonalizacao.style.display = 'block';
    opcoesCoresContainer.innerHTML = '';

    produto.variacoes.forEach((variacao, index) => {
        const seletor = document.createElement('div');
        seletor.className = 'seletor-cor';
        
        // Pinta o fundo da bolinha com a cor correspondente do mapa
        seletor.style.backgroundColor = mapaDeCores[variacao.cor] || '#FFFFFF';
        
        seletor.dataset.imagem = variacao.imagem;
        seletor.title = variacao.cor; // Adiciona uma dica com o nome da cor

        if (index === 0) {
            seletor.classList.add('active');
        }

        seletor.addEventListener('click', () => {
            document.getElementById('produto-imagem').src = variacao.imagem;
            document.querySelectorAll('.seletor-cor').forEach(el => el.classList.remove('active'));
            seletor.classList.add('active');
        });

        opcoesCoresContainer.appendChild(seletor);
    });
}

// Funções do carrinho
function configurarBotaoCompra(produto) {
    const btnComprar = document.getElementById('btn-comprar');
    if (!btnComprar) return;

    btnComprar.addEventListener('click', function(event) {
        event.preventDefault(); 
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