document.addEventListener('DOMContentLoaded', function() {
    // ... (início do arquivo igual)
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
    // ... (função igual)
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
    // ... (início da função igual)
    document.title = produto.nome + " - Ana Souza";
    document.getElementById('produto-imagem').src = produto.imagem;
    document.getElementById('produto-imagem').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = produto.preco;
    const descricao = produto.descricao || "Descrição detalhada deste produto incrível não disponível no momento.";
    document.getElementById('produto-descricao').textContent = descricao;

    // A lógica de personalização agora retorna a cor selecionada
    let corSelecionada = criarSeletoresDeCor(produto);
    
    // Passamos o produto E a cor selecionada para o botão de compra
    configurarBotaoCompra(produto, corSelecionada);
}

function criarSeletoresDeCor(produto) {
    const secaoPersonalizacao = document.getElementById('secao-personalizacao');
    const opcoesCoresContainer = document.getElementById('opcoes-cores');
    
    // Guarda a variação atualmente selecionada
    let corAtiva = produto.variacoes[0];

    const mapaDeCores = {
        'Bege': '#F5F5DC', 'Preto': '#000000', 'Verde Musgo': '#556B2F',
        'Azul Marinho': '#000080', 'Terracota': '#E2725B', 'Palha Natural': '#E3C594',
        'Marrom': '#8B4513'
    };

    if (!produto.variacoes || produto.variacoes.length <= 1) {
        secaoPersonalizacao.style.display = 'none';
        return corAtiva; // Retorna a única variação
    }

    secaoPersonalizacao.style.display = 'block';
    opcoesCoresContainer.innerHTML = '';

    produto.variacoes.forEach((variacao) => {
        const seletor = document.createElement('div');
        seletor.className = 'seletor-cor';
        seletor.style.backgroundColor = mapaDeCores[variacao.cor] || '#FFFFFF';
        seletor.title = variacao.cor;

        if (variacao.cor === corAtiva.cor) {
            seletor.classList.add('active');
        }

        seletor.addEventListener('click', () => {
            document.getElementById('produto-imagem').src = variacao.imagem;
            document.querySelectorAll('.seletor-cor').forEach(el => el.classList.remove('active'));
            seletor.classList.add('active');
            
            // ATUALIZAÇÃO: Atualiza a cor ativa quando o usuário clica
            corAtiva = variacao;
        });

        opcoesCoresContainer.appendChild(seletor);
    });

    return corAtiva; // Retorna a cor selecionada inicialmente
}

// ** MUDANÇA IMPORTANTE AQUI **
function configurarBotaoCompra(produto, corSelecionada) {
    const btnComprar = document.getElementById('btn-comprar');
    if (!btnComprar) return;

    btnComprar.addEventListener('click', function(event) {
        event.preventDefault();

        // Agora criamos um "item para o carrinho" que inclui a cor
        const itemParaCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            // Criamos um ID único para a variação: ex, "1-Preto"
            variacaoId: `${produto.id}-${corSelecionada.cor}`,
            cor: corSelecionada.cor,
            imagem: corSelecionada.imagem,
        };

        adicionarAoCarrinho(itemParaCarrinho);
    });
}

// ** MUDANÇA IMPORTANTE AQUI **
function adicionarAoCarrinho(item) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Agora procuramos pelo ID da VARIAÇÃO
    const itemExistente = carrinho.find(i => i.variacaoId === item.variacaoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...item, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${item.nome} (Cor: ${item.cor}) foi adicionado ao carrinho!`);
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    // ... (função igual)
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