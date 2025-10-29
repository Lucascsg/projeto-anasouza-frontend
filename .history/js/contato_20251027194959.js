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
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio real

            const nome = document.getElementById('nome-contato').value.trim();
            const email = document.getElementById('email-contato').value.trim();
            const mensagem = document.getElementById('mensagem-contato').value.trim();

            if (nome === '' || email === '' || mensagem === '') {
                showAlert('Por favor, preencha todos os campos.', 'warning');
                return;
            }

            // Simula o envio
            console.log("Simulando envio de mensagem:", { nome, email, mensagem });
            showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset(); // Limpa o formulário
        });
    }

    // Chama a função para garantir que o contador do carrinho apareça corretamente
    if (typeof atualizarContadorCarrinho === "function") {
        atualizarContadorCarrinho();
    }
});