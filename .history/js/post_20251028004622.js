document.addEventListener('DOMContentLoaded', function() {
    console.log("post.js: DOMContentLoaded iniciado."); // Log para verificar execução

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    console.log("post.js: ID do post encontrado na URL:", postId); // Log para verificar ID

    atualizarContadorCarrinho(); // Garante que o contador do carrinho funcione nesta página também

    if (postId) {
        carregarPostCompleto(postId);
    } else {
        console.error("post.js: Nenhum ID de post encontrado na URL.");
        // Se não houver ID na URL, exibe erro
        const postContent = document.getElementById('post-conteudo');
        if(postContent) postContent.innerHTML = '<p class="text-danger">Post não especificado.</p>';
    }
});

async function carregarPostCompleto(id) {
    console.log(`post.js: Iniciando fetch para /api/blog/${id}`); // Log antes do fetch
    try {
        const response = await fetch(`http://localhost:8080/api/blog/${id}`); 
        console.log("post.js: Resposta do fetch recebida. Status:", response.status); // Log após fetch

        if (!response.ok) {
            if (response.status === 404) {
                 console.warn("post.js: Post não encontrado (404).");
                 const postContent = document.getElementById('post-conteudo');
                 if(postContent) postContent.innerHTML = '<p class="text-danger">Post não encontrado.</p>';
                 document.getElementById('post-titulo').textContent = "Erro 404";
                 document.getElementById('post-data').textContent = "";
                 const imgElement = document.getElementById('post-imagem');
                 if(imgElement) imgElement.style.display = 'none'; 
            } else {
                throw new Error(`Erro HTTP ao buscar post: ${response.status}`); 
            }
            return; 
        }
        
        const post = await response.json(); 
        console.log("post.js: Dados do post recebidos:", post); // Log dos dados recebidos

        exibirPost(post);

    } catch (error) {
        console.error('post.js: Erro CRÍTICO ao carregar o post:', error); // Log de erro crítico
        const postContent = document.getElementById('post-conteudo');
        if(postContent) postContent.innerHTML = '<p class="text-danger">Erro ao carregar informações do post. Verifique o console e se o servidor Back-End está rodando.</p>';
    }
}

function exibirPost(post) {
    console.log("post.js: Iniciando exibição do post:", post.titulo); // Log ao iniciar exibição
    try {
        document.title = post.titulo + " - Ana Souza";
        
        // Elementos que SEMPRE devem existir (verifique os IDs no seu HTML)
        const imgElement = document.getElementById('post-imagem');
        const tituloElement = document.getElementById('post-titulo');
        const dataElement = document.getElementById('post-data');
        const conteudoElement = document.getElementById('post-conteudo');

        if (imgElement) {
            imgElement.src = post.imagem || 'https://via.placeholder.com/800x400'; // Fallback
            imgElement.alt = post.titulo;
            imgElement.style.display = 'block'; // Garante que esteja visível
        } else { console.error("Elemento #post-imagem não encontrado!"); }

        if (tituloElement) {
            tituloElement.textContent = post.titulo;
        } else { console.error("Elemento #post-titulo não encontrado!"); }

        if (dataElement) {
            dataElement.textContent = post.data || ''; // Usa string vazia se data não existir
        } else { console.error("Elemento #post-data não encontrado!"); }

        if (conteudoElement) {
            conteudoElement.innerHTML = post.conteudo || '<p>Conteúdo não disponível.</p>'; // Usa innerHTML
        } else { console.error("Elemento #post-conteudo não encontrado!"); }

        console.log("post.js: Exibição do post concluída.");
    } catch (error) {
        console.error("post.js: Erro DENTRO da função exibirPost:", error);
    }
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