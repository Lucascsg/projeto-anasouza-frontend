async function carregarPostCompleto(id) {
    try {
        // --- ALTERAÇÃO PRINCIPAL AQUI ---
        // Busca diretamente o post específico na API Back-End usando o ID
        const response = await fetch(`http://localhost:8080/api/blog/${id}`); 

        // Verifica se a resposta da API foi bem-sucedida (status 200 OK)
        if (!response.ok) {
            if (response.status === 404) {
                 // Trata o caso de post não encontrado
                 const postContent = document.getElementById('post-conteudo');
                 if(postContent) postContent.innerHTML = '<p class="text-danger">Post não encontrado.</p>';
                 // Esconde ou limpa outros campos se necessário
                 document.getElementById('post-titulo').textContent = "Erro";
                 document.getElementById('post-data').textContent = "";
                 const imgElement = document.getElementById('post-imagem');
                 if(imgElement) imgElement.style.display = 'none'; 
            } else {
                // Lança outros erros HTTP
                throw new Error(`Erro HTTP ao buscar post: ${response.status}`); 
            }
            return; // Interrompe a função
        }
        
        // Converte a resposta JSON diretamente para o objeto do post único
        const post = await response.json(); 

        // Se chegou aqui, o post foi encontrado e convertido, então exibe
        exibirPost(post);

    } catch (error) {
        // Captura erros de rede ou erros lançados
        console.error('Erro ao carregar o post:', error);
        const postContent = document.getElementById('post-conteudo');
        if(postContent) postContent.innerHTML = '<p class="text-danger">Erro ao carregar informações do post. Verifique se o servidor Back-End está rodando.</p>';
    }
}

// A função exibirPost continua a mesma
function exibirPost(post) {
    document.title = post.titulo + " - Ana Souza";
    document.getElementById('post-imagem').src = post.imagem;
    document.getElementById('post-imagem').alt = post.titulo;
    document.getElementById('post-titulo').textContent = post.titulo;
    document.getElementById('post-data').textContent = post.data;
    document.getElementById('post-conteudo').innerHTML = post.conteudo; // Usa innerHTML para renderizar tags <p>
}

// A função atualizarContadorCarrinho continua a mesma
function atualizarContadorCarrinho() {
    // ... (código completo da função)
}