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
    
    // --- NOVA FUNÇÃO CHAMADA AQUI ---
    criarSeletoresDeCor(produto); 
}

/**
 * Cria os seletores de cor baseados nas variações do produto.
 * @param {object} produto - O objeto completo do produto.
 */
function criarSeletoresDeCor(produto) {
    const secaoPersonalizacao = document.getElementById('secao-personalizacao');
    const opcoesCoresContainer = document.getElementById('opcoes-cores');

    // 1. Verifica se o produto tem variações e se há mais de uma
    if (!produto.variacoes || produto.variacoes.length <= 1) {
        return; // Se não tiver, não faz nada e a seção continua escondida
    }

    // 2. Se tiver variações, mostra a seção
    secaoPersonalizacao.style.display = 'block';
    opcoesCoresContainer.innerHTML = ''; // Limpa o container

    // 3. Cria uma "bolinha" (seletor) para cada variação
    produto.variacoes.forEach((variacao, index) => {
        const seletor = document.createElement('div');
        seletor.className = 'seletor-cor';
        
        // Usa a imagem da variação como fundo da bolinha
        seletor.style.backgroundImage = `url(${variacao.imagem})`;
        
        // Guarda a informação da imagem que este seletor deve mostrar
        seletor.dataset.imagem = variacao.imagem;

        // Marca a primeira cor como ativa
        if (index === 0) {
            seletor.classList.add('active');
        }

        // 4. Adiciona o evento de clique
        seletor.addEventListener('click', () => {
            // Troca a imagem principal do produto
            document.getElementById('produto-imagem').src = variacao.imagem;

            // Atualiza a classe 'active' para o seletor clicado
            // Primeiro, remove de todos
            document.querySelectorAll('.seletor-cor').forEach(el => el.classList.remove('active'));
            // Depois, adiciona apenas no que foi clicado
            seletor.classList.add('active');
        });

        // Adiciona a bolinha criada na página
        opcoesCoresContainer.appendChild(seletor);
    });
}


// --- O RESTO DO CÓDIGO PERMANECE IGUAL ---

function configurarBotaoCompra(produto) {
    // ... código existente ...
}

function adicionarAoCarrinho(produto) {
    // ... código existente ...
}

function atualizarContadorCarrinho() {
    // ... código existente ...
}