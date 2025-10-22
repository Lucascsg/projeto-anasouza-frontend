// Espera o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Pega os parâmetros da URL (ex: ?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id'); // Pega o valor do parâmetro 'id'

    // Se um ID de produto foi encontrado na URL, carrega os detalhes
    if (produtoId) {
        carregarDetalhesDoProduto(produtoId);
    } else {
        // Se não houver ID, mostra uma mensagem de erro
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não especificado.</p>';
    }
});

/**
 * Busca todos os produtos do JSON, encontra o produto específico pelo ID
 * e chama a função para exibi-lo na tela.
 * @param {string} id - O ID do produto a ser carregado.
 */
async function carregarDetalhesDoProduto(id) {
    try {
        const response = await fetch('produtos.json');
        const produtos = await response.json();
        
        // Encontra o produto no array cujo ID corresponde ao ID da URL
        // Usamos '==' em vez de '===' para comparar string com número sem problemas
        const produto = produtos.find(p => p.id == id);

        if (produto) {
            // Se o produto foi encontrado, exibe seus detalhes na página
            exibirDetalhes(produto);
        } else {
            // Se nenhum produto com aquele ID foi encontrado
            document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Erro ao carregar informações.</p>';
    }
}

/**
 * Preenche o HTML da página com os detalhes de um produto específico.
 * @param {object} produto - O objeto do produto contendo nome, preço, imagem, etc.
 */
function exibirDetalhes(produto) {
    // Altera o título da aba do navegador
    document.title = produto.nome + " - Ana Souza";

    // Preenche os elementos HTML com os dados do produto
    document.getElementById('produto-imagem').src = produto.imagem;
    document.getElementById('produto-imagem').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = produto.preco;
    
    // Para a descrição, podemos adicionar um texto padrão se não houver um no JSON
    const descricao = produto.descricao || "Descrição detalhada deste produto incrível não disponível no momento.";
    document.getElementById('produto-descricao').textContent = descricao;
}

/**
 * Adiciona a funcionalidade de "Adicionar ao Carrinho" ao botão de compra.
 * @param {object} produto - O objeto do produto a ser adicionado.
 */
function configurarBotaoCompra(produto) {
    const btnComprar = document.getElementById('btn-comprar');

    // Se o botão não existir, não faz nada
    if (!btnComprar) return;

    // Adiciona um "ouvinte" de evento de clique ao botão
    btnComprar.addEventListener('click', function(event) {
        // Previne o comportamento padrão do link (que é recarregar a página)
        event.preventDefault(); 

        console.log('Adicionando ao carrinho:', produto);
        adicionarAoCarrinho(produto);
    });
}

/**
 * Lida com a lógica de adicionar um item ao carrinho no localStorage.
 * @param {object} produto - O objeto do produto a ser adicionado.
 */
function adicionarAoCarrinho(produto) {
    // 1. Pega o carrinho atual do localStorage. Se não existir, cria um array vazio.
    // JSON.parse() converte o texto do localStorage de volta para um objeto/array.
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // 2. Verifica se o produto já existe no carrinho
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        // Se já existe, apenas aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Se não existe, adiciona o produto ao carrinho com quantidade 1
        carrinho.push({ ...produto, quantidade: 1 });
    }

    // 3. Salva o carrinho atualizado de volta no localStorage.
    // JSON.stringify() converte nosso array de volta para texto para poder ser salvo.
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // 4. (Opcional) Dá um feedback visual ao usuário
    alert(produto.nome + " foi adicionado ao carrinho!");
    
    // Atualiza a contagem de itens no ícone do carrinho na navbar
    atualizarContadorCarrinho();
}

/**
 * Atualiza o número que aparece no ícone do carrinho na navbar.
 */
function atualizarContadorCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

    // Encontra o elemento do contador (que vamos criar no próximo passo)
    const contadorElemento = document.getElementById('contador-carrinho');
    if (contadorElemento) {
        if (totalItens > 0) {
            contadorElemento.textContent = totalItens;
            contadorElemento.style.display = 'inline'; // Mostra o contador
        } else {
            contadorElemento.style.display = 'none'; // Esconde se o carrinho estiver vazio
        }
    }
}


// --- ATUALIZAÇÃO FINAL ---
// Precisamos chamar a nova função quando os detalhes do produto forem exibidos.
// Encontre a função exibirDetalhes e adicione a chamada no final dela.

function exibirDetalhes(produto) {
    // ... (todo o código que já existe para preencher nome, preço, etc.)

    document.title = produto.nome + " - Ana Souza";
    document.getElementById('produto-imagem').src = produto.imagem;
    document.getElementById('produto-imagem').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = produto.preco;
    const descricao = produto.descricao || "Descrição detalhada deste produto incrível não disponível no momento.";
    document.getElementById('produto-descricao').textContent = descricao;

    // ** ADICIONE ESTA LINHA NO FINAL DA FUNÇÃO **
    configurarBotaoCompra(produto);
}