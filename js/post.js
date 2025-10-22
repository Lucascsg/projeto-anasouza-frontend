document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Sempre atualiza o contador do carrinho, em qualquer página
    atualizarContadorCarrinho();

    if (postId) {
        carregarPostCompleto(postId);
    } else {
        // Se não houver ID na URL, exibe erro
        const postContent = document.getElementById('post-conteudo');
        if(postContent) postContent.innerHTML = '<p class="text-danger">Post não especificado.</p>';
    }
});

async function carregarPostCompleto(id) {
    try {
        const response = await fetch('blog.json');
        const posts = await response.json();
        const post = posts.find(p => p.id == id);

        if (post) {
            exibirPost(post);
        } else {
            const postContent = document.getElementById('post-conteudo');
            if(postContent) postContent.innerHTML = '<p class="text-danger">Post não encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar o post:', error);
    }
}

function exibirPost(post) {
    document.title = post.titulo + " - Ana Souza";

    document.getElementById('post-imagem').src = post.imagem;
    document.getElementById('post-imagem').alt = post.titulo;
    document.getElementById('post-titulo').textContent = post.titulo;
    document.getElementById('post-data').textContent = post.data;
    
    // Usamos innerHTML aqui para que as tags <p> do nosso JSON sejam renderizadas como HTML
    document.getElementById('post-conteudo').innerHTML = post.conteudo;
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