document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const alertPlaceholder = document.getElementById('alert-placeholder-contato');

    const showAlert = (message, type) => {
        alertPlaceholder.innerHTML = 
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
               ${message}
               <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => { // Tornamos async
            event.preventDefault(); // Impede o envio real
            alertPlaceholder.innerHTML = ''; // Limpa alertas

            const nome = document.getElementById('nome-contato').value.trim();
            const email = document.getElementById('email-contato').value.trim();
            const mensagem = document.getElementById('mensagem-contato').value.trim();

            if (nome === '' || email === '' || mensagem === '') {
                showAlert('Por favor, preencha todos os campos.', 'warning');
                return;
            }

            // --- CONEXÃO COM O BACK-END ---
            try {
                const response = await fetch('http://localhost:8080/api/contato', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({ 
                        nome: nome, 
                        email: email, 
                        mensagem: mensagem 
                    }),
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok) { // 200 OK
                    showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                    contactForm.reset(); // Limpa o formulário
                } else {
                    // Mostra erro vindo do backend
                    showAlert(data.message || 'Erro ao enviar mensagem.', 'danger');
                }

            } catch (error) {
                // Erro de rede
                console.error('Erro ao tentar enviar mensagem:', error);
                showAlert('Erro de conexão. Não foi possível conectar ao servidor.', 'danger');
            }
            // --- FIM DA CONEXÃO ---
        });
    }

    // Chama a função para garantir que o contador do carrinho apareça corretamente
    if (typeof atualizarContadorCarrinho === "function") {
        atualizarContadorCarrinho();
    }
});