document.addEventListener('DOMContentLoaded', () => {
    // Variáveis globais para guardar os produtos
    let todosOsProdutos = [];
    let produtosFiltrados = [];

    // Elementos do HTML que vamos manipular
    const listaProdutosContainer = document.getElementById('lista-completa-produtos');
    const botoesFiltro = document.querySelectorAll('[data-categoria]');
    const seletorOrdenacao = document.getElementById('ordenar-produtos');

    // Função principal que inicia tudo
    async function iniciar() {
        await carregarProdutos();
        configurarFiltros();
        configurarOrdenacao();
        atualizarContadorCarrinho();
        AOS.init();
    }

    // 1. Busca os produtos do JSON e os armazena
    async function carregarProdutos() {
        try {
            const response = await fetch('produtos.json');
            todosOsProdutos = await response.json();
            produtosFiltrados = [...todosOsProdutos]; // Inicia com a lista completa
            renderizarProdutos(produtosFiltrados);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            listaProdutosContainer.innerHTML = '<p class="text-danger">Erro ao carregar produtos.</p>';
        }
    }

    // 2. Desenha os produtos na tela
    function renderizarProdutos(produtos) {
        listaProdutosContainer.innerHTML = ''; // Limpa a lista antes de desenhar
        if (produtos.length === 0) {
            listaProdutosContainer.innerHTML = '<p class="text-muted">Nenhum produto encontrado.</p>';
            return;
        }

        produtos.forEach(produto => {
            const cardHTML = `
                <div class="col-lg-4 col-md-6" data-aos="fade-up">
                    <div class="card product-card h-100">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text text-muted fw-bold">${produto.preco}</p>
                            <a href="produto.html?id=${produto.id}" class="btn btn-outline-dark">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;
            listaProdutosContainer.innerHTML += cardHTML;
        });
    }

    // 3. Adiciona a funcionalidade aos botões de filtro
    function configurarFiltros() {
        botoesFiltro.forEach(button => {
            button.addEventListener('click', (event) => {
                const categoria = event.target.dataset.categoria;

                // Estilo do botão ativo
                botoesFiltro.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                // Lógica de filtragem
                if (categoria === 'todos') {
                    produtosFiltrados = [...todosOsProdutos];
                } else {
                    produtosFiltrados = todosOsProdutos.filter(produto => produto.categoria === categoria);
                }

                // Redesenha os produtos com a lista filtrada
                renderizarProdutos(produtosFiltrados);
                // Reseta a ordenação para o padrão
                seletorOrdenacao.value = 'padrao';
            });
        });
    }

    // 4. Adiciona a funcionalidade ao seletor de ordenação
    function configurarOrdenacao() {
        seletorOrdenacao.addEventListener('change', (event) => {
            const tipoOrdenacao = event.target.value;
            ordenarProdutos(tipoOrdenacao);
        });
    }

    // Função auxiliar para converter o preço em número (Ex: "R$ 159,90" -> 159.90)
    const parsePreco = (precoStr) => parseFloat(precoStr.replace('R$ ', '').replace(',', '.'));

    // 5. Lógica de Ordenação
    function ordenarProdutos(tipo) {
        switch (tipo) {
            case 'preco-asc':
                produtosFiltrados.sort((a, b) => parsePreco(a.preco) - parsePreco(b.preco));
                break;
            case 'preco-desc':
                produtosFiltrados.sort((a, b) => parsePreco(b.preco) - parsePreco(a.preco));
                break;
            default:
                // Se for 'padrão', precisamos re-filtrar para voltar à ordem original
                const categoriaAtiva = document.querySelector('[data-categoria].active').dataset.categoria;
                 if (categoriaAtiva === 'todos') {
                    produtosFiltrados = [...todosOsProdutos];
                } else {
                    produtosFiltrados = todosOsProdutos.filter(produto => produto.categoria === categoriaAtiva);
                }
                break;
        }
        renderizarProdutos(produtosFiltrados);
    }
    
    // Função para manter o contador do carrinho atualizado
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

    // Inicia todo o processo
    iniciar();
});