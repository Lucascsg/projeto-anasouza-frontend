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