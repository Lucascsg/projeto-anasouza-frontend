document.addEventListener('DOMContentLoaded', function() {
    carregarPosts();
    atualizarContadorCarrinho(); // Garante que o contador do carrinho funcione nesta página também
    AOS.init();
});

async function carregarPosts() {
    const listaPosts = document.getElementById('lista-posts');
    if (!listaPosts) return;

    try {
        const response = await fetch('http://localhost:8080/api/blog');
        const posts = await response.json();

        listaPosts.innerHTML = ''; // Limpa o container

        posts.forEach(post => {
            const postHTML = `
                <div class="col-md-6 col-lg-4" data-aos="fade-up">
                    <div class="card product-card h-100">
                        <img src="${post.imagem}" class="card-img-top" alt="${post.titulo}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${post.titulo}</h5>
                            <p class="card-text text-muted small">${post.data}</p>
                            <p class="card-text text-muted">${post.resumo}</p>
                            <a href="post.html?id=${post.id}" class="btn btn-outline-dark mt-auto">Leia Mais</a>
                        </div>
                    </div>
                </div>
            `;
            listaPosts.innerHTML += postHTML;
        });

    } catch (error) {
        console.error('Erro ao carregar os posts do blog:', error);
        listaPosts.innerHTML = '<p class="text-danger">Não foi possível carregar os posts no momento.</p>';
    }
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