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
        // --- ALTERAÇÃO PRINCIPAL AQUI ---
        // Busca diretamente o produto específico na API Back-End usando o ID
        const response = await fetch(`http://localhost:8080/api/produtos/${id}`); 

        // Verifica se a resposta da API foi bem-sucedida (status 200 OK)
        if (!response.ok) {
            // Se a API retornou um erro (ex: 404 Not Found), trata o erro
            if (response.status === 404) {
                 document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não encontrado.</p>';
            } else {
                // Para outros erros HTTP (como 500 Internal Server Error)
                throw new Error(`Erro HTTP ao buscar produto: ${response.status}`); 
            }
            return; // Interrompe a função se o produto não foi encontrado ou houve erro
        }
        
        // Converte a resposta JSON diretamente para o objeto do produto único
        const produto = await response.json(); 

        // Se chegou aqui, o produto foi encontrado e convertido, então exibe
        exibirDetalhes(produto);

    } catch (error) {
        // Captura erros de rede (ex: servidor desligado) ou erros lançados na verificação do status
        console.error('Erro ao carregar detalhes do produto:', error);
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Erro ao carregar informações do produto. Verifique se o servidor Back-End está rodando.</p>';
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

    criarSeletoresDeCor(produto);
    configurarBotaoCompra(produto); 
}

function criarSeletoresDeCor(produto) {
    const secaoPersonalizacao = document.getElementById('secao-personalizacao');
    const opcoesCoresContainer = document.getElementById('opcoes-cores');
    
    const mapaDeCores = {
        'Bege': '#F5F5DC', 'Preto': '#000000', 'Verde Musgo': '#556B2F',
        'Azul Marinho': '#000080', 'Terracota': '#E2725B', 'Palha Natural': '#E3C594',
        'Marrom': '#8B4513'
    };

    if (!produto.variacoes || produto.variacoes.length <= 1) {
        secaoPersonalizacao.style.display = 'none';
        return;
    }

    secaoPersonalizacao.style.display = 'block';
    opcoesCoresContainer.innerHTML = '';

    produto.variacoes.forEach((variacao, index) => {
        const seletor = document.createElement('div');
        seletor.className = 'seletor-cor';
        seletor.style.backgroundColor = mapaDeCores[variacao.cor] || '#FFFFFF';
        seletor.title = variacao.cor;
        seletor.dataset.imagem = variacao.imagem;

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

function configurarBotaoCompra(produto) {
    const btnComprar = document.getElementById('btn-comprar');
    if (!btnComprar) return;

    btnComprar.addEventListener('click', function(event) {
        event.preventDefault();

        const seletorAtivo = document.querySelector('.seletor-cor.active');
        // Se não houver seletor (produto de cor única), usa a primeira variação
        const corSelecionada = seletorAtivo ? seletorAtivo.title : produto.variacoes[0].cor;
        const variacaoSelecionada = produto.variacoes.find(v => v.cor === corSelecionada);
        
        const itemParaCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            variacaoId: `${produto.id}-${variacaoSelecionada.cor}`,
            cor: variacaoSelecionada.cor,
            imagem: variacaoSelecionada.imagem,
        };

        adicionarAoCarrinho(itemParaCarrinho);
    });
}

function adicionarAoCarrinho(item) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // A LÓGICA DE COMPARAÇÃO CORRETA
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