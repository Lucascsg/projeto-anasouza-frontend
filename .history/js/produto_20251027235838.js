document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    atualizarContadorCarrinho(); // Atualiza contador ao carregar

    if (produtoId) {
        carregarDetalhesDoProduto(produtoId);
    } else {
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não especificado.</p>';
    }
});

async function carregarDetalhesDoProduto(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/produtos/${id}`); 
        if (!response.ok) {
            if (response.status === 404) {
                 document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Produto não encontrado.</p>';
            } else {
                throw new Error(`Erro HTTP: ${response.status}`); 
            }
            return; 
        }
        const produto = await response.json(); 
        exibirDetalhes(produto); // Chama a função para exibir

    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        document.getElementById('detalhe-produto').innerHTML = '<p class="text-danger">Erro ao carregar informações. Verifique se o servidor Back-End está rodando.</p>';
    }
}

function exibirDetalhes(produto) {
    document.title = produto.nome + " - Ana Souza";
    document.getElementById('produto-imagem').src = produto.imagem; // Assume imagem principal do JSON
    document.getElementById('produto-imagem').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = produto.preco;
    const descricao = produto.descricao || "Descrição detalhada deste produto incrível não disponível no momento.";
    document.getElementById('produto-descricao').textContent = descricao;

    // Garante que ambas as funções sejam chamadas DEPOIS de preencher os detalhes básicos
    criarSeletoresDeCor(produto); 
    configurarBotaoCompra(produto); 
}

function criarSeletoresDeCor(produto) {
    const secaoPersonalizacao = document.getElementById('secao-personalizacao');
    const opcoesCoresContainer = document.getElementById('opcoes-cores');
    
    // Verifica se os containers existem no HTML
    if (!secaoPersonalizacao || !opcoesCoresContainer) {
        console.error("Elementos HTML para personalização não encontrados!");
        return; 
    }

    const mapaDeCores = { // Mapeamento das cores
        'Bege': '#F5F5DC', 'Preto': '#000000', 'Verde Musgo': '#556B2F',
        'Azul Marinho': '#000080', 'Terracota': '#E2725B', 'Palha Natural': '#E3C594',
        'Marrom': '#8B4513'
        // Adicione mais cores se necessário
    };

    // Verifica se o produto tem variações e se há mais de uma
    if (!produto.variacoes || produto.variacoes.length <= 1) {
        secaoPersonalizacao.style.display = 'none'; // Esconde a seção se não houver opções
        return;
    }

    secaoPersonalizacao.style.display = 'block'; // Mostra a seção
    opcoesCoresContainer.innerHTML = ''; // Limpa opções antigas

    produto.variacoes.forEach((variacao, index) => {
        const seletor = document.createElement('div');
        seletor.className = 'seletor-cor';
        seletor.style.backgroundColor = mapaDeCores[variacao.cor] || '#FFFFFF'; // Usa o mapa de cores
        seletor.title = variacao.cor; // Adiciona dica com nome da cor
        // seletor.dataset.imagem = variacao.imagem; // Guarda o link da imagem (mesmo se não for usar para trocar)

        // Marca o primeiro seletor como ativo inicialmente
        if (index === 0) {
            seletor.classList.add('active');
            // Garante que a imagem inicial seja a da primeira variação (caso seja diferente da imagem principal do produto)
            // document.getElementById('produto-imagem').src = variacao.imagem; 
        }

        seletor.addEventListener('click', () => {
            // Comentado: não troca a imagem principal ao clicar na cor
            // document.getElementById('produto-imagem').src = variacao.imagem; 
            
            // Apenas atualiza qual bolinha está ativa
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
        // Pega a cor do 'title' da bolinha ativa, ou a cor da primeira variação se não houver seletor
        const corSelecionadaNome = seletorAtivo ? seletorAtivo.title : (produto.variacoes && produto.variacoes.length > 0 ? produto.variacoes[0].cor : 'N/A');
        
        // Encontra a variação completa correspondente à cor selecionada
        const variacaoSelecionada = produto.variacoes.find(v => v.cor === corSelecionadaNome) || produto.variacoes[0]; // Fallback para primeira variação
        
        const itemParaCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            variacaoId: `${produto.id}-${variacaoSelecionada.cor}`,
            cor: variacaoSelecionada.cor,
            // Usa a imagem da variação selecionada para o carrinho (mesmo que seja igual à principal)
            imagem: variacaoSelecionada.imagem, 
        };

        adicionarAoCarrinho(itemParaCarrinho);
    });
}

function adicionarAoCarrinho(item) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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